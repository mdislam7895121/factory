import { HttpClient } from './client.js';
import { SandboxResource } from './resources/sandbox.js';
import { MemoryResource } from './resources/memory.js';
import { CouncilResource } from './resources/council.js';
import { LoopsResource } from './resources/loops.js';
import { UsageResource } from './resources/usage.js';
import { ApiKeysResource } from './resources/api-keys.js';
import type { PerpetualConfig } from './types.js';

export class Perpetual {
  readonly sandbox: SandboxResource;
  readonly memory: MemoryResource;
  readonly council: CouncilResource;
  readonly loops: LoopsResource;
  readonly usage: UsageResource;
  readonly apiKeys: ApiKeysResource;

  constructor(config: PerpetualConfig) {
    const http = new HttpClient(config);
    this.sandbox = new SandboxResource(http);
    this.memory = new MemoryResource(http);
    this.council = new CouncilResource(http);
    this.loops = new LoopsResource(http);
    this.usage = new UsageResource(http);
    this.apiKeys = new ApiKeysResource(http);
  }
}

export { PerpetualError } from './types.js';
export type {
  PerpetualConfig,
  Sandbox, RunResult,
  ApiKey,
  MemoryEntry, MemoryKeyList,
  CouncilSession, CouncilResult, CouncilMessage,
  LoopConfig, LoopRun,
  UsageToday, UsageSummary,
} from './types.js';
