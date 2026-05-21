import { Injectable } from '@nestjs/common';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const PREVIEW_SHARE_SECRET = (process.env.PREVIEW_SHARE_SECRET ?? '').trim();

export interface PreviewTokenPayload {
  rid:    string;   // runtimeId
  sub?:   string;   // userId
  scope:  string;   // always "preview"
  iat:    number;
  exp:    number;
  jti:    string;   // nonce — replay resistance
}

function b64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64url');
}

@Injectable()
export class PreviewTokenService {
  // 05-05: Issue a short-lived HMAC-signed preview token
  issue(runtimeId: string, expiresInSec: number, sub?: string): string {
    if (!PREVIEW_SHARE_SECRET) throw new Error('PREVIEW_SHARE_SECRET is not configured');
    const now = Math.floor(Date.now() / 1000);
    const payload: PreviewTokenPayload = {
      rid:   runtimeId,
      sub,
      scope: 'preview',
      iat:   now,
      exp:   now + expiresInSec,
      jti:   randomBytes(8).toString('hex'),
    };
    const header  = b64url('{"alg":"HS256","typ":"preview"}');
    const body    = b64url(JSON.stringify(payload));
    const signing = `${header}.${body}`;
    const sig     = createHmac('sha256', PREVIEW_SHARE_SECRET).update(signing).digest();
    return `${signing}.${b64url(sig)}`;
  }

  // 05-05: Verify — throws on bad signature, expiry, or malformed token
  verify(token: string): PreviewTokenPayload {
    if (!PREVIEW_SHARE_SECRET) throw new Error('PREVIEW_SHARE_SECRET is not configured');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('malformed token');
    const [header, body, sigB64] = parts;
    const signing  = `${header}.${body}`;
    const expected = createHmac('sha256', PREVIEW_SHARE_SECRET).update(signing).digest();
    const provided = Buffer.from(sigB64, 'base64url');
    if (
      provided.length !== expected.length ||
      !timingSafeEqual(provided, expected)
    ) {
      throw new Error('invalid signature');
    }
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as PreviewTokenPayload;
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      throw new Error('token expired');
    }
    return payload;
  }
}
