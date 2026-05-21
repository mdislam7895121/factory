import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { createConnection } from 'node:net';
import path from 'node:path';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import type { Request, Response } from 'express';
import { RuntimeStatus, RuntimeVisibility } from '../generated/prisma';
import type { RuntimeInstance } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { RuntimeService } from '../sandbox/runtime/runtime.service';
import { PreviewTokenService } from './preview-token.service';

const ORCHESTRATOR_URL     = (process.env.ORCHESTRATOR_URL     ?? 'http://localhost:4100').trim();
const ORCHESTRATOR_API_KEY = (process.env.ORCHESTRATOR_API_KEY ?? '').trim();
const WAKE_TIMEOUT_MS      = parseInt(process.env.PREVIEW_GATEWAY_WAKE_TIMEOUT_MS ?? '30000', 10);

// 05-03: Private IP ranges that must never be proxy targets from user input
const PRIVATE_HOST_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|0\.0\.0\.0|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;
const METADATA_HOSTS  = new Set(['169.254.169.254', 'metadata.google.internal', '100.100.100.200']);

@Injectable()
export class PreviewService {
  private readonly logger = new Logger(PreviewService.name);

  constructor(
    private readonly prisma:        PrismaService,
    private readonly runtimeService: RuntimeService,
    private readonly tokenService:  PreviewTokenService,
  ) {}

  // 05-02: Resolve RuntimeInstance by UUID or slug
  async resolve(id: string): Promise<RuntimeInstance> {
    let runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });

    // Slug lookup via PreviewRoute
    if (!runtime) {
      const route = await this.prisma.previewRoute.findUnique({
        where: { slug: id, isActive: true },
      });
      if (route) {
        runtime = await this.prisma.runtimeInstance.findUnique({
          where: { id: route.runtimeId },
        });
      }
    }

    if (!runtime || runtime.status === RuntimeStatus.TERMINATED) {
      throw new NotFoundException('preview not found');
    }
    return runtime;
  }

  // 05-04: Access check — token → owner → visibility rules
  async checkAccess(
    runtime: RuntimeInstance,
    opts: { requesterId?: string; password?: string; token?: string },
  ): Promise<boolean> {
    if (opts.token) {
      try {
        const p = this.tokenService.verify(opts.token);
        if (p.rid === runtime.id && p.scope === 'preview') return true;
      } catch {
        // invalid / expired token — fall through
      }
    }

    switch (runtime.visibility) {
      case RuntimeVisibility.PUBLIC:
        return true;
      case RuntimeVisibility.PRIVATE:
      case RuntimeVisibility.TEAM:
        return runtime.ownerUserId === opts.requesterId;
      case RuntimeVisibility.PASSWORD:
        if (runtime.ownerUserId === opts.requesterId) return true;
        if (!opts.password || !runtime.passwordHash) return false;
        return compare(opts.password, runtime.passwordHash);
    }
  }

  // 05-07: Wake sleeping runtime and poll until RUNNING
  async wakeIfNeeded(id: string): Promise<void> {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime) return;
    if (runtime.status === RuntimeStatus.RUNNING) return;
    if (
      runtime.status !== RuntimeStatus.SLEEPING &&
      runtime.status !== RuntimeStatus.PROVISIONING
    ) {
      throw new ServiceUnavailableException('runtime not available');
    }

    if (runtime.status === RuntimeStatus.SLEEPING) {
      await this.runtimeService.wake(id);
    }

    const deadline = Date.now() + WAKE_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await new Promise<void>((r) => setTimeout(r, 1000));
      const current = await this.prisma.runtimeInstance.findUnique({
        where:  { id },
        select: { status: true },
      });
      if (current?.status === RuntimeStatus.RUNNING) return;
      if (
        current?.status === RuntimeStatus.CRASHED ||
        current?.status === RuntimeStatus.TERMINATED
      ) {
        throw new ServiceUnavailableException('runtime crashed during wake');
      }
    }
    throw new GatewayTimeoutException('runtime wake timed out');
  }

  // 05-03: Validate proxy target is from registry (SSRF guard)
  assertSsrfSafe(port: number | null): void {
    if (!port || port < 1024 || port > 65535) {
      throw new BadGatewayException('runtime not ready: no port assigned');
    }
    // ORCHESTRATOR_URL is an env var — never user-controlled — but sanity-check it
    if (!ORCHESTRATOR_URL || /[\r\n<>"'`]/.test(ORCHESTRATOR_URL)) {
      throw new BadGatewayException('invalid orchestrator configuration');
    }
  }

  // 05-03: Block free-form user-supplied hosts
  assertHostNotPrivate(host: string, port: number): void {
    if (PRIVATE_HOST_RE.test(host) || METADATA_HOSTS.has(host)) {
      throw new ForbiddenException('SSRF: private host blocked');
    }
    if (port < 1024 || port > 65535) {
      throw new ForbiddenException('SSRF: invalid port');
    }
  }

  // 05-03: Sanitize proxy path — block traversal / encoded tricks
  sanitizePath(rawPath: string): string {
    const [pathPart = '/', ...queryParts] = rawPath.split('?');
    const normalized = path.posix.normalize(pathPart || '/');
    if (!normalized.startsWith('/')) throw new BadRequestException('invalid path');
    return queryParts.length > 0 ? `${normalized}?${queryParts.join('?')}` : normalized;
  }

  // 05-02 + 05-03: HTTP proxy through orchestrator → runtime container
  async proxyHttp(
    runtime:  RuntimeInstance,
    rawPath:  string,
    req:      Request,
    res:      Response,
  ): Promise<number> {
    this.assertSsrfSafe(runtime.internalPort);

    const projectId = runtime.projectId ?? runtime.id;
    const safePath  = this.sanitizePath(rawPath || '/');
    const target    = `${ORCHESTRATOR_URL}/v1/preview/${encodeURIComponent(projectId)}${safePath}`;

    let statusCode = 502;
    try {
      const headers: Record<string, string> = {
        accept:              (req.headers.accept as string) || '*/*',
        'x-api-key':         ORCHESTRATOR_API_KEY,
        'x-runtime-id':      runtime.id,
        'x-forwarded-for':   this.extractIp(req),
      };
      const ct = req.headers['content-type'] as string | undefined;
      if (ct) headers['content-type'] = ct;

      const upstream = await fetch(target, {
        method:  req.method,
        headers,
        // rawBody is set by NestFactory({ rawBody: true })
        body: ['GET', 'HEAD'].includes(req.method)
          ? undefined
          : ((req as Request & { rawBody?: Buffer }).rawBody as unknown as BodyInit | undefined),
      });

      statusCode = upstream.status;
      res.status(upstream.status);

      const upCt = upstream.headers.get('content-type');
      if (upCt) res.setHeader('content-type', upCt);

      // 05-09: Mobile-safe + preview security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      // Permissive CSP — live apps load arbitrary resources
      res.setHeader(
        'Content-Security-Policy',
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
      );
      res.setHeader('Cache-Control', 'no-store');

      const buf = Buffer.from(await upstream.arrayBuffer());
      res.send(buf);
    } catch (err) {
      this.logger.warn({ err, runtimeId: runtime.id }, 'preview proxy upstream error');
      if (!res.headersSent) {
        res.status(502).json({ ok: false, error: 'preview upstream error' });
      }
    }
    return statusCode;
  }

  // 05-06: WebSocket proxy — tunnel raw TCP through to orchestrator's WS preview endpoint
  proxyWs(
    runtime:  RuntimeInstance,
    subPath:  string,
    search:   string,
    req:      IncomingMessage,
    socket:   Duplex,
    head:     Buffer,
  ): void {
    const projectId = runtime.projectId ?? runtime.id;
    const orchUrl   = new URL(ORCHESTRATOR_URL);
    const orchPort  = parseInt(orchUrl.port || (orchUrl.protocol === 'https:' ? '443' : '80'), 10);
    const orchHost  = orchUrl.hostname;
    const safeSub   = this.sanitizePath(subPath || '/');
    const targetPath = `/v1/ws/preview/${encodeURIComponent(projectId)}${safeSub}${search}`;

    const upstream = createConnection(orchPort, orchHost);
    upstream.once('connect', () => {
      const secKey = (req.headers['sec-websocket-key'] as string) || '';
      const secVer = (req.headers['sec-websocket-version'] as string) || '13';
      const upgradeHeaders = [
        `GET ${targetPath} HTTP/1.1`,
        `Host: ${orchUrl.host}`,
        `Upgrade: websocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Key: ${secKey}`,
        `Sec-WebSocket-Version: ${secVer}`,
        `x-api-key: ${ORCHESTRATOR_API_KEY}`,
        `x-runtime-id: ${runtime.id}`,
      ].join('\r\n') + '\r\n\r\n';

      upstream.write(upgradeHeaders);
      if (head.length) upstream.write(head);

      socket.pipe(upstream);
      upstream.pipe(socket);
    });

    const cleanup = () => {
      try { socket.destroy(); }   catch { /* ignore */ }
      try { upstream.destroy(); } catch { /* ignore */ }
    };
    upstream.on('error', cleanup);
    socket.on('error', cleanup);
    socket.on('close', () => { try { upstream.destroy(); } catch { /* ignore */ } });
  }

  extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    return (
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      'unknown'
    ).trim();
  }
}
