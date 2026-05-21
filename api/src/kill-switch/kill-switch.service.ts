import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '../lib/redis/redis.service';

// 10-04: Granular kill switch names
export type KillSwitchName =
  | 'runtime_create'
  | 'previews'
  | 'remix'
  | 'maintenance'
  | 'readonly';

const ALL_SWITCHES: KillSwitchName[] = [
  'runtime_create', 'previews', 'remix', 'maintenance', 'readonly',
];

@Injectable()
export class KillSwitchService {
  constructor(private readonly redis: RedisService) {}

  // Check a specific switch — Redis dynamic state takes priority over env
  async isEnabled(name: KillSwitchName): Promise<boolean> {
    // Check Redis first (dynamic, operator-controlled)
    const redisKey = `${this.redis.prefix}:killswitch:${name}`;
    const val = await this.redis.client.get(redisKey).catch(() => null);
    if (val === '1') return true;

    // Fall back to env var (static, requires restart)
    const envKey = `KILL_SWITCH_${name.toUpperCase()}`;
    return (process.env[envKey] ?? '').trim() === '1';
  }

  async enable(name: KillSwitchName): Promise<void> {
    const key = `${this.redis.prefix}:killswitch:${name}`;
    await this.redis.client.set(key, '1');
  }

  async disable(name: KillSwitchName): Promise<void> {
    const key = `${this.redis.prefix}:killswitch:${name}`;
    await this.redis.client.del(key);
  }

  async getAll(): Promise<Record<KillSwitchName, boolean>> {
    const entries = await Promise.all(
      ALL_SWITCHES.map(async (name) => [name, await this.isEnabled(name)] as const),
    );
    return Object.fromEntries(entries) as Record<KillSwitchName, boolean>;
  }

  // Convenience — throws 503 if the named switch is active
  async assertNotBlocked(name: KillSwitchName, message?: string): Promise<void> {
    if (await this.isEnabled(name)) {
      throw new HttpException(
        { ok: false, error: 'SERVICE_UNAVAILABLE', message: message ?? `${name} is currently disabled` },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
