import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

const USER_ID_PATTERN = /^[a-zA-Z0-9._:-]{3,128}$/;

function normalizeUserId(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !USER_ID_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function readHeaderUserId(req: Request): string | null {
  const candidates = [
    req.headers['x-user-id'],
    req.headers['x-userid'],
    req.headers['x-factory-user-id'],
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const value of candidate) {
        const normalized = normalizeUserId(value);
        if (normalized) {
          return normalized;
        }
      }
      continue;
    }

    const normalized = normalizeUserId(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function readCookieValue(cookieHeader: string, key: string): string | null {
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawName, ...rest] = part.split('=');
    if (!rawName || rest.length === 0) {
      continue;
    }

    if (rawName.trim() !== key) {
      continue;
    }

    const rawValue = rest.join('=').trim();
    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

function readCookieUserId(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const value = readCookieValue(cookieHeader, 'factory_user_id');
  return normalizeUserId(value);
}

function readRequestUser(req: Request): string | null {
  const maybeRequest = req as Request & {
    user?: { id?: unknown; sub?: unknown; userId?: unknown };
  };

  const user = maybeRequest.user;
  if (!user) {
    return null;
  }

  return (
    normalizeUserId(user.id) ??
    normalizeUserId(user.sub) ??
    normalizeUserId(user.userId)
  );
}

export function getUserId(req: Request): string | null {
  return readRequestUser(req) ?? readHeaderUserId(req) ?? readCookieUserId(req);
}

export function requireUserId(req: Request): string {
  const userId = getUserId(req);
  if (!userId) {
    throw new UnauthorizedException('authentication required');
  }
  return userId;
}