import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const VALID_NAMESPACE = /^[a-z][a-z0-9-]{0,31}$/;
const VALID_KEY = /^[a-zA-Z0-9._/-]{1,128}$/;
const VALID_EVENT_TYPES = ['decision', 'action', 'observation', 'error', 'checkpoint'] as const;
type EventType = typeof VALID_EVENT_TYPES[number];

const MAX_VALUE_BYTES = 65_536; // 64 KiB per memory entry
const MAX_NAMESPACE_ENTRIES = 1_000;

@Injectable()
export class MemoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Key-Value Memory ─────────────────────────────────────────────────────

  async set(
    userId: string,
    namespace: string,
    key: string,
    value: unknown,
    ttlSecs?: number,
  ) {
    this.validateNamespace(namespace);
    this.validateKey(key);

    const serialized = JSON.stringify(value);
    if (Buffer.byteLength(serialized) > MAX_VALUE_BYTES) {
      throw new BadRequestException(`Value exceeds ${MAX_VALUE_BYTES} byte limit`);
    }

    const expiresAt = ttlSecs && ttlSecs > 0
      ? new Date(Date.now() + ttlSecs * 1000)
      : null;

    // Count entries in namespace for quota check (only on new writes)
    const existing = await this.prisma.agentMemory.findUnique({
      where: { userId_namespace_key: { userId, namespace, key } },
      select: { id: true },
    });

    if (!existing) {
      const count = await this.prisma.agentMemory.count({
        where: { userId, namespace },
      });
      if (count >= MAX_NAMESPACE_ENTRIES) {
        throw new BadRequestException(
          `Namespace "${namespace}" has reached the ${MAX_NAMESPACE_ENTRIES} entry limit`,
        );
      }
    }

    const entry = await this.prisma.agentMemory.upsert({
      where: { userId_namespace_key: { userId, namespace, key } },
      create: { userId, namespace, key, value: serialized, expiresAt },
      update: { value: serialized, expiresAt },
      select: { id: true, namespace: true, key: true, expiresAt: true, updatedAt: true },
    });

    return { id: entry.id, namespace, key, expires_at: entry.expiresAt, updated_at: entry.updatedAt };
  }

  async get(userId: string, namespace: string, key: string) {
    this.validateNamespace(namespace);
    this.validateKey(key);

    const entry = await this.prisma.agentMemory.findUnique({
      where: { userId_namespace_key: { userId, namespace, key } },
    });

    if (!entry) throw new NotFoundException(`Memory key "${key}" not found`);

    if (entry.expiresAt && entry.expiresAt <= new Date()) {
      await this.prisma.agentMemory.delete({
        where: { id: entry.id },
      }).catch(() => {});
      throw new NotFoundException(`Memory key "${key}" has expired`);
    }

    return {
      namespace,
      key,
      value: JSON.parse(entry.value) as unknown,
      expires_at: entry.expiresAt,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    };
  }

  async list(userId: string, namespace: string) {
    this.validateNamespace(namespace);

    const now = new Date();
    const entries = await this.prisma.agentMemory.findMany({
      where: {
        userId,
        namespace,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { updatedAt: 'desc' },
      select: { key: true, expiresAt: true, updatedAt: true },
    });

    return {
      namespace,
      count: entries.length,
      keys: entries.map((e) => ({
        key: e.key,
        expires_at: e.expiresAt,
        updated_at: e.updatedAt,
      })),
    };
  }

  async delete(userId: string, namespace: string, key: string) {
    this.validateNamespace(namespace);
    this.validateKey(key);

    const entry = await this.prisma.agentMemory.findUnique({
      where: { userId_namespace_key: { userId, namespace, key } },
      select: { id: true },
    });
    if (!entry) throw new NotFoundException(`Memory key "${key}" not found`);

    await this.prisma.agentMemory.delete({ where: { id: entry.id } });
    return { deleted: true, namespace, key };
  }

  async clearNamespace(userId: string, namespace: string) {
    this.validateNamespace(namespace);
    const { count } = await this.prisma.agentMemory.deleteMany({
      where: { userId, namespace },
    });
    return { deleted_count: count, namespace };
  }

  // ── Event Log ─────────────────────────────────────────────────────────────

  async logEvent(
    userId: string,
    namespace: string,
    eventType: string,
    payload: unknown,
  ) {
    this.validateNamespace(namespace);

    if (!VALID_EVENT_TYPES.includes(eventType as EventType)) {
      throw new BadRequestException(
        `Invalid event_type. Allowed: ${VALID_EVENT_TYPES.join(', ')}`,
      );
    }

    const serialized = JSON.stringify(payload);
    if (Buffer.byteLength(serialized) > MAX_VALUE_BYTES) {
      throw new BadRequestException('Payload too large');
    }

    const event = await this.prisma.agentEvent.create({
      data: { userId, namespace, eventType, payload: serialized },
      select: { id: true, namespace: true, eventType: true, createdAt: true },
    });

    return {
      id: event.id,
      namespace: event.namespace,
      event_type: event.eventType,
      created_at: event.createdAt,
    };
  }

  async getEvents(
    userId: string,
    namespace: string,
    limit = 50,
    before?: string,
  ) {
    this.validateNamespace(namespace);

    const take = Math.min(Math.max(1, limit), 200);
    const cursor = before ? { id: before } : undefined;

    const events = await this.prisma.agentEvent.findMany({
      where: { userId, namespace },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: { id: true, eventType: true, payload: true, createdAt: true },
    });

    return {
      namespace,
      events: events.map((e) => ({
        id: e.id,
        event_type: e.eventType,
        payload: JSON.parse(e.payload) as unknown,
        created_at: e.createdAt,
      })),
      has_more: events.length === take,
    };
  }

  // ── Housekeeping ──────────────────────────────────────────────────────────

  async purgeExpired(): Promise<number> {
    const { count } = await this.prisma.agentMemory.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    return count;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private validateNamespace(ns: string) {
    if (!VALID_NAMESPACE.test(ns)) {
      throw new BadRequestException(
        'namespace must be 1-32 lowercase alphanumeric characters or hyphens, starting with a letter',
      );
    }
  }

  private validateKey(key: string) {
    if (!VALID_KEY.test(key)) {
      throw new BadRequestException(
        'key must be 1-128 characters: letters, digits, ., _, /, -',
      );
    }
  }
}
