
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model HealthCheck
 * 
 */
export type HealthCheck = $Result.DefaultSelection<Prisma.$HealthCheckPayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProvisioningRun
 * 
 */
export type ProvisioningRun = $Result.DefaultSelection<Prisma.$ProvisioningRunPayload>
/**
 * Model PublicProject
 * 
 */
export type PublicProject = $Result.DefaultSelection<Prisma.$PublicProjectPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model Sandbox
 * 
 */
export type Sandbox = $Result.DefaultSelection<Prisma.$SandboxPayload>
/**
 * Model UsageLog
 * 
 */
export type UsageLog = $Result.DefaultSelection<Prisma.$UsageLogPayload>
/**
 * Model AgentMemory
 * 
 */
export type AgentMemory = $Result.DefaultSelection<Prisma.$AgentMemoryPayload>
/**
 * Model AgentEvent
 * 
 */
export type AgentEvent = $Result.DefaultSelection<Prisma.$AgentEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ProjectStatus: {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  READY: 'READY',
  FAILED: 'FAILED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const ProvisioningRunStatus: {
  RUNNING: 'RUNNING',
  READY: 'READY',
  FAILED: 'FAILED'
};

export type ProvisioningRunStatus = (typeof ProvisioningRunStatus)[keyof typeof ProvisioningRunStatus]


export const SandboxLanguage: {
  python: 'python',
  nodejs: 'nodejs',
  bash: 'bash'
};

export type SandboxLanguage = (typeof SandboxLanguage)[keyof typeof SandboxLanguage]


export const SandboxStatus: {
  CREATING: 'CREATING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  TERMINATED: 'TERMINATED',
  FAILED: 'FAILED'
};

export type SandboxStatus = (typeof SandboxStatus)[keyof typeof SandboxStatus]

}

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type ProvisioningRunStatus = $Enums.ProvisioningRunStatus

export const ProvisioningRunStatus: typeof $Enums.ProvisioningRunStatus

export type SandboxLanguage = $Enums.SandboxLanguage

export const SandboxLanguage: typeof $Enums.SandboxLanguage

export type SandboxStatus = $Enums.SandboxStatus

export const SandboxStatus: typeof $Enums.SandboxStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more HealthChecks
 * const healthChecks = await prisma.healthCheck.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more HealthChecks
   * const healthChecks = await prisma.healthCheck.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.healthCheck`: Exposes CRUD operations for the **HealthCheck** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HealthChecks
    * const healthChecks = await prisma.healthCheck.findMany()
    * ```
    */
  get healthCheck(): Prisma.HealthCheckDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.provisioningRun`: Exposes CRUD operations for the **ProvisioningRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProvisioningRuns
    * const provisioningRuns = await prisma.provisioningRun.findMany()
    * ```
    */
  get provisioningRun(): Prisma.ProvisioningRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.publicProject`: Exposes CRUD operations for the **PublicProject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PublicProjects
    * const publicProjects = await prisma.publicProject.findMany()
    * ```
    */
  get publicProject(): Prisma.PublicProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sandbox`: Exposes CRUD operations for the **Sandbox** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sandboxes
    * const sandboxes = await prisma.sandbox.findMany()
    * ```
    */
  get sandbox(): Prisma.SandboxDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usageLog`: Exposes CRUD operations for the **UsageLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageLogs
    * const usageLogs = await prisma.usageLog.findMany()
    * ```
    */
  get usageLog(): Prisma.UsageLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentMemory`: Exposes CRUD operations for the **AgentMemory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentMemories
    * const agentMemories = await prisma.agentMemory.findMany()
    * ```
    */
  get agentMemory(): Prisma.AgentMemoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentEvent`: Exposes CRUD operations for the **AgentEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentEvents
    * const agentEvents = await prisma.agentEvent.findMany()
    * ```
    */
  get agentEvent(): Prisma.AgentEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    HealthCheck: 'HealthCheck',
    Template: 'Template',
    Workspace: 'Workspace',
    Project: 'Project',
    ProvisioningRun: 'ProvisioningRun',
    PublicProject: 'PublicProject',
    User: 'User',
    ApiKey: 'ApiKey',
    Sandbox: 'Sandbox',
    UsageLog: 'UsageLog',
    AgentMemory: 'AgentMemory',
    AgentEvent: 'AgentEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "healthCheck" | "template" | "workspace" | "project" | "provisioningRun" | "publicProject" | "user" | "apiKey" | "sandbox" | "usageLog" | "agentMemory" | "agentEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      HealthCheck: {
        payload: Prisma.$HealthCheckPayload<ExtArgs>
        fields: Prisma.HealthCheckFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HealthCheckFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HealthCheckFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          findFirst: {
            args: Prisma.HealthCheckFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HealthCheckFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          findMany: {
            args: Prisma.HealthCheckFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>[]
          }
          create: {
            args: Prisma.HealthCheckCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          createMany: {
            args: Prisma.HealthCheckCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HealthCheckCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>[]
          }
          delete: {
            args: Prisma.HealthCheckDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          update: {
            args: Prisma.HealthCheckUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          deleteMany: {
            args: Prisma.HealthCheckDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HealthCheckUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HealthCheckUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>[]
          }
          upsert: {
            args: Prisma.HealthCheckUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HealthCheckPayload>
          }
          aggregate: {
            args: Prisma.HealthCheckAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHealthCheck>
          }
          groupBy: {
            args: Prisma.HealthCheckGroupByArgs<ExtArgs>
            result: $Utils.Optional<HealthCheckGroupByOutputType>[]
          }
          count: {
            args: Prisma.HealthCheckCountArgs<ExtArgs>
            result: $Utils.Optional<HealthCheckCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProvisioningRun: {
        payload: Prisma.$ProvisioningRunPayload<ExtArgs>
        fields: Prisma.ProvisioningRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProvisioningRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProvisioningRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          findFirst: {
            args: Prisma.ProvisioningRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProvisioningRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          findMany: {
            args: Prisma.ProvisioningRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>[]
          }
          create: {
            args: Prisma.ProvisioningRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          createMany: {
            args: Prisma.ProvisioningRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProvisioningRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>[]
          }
          delete: {
            args: Prisma.ProvisioningRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          update: {
            args: Prisma.ProvisioningRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          deleteMany: {
            args: Prisma.ProvisioningRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProvisioningRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProvisioningRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>[]
          }
          upsert: {
            args: Prisma.ProvisioningRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvisioningRunPayload>
          }
          aggregate: {
            args: Prisma.ProvisioningRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProvisioningRun>
          }
          groupBy: {
            args: Prisma.ProvisioningRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProvisioningRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProvisioningRunCountArgs<ExtArgs>
            result: $Utils.Optional<ProvisioningRunCountAggregateOutputType> | number
          }
        }
      }
      PublicProject: {
        payload: Prisma.$PublicProjectPayload<ExtArgs>
        fields: Prisma.PublicProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PublicProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PublicProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          findFirst: {
            args: Prisma.PublicProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PublicProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          findMany: {
            args: Prisma.PublicProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>[]
          }
          create: {
            args: Prisma.PublicProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          createMany: {
            args: Prisma.PublicProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PublicProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>[]
          }
          delete: {
            args: Prisma.PublicProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          update: {
            args: Prisma.PublicProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          deleteMany: {
            args: Prisma.PublicProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PublicProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PublicProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>[]
          }
          upsert: {
            args: Prisma.PublicProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PublicProjectPayload>
          }
          aggregate: {
            args: Prisma.PublicProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePublicProject>
          }
          groupBy: {
            args: Prisma.PublicProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<PublicProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.PublicProjectCountArgs<ExtArgs>
            result: $Utils.Optional<PublicProjectCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      Sandbox: {
        payload: Prisma.$SandboxPayload<ExtArgs>
        fields: Prisma.SandboxFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SandboxFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SandboxFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          findFirst: {
            args: Prisma.SandboxFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SandboxFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          findMany: {
            args: Prisma.SandboxFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>[]
          }
          create: {
            args: Prisma.SandboxCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          createMany: {
            args: Prisma.SandboxCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SandboxCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>[]
          }
          delete: {
            args: Prisma.SandboxDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          update: {
            args: Prisma.SandboxUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          deleteMany: {
            args: Prisma.SandboxDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SandboxUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SandboxUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>[]
          }
          upsert: {
            args: Prisma.SandboxUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SandboxPayload>
          }
          aggregate: {
            args: Prisma.SandboxAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSandbox>
          }
          groupBy: {
            args: Prisma.SandboxGroupByArgs<ExtArgs>
            result: $Utils.Optional<SandboxGroupByOutputType>[]
          }
          count: {
            args: Prisma.SandboxCountArgs<ExtArgs>
            result: $Utils.Optional<SandboxCountAggregateOutputType> | number
          }
        }
      }
      UsageLog: {
        payload: Prisma.$UsageLogPayload<ExtArgs>
        fields: Prisma.UsageLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          findFirst: {
            args: Prisma.UsageLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          findMany: {
            args: Prisma.UsageLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>[]
          }
          create: {
            args: Prisma.UsageLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          createMany: {
            args: Prisma.UsageLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>[]
          }
          delete: {
            args: Prisma.UsageLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          update: {
            args: Prisma.UsageLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          deleteMany: {
            args: Prisma.UsageLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsageLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>[]
          }
          upsert: {
            args: Prisma.UsageLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageLogPayload>
          }
          aggregate: {
            args: Prisma.UsageLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageLog>
          }
          groupBy: {
            args: Prisma.UsageLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageLogCountArgs<ExtArgs>
            result: $Utils.Optional<UsageLogCountAggregateOutputType> | number
          }
        }
      }
      AgentMemory: {
        payload: Prisma.$AgentMemoryPayload<ExtArgs>
        fields: Prisma.AgentMemoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentMemoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentMemoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          findFirst: {
            args: Prisma.AgentMemoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentMemoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          findMany: {
            args: Prisma.AgentMemoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>[]
          }
          create: {
            args: Prisma.AgentMemoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          createMany: {
            args: Prisma.AgentMemoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentMemoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>[]
          }
          delete: {
            args: Prisma.AgentMemoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          update: {
            args: Prisma.AgentMemoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          deleteMany: {
            args: Prisma.AgentMemoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentMemoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentMemoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>[]
          }
          upsert: {
            args: Prisma.AgentMemoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentMemoryPayload>
          }
          aggregate: {
            args: Prisma.AgentMemoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentMemory>
          }
          groupBy: {
            args: Prisma.AgentMemoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentMemoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentMemoryCountArgs<ExtArgs>
            result: $Utils.Optional<AgentMemoryCountAggregateOutputType> | number
          }
        }
      }
      AgentEvent: {
        payload: Prisma.$AgentEventPayload<ExtArgs>
        fields: Prisma.AgentEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          findFirst: {
            args: Prisma.AgentEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          findMany: {
            args: Prisma.AgentEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>[]
          }
          create: {
            args: Prisma.AgentEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          createMany: {
            args: Prisma.AgentEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>[]
          }
          delete: {
            args: Prisma.AgentEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          update: {
            args: Prisma.AgentEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          deleteMany: {
            args: Prisma.AgentEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>[]
          }
          upsert: {
            args: Prisma.AgentEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentEventPayload>
          }
          aggregate: {
            args: Prisma.AgentEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentEvent>
          }
          groupBy: {
            args: Prisma.AgentEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentEventCountArgs<ExtArgs>
            result: $Utils.Optional<AgentEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    healthCheck?: HealthCheckOmit
    template?: TemplateOmit
    workspace?: WorkspaceOmit
    project?: ProjectOmit
    provisioningRun?: ProvisioningRunOmit
    publicProject?: PublicProjectOmit
    user?: UserOmit
    apiKey?: ApiKeyOmit
    sandbox?: SandboxOmit
    usageLog?: UsageLogOmit
    agentMemory?: AgentMemoryOmit
    agentEvent?: AgentEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    projects: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    provisioningRuns: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    provisioningRuns?: boolean | ProjectCountOutputTypeCountProvisioningRunsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountProvisioningRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProvisioningRunWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    apiKeys: number
    sandboxes: number
    agentMemories: number
    agentEvents: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKeys?: boolean | UserCountOutputTypeCountApiKeysArgs
    sandboxes?: boolean | UserCountOutputTypeCountSandboxesArgs
    agentMemories?: boolean | UserCountOutputTypeCountAgentMemoriesArgs
    agentEvents?: boolean | UserCountOutputTypeCountAgentEventsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSandboxesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SandboxWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAgentMemoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentMemoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAgentEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentEventWhereInput
  }


  /**
   * Count Type SandboxCountOutputType
   */

  export type SandboxCountOutputType = {
    usageLogs: number
  }

  export type SandboxCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usageLogs?: boolean | SandboxCountOutputTypeCountUsageLogsArgs
  }

  // Custom InputTypes
  /**
   * SandboxCountOutputType without action
   */
  export type SandboxCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SandboxCountOutputType
     */
    select?: SandboxCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SandboxCountOutputType without action
   */
  export type SandboxCountOutputTypeCountUsageLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model HealthCheck
   */

  export type AggregateHealthCheck = {
    _count: HealthCheckCountAggregateOutputType | null
    _min: HealthCheckMinAggregateOutputType | null
    _max: HealthCheckMaxAggregateOutputType | null
  }

  export type HealthCheckMinAggregateOutputType = {
    id: string | null
    message: string | null
    createdAt: Date | null
  }

  export type HealthCheckMaxAggregateOutputType = {
    id: string | null
    message: string | null
    createdAt: Date | null
  }

  export type HealthCheckCountAggregateOutputType = {
    id: number
    message: number
    createdAt: number
    _all: number
  }


  export type HealthCheckMinAggregateInputType = {
    id?: true
    message?: true
    createdAt?: true
  }

  export type HealthCheckMaxAggregateInputType = {
    id?: true
    message?: true
    createdAt?: true
  }

  export type HealthCheckCountAggregateInputType = {
    id?: true
    message?: true
    createdAt?: true
    _all?: true
  }

  export type HealthCheckAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HealthCheck to aggregate.
     */
    where?: HealthCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HealthChecks to fetch.
     */
    orderBy?: HealthCheckOrderByWithRelationInput | HealthCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HealthCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HealthChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HealthChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HealthChecks
    **/
    _count?: true | HealthCheckCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HealthCheckMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HealthCheckMaxAggregateInputType
  }

  export type GetHealthCheckAggregateType<T extends HealthCheckAggregateArgs> = {
        [P in keyof T & keyof AggregateHealthCheck]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHealthCheck[P]>
      : GetScalarType<T[P], AggregateHealthCheck[P]>
  }




  export type HealthCheckGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HealthCheckWhereInput
    orderBy?: HealthCheckOrderByWithAggregationInput | HealthCheckOrderByWithAggregationInput[]
    by: HealthCheckScalarFieldEnum[] | HealthCheckScalarFieldEnum
    having?: HealthCheckScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HealthCheckCountAggregateInputType | true
    _min?: HealthCheckMinAggregateInputType
    _max?: HealthCheckMaxAggregateInputType
  }

  export type HealthCheckGroupByOutputType = {
    id: string
    message: string
    createdAt: Date
    _count: HealthCheckCountAggregateOutputType | null
    _min: HealthCheckMinAggregateOutputType | null
    _max: HealthCheckMaxAggregateOutputType | null
  }

  type GetHealthCheckGroupByPayload<T extends HealthCheckGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HealthCheckGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HealthCheckGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HealthCheckGroupByOutputType[P]>
            : GetScalarType<T[P], HealthCheckGroupByOutputType[P]>
        }
      >
    >


  export type HealthCheckSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    message?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["healthCheck"]>

  export type HealthCheckSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    message?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["healthCheck"]>

  export type HealthCheckSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    message?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["healthCheck"]>

  export type HealthCheckSelectScalar = {
    id?: boolean
    message?: boolean
    createdAt?: boolean
  }

  export type HealthCheckOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "message" | "createdAt", ExtArgs["result"]["healthCheck"]>

  export type $HealthCheckPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HealthCheck"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      message: string
      createdAt: Date
    }, ExtArgs["result"]["healthCheck"]>
    composites: {}
  }

  type HealthCheckGetPayload<S extends boolean | null | undefined | HealthCheckDefaultArgs> = $Result.GetResult<Prisma.$HealthCheckPayload, S>

  type HealthCheckCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HealthCheckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HealthCheckCountAggregateInputType | true
    }

  export interface HealthCheckDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HealthCheck'], meta: { name: 'HealthCheck' } }
    /**
     * Find zero or one HealthCheck that matches the filter.
     * @param {HealthCheckFindUniqueArgs} args - Arguments to find a HealthCheck
     * @example
     * // Get one HealthCheck
     * const healthCheck = await prisma.healthCheck.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HealthCheckFindUniqueArgs>(args: SelectSubset<T, HealthCheckFindUniqueArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HealthCheck that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HealthCheckFindUniqueOrThrowArgs} args - Arguments to find a HealthCheck
     * @example
     * // Get one HealthCheck
     * const healthCheck = await prisma.healthCheck.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HealthCheckFindUniqueOrThrowArgs>(args: SelectSubset<T, HealthCheckFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HealthCheck that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckFindFirstArgs} args - Arguments to find a HealthCheck
     * @example
     * // Get one HealthCheck
     * const healthCheck = await prisma.healthCheck.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HealthCheckFindFirstArgs>(args?: SelectSubset<T, HealthCheckFindFirstArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HealthCheck that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckFindFirstOrThrowArgs} args - Arguments to find a HealthCheck
     * @example
     * // Get one HealthCheck
     * const healthCheck = await prisma.healthCheck.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HealthCheckFindFirstOrThrowArgs>(args?: SelectSubset<T, HealthCheckFindFirstOrThrowArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HealthChecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HealthChecks
     * const healthChecks = await prisma.healthCheck.findMany()
     * 
     * // Get first 10 HealthChecks
     * const healthChecks = await prisma.healthCheck.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const healthCheckWithIdOnly = await prisma.healthCheck.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HealthCheckFindManyArgs>(args?: SelectSubset<T, HealthCheckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HealthCheck.
     * @param {HealthCheckCreateArgs} args - Arguments to create a HealthCheck.
     * @example
     * // Create one HealthCheck
     * const HealthCheck = await prisma.healthCheck.create({
     *   data: {
     *     // ... data to create a HealthCheck
     *   }
     * })
     * 
     */
    create<T extends HealthCheckCreateArgs>(args: SelectSubset<T, HealthCheckCreateArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HealthChecks.
     * @param {HealthCheckCreateManyArgs} args - Arguments to create many HealthChecks.
     * @example
     * // Create many HealthChecks
     * const healthCheck = await prisma.healthCheck.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HealthCheckCreateManyArgs>(args?: SelectSubset<T, HealthCheckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HealthChecks and returns the data saved in the database.
     * @param {HealthCheckCreateManyAndReturnArgs} args - Arguments to create many HealthChecks.
     * @example
     * // Create many HealthChecks
     * const healthCheck = await prisma.healthCheck.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HealthChecks and only return the `id`
     * const healthCheckWithIdOnly = await prisma.healthCheck.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HealthCheckCreateManyAndReturnArgs>(args?: SelectSubset<T, HealthCheckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HealthCheck.
     * @param {HealthCheckDeleteArgs} args - Arguments to delete one HealthCheck.
     * @example
     * // Delete one HealthCheck
     * const HealthCheck = await prisma.healthCheck.delete({
     *   where: {
     *     // ... filter to delete one HealthCheck
     *   }
     * })
     * 
     */
    delete<T extends HealthCheckDeleteArgs>(args: SelectSubset<T, HealthCheckDeleteArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HealthCheck.
     * @param {HealthCheckUpdateArgs} args - Arguments to update one HealthCheck.
     * @example
     * // Update one HealthCheck
     * const healthCheck = await prisma.healthCheck.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HealthCheckUpdateArgs>(args: SelectSubset<T, HealthCheckUpdateArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HealthChecks.
     * @param {HealthCheckDeleteManyArgs} args - Arguments to filter HealthChecks to delete.
     * @example
     * // Delete a few HealthChecks
     * const { count } = await prisma.healthCheck.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HealthCheckDeleteManyArgs>(args?: SelectSubset<T, HealthCheckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HealthChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HealthChecks
     * const healthCheck = await prisma.healthCheck.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HealthCheckUpdateManyArgs>(args: SelectSubset<T, HealthCheckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HealthChecks and returns the data updated in the database.
     * @param {HealthCheckUpdateManyAndReturnArgs} args - Arguments to update many HealthChecks.
     * @example
     * // Update many HealthChecks
     * const healthCheck = await prisma.healthCheck.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HealthChecks and only return the `id`
     * const healthCheckWithIdOnly = await prisma.healthCheck.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HealthCheckUpdateManyAndReturnArgs>(args: SelectSubset<T, HealthCheckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HealthCheck.
     * @param {HealthCheckUpsertArgs} args - Arguments to update or create a HealthCheck.
     * @example
     * // Update or create a HealthCheck
     * const healthCheck = await prisma.healthCheck.upsert({
     *   create: {
     *     // ... data to create a HealthCheck
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HealthCheck we want to update
     *   }
     * })
     */
    upsert<T extends HealthCheckUpsertArgs>(args: SelectSubset<T, HealthCheckUpsertArgs<ExtArgs>>): Prisma__HealthCheckClient<$Result.GetResult<Prisma.$HealthCheckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HealthChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckCountArgs} args - Arguments to filter HealthChecks to count.
     * @example
     * // Count the number of HealthChecks
     * const count = await prisma.healthCheck.count({
     *   where: {
     *     // ... the filter for the HealthChecks we want to count
     *   }
     * })
    **/
    count<T extends HealthCheckCountArgs>(
      args?: Subset<T, HealthCheckCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HealthCheckCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HealthCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HealthCheckAggregateArgs>(args: Subset<T, HealthCheckAggregateArgs>): Prisma.PrismaPromise<GetHealthCheckAggregateType<T>>

    /**
     * Group by HealthCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HealthCheckGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HealthCheckGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HealthCheckGroupByArgs['orderBy'] }
        : { orderBy?: HealthCheckGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HealthCheckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHealthCheckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HealthCheck model
   */
  readonly fields: HealthCheckFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HealthCheck.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HealthCheckClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HealthCheck model
   */
  interface HealthCheckFieldRefs {
    readonly id: FieldRef<"HealthCheck", 'String'>
    readonly message: FieldRef<"HealthCheck", 'String'>
    readonly createdAt: FieldRef<"HealthCheck", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HealthCheck findUnique
   */
  export type HealthCheckFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter, which HealthCheck to fetch.
     */
    where: HealthCheckWhereUniqueInput
  }

  /**
   * HealthCheck findUniqueOrThrow
   */
  export type HealthCheckFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter, which HealthCheck to fetch.
     */
    where: HealthCheckWhereUniqueInput
  }

  /**
   * HealthCheck findFirst
   */
  export type HealthCheckFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter, which HealthCheck to fetch.
     */
    where?: HealthCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HealthChecks to fetch.
     */
    orderBy?: HealthCheckOrderByWithRelationInput | HealthCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HealthChecks.
     */
    cursor?: HealthCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HealthChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HealthChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HealthChecks.
     */
    distinct?: HealthCheckScalarFieldEnum | HealthCheckScalarFieldEnum[]
  }

  /**
   * HealthCheck findFirstOrThrow
   */
  export type HealthCheckFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter, which HealthCheck to fetch.
     */
    where?: HealthCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HealthChecks to fetch.
     */
    orderBy?: HealthCheckOrderByWithRelationInput | HealthCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HealthChecks.
     */
    cursor?: HealthCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HealthChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HealthChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HealthChecks.
     */
    distinct?: HealthCheckScalarFieldEnum | HealthCheckScalarFieldEnum[]
  }

  /**
   * HealthCheck findMany
   */
  export type HealthCheckFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter, which HealthChecks to fetch.
     */
    where?: HealthCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HealthChecks to fetch.
     */
    orderBy?: HealthCheckOrderByWithRelationInput | HealthCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HealthChecks.
     */
    cursor?: HealthCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HealthChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HealthChecks.
     */
    skip?: number
    distinct?: HealthCheckScalarFieldEnum | HealthCheckScalarFieldEnum[]
  }

  /**
   * HealthCheck create
   */
  export type HealthCheckCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * The data needed to create a HealthCheck.
     */
    data: XOR<HealthCheckCreateInput, HealthCheckUncheckedCreateInput>
  }

  /**
   * HealthCheck createMany
   */
  export type HealthCheckCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HealthChecks.
     */
    data: HealthCheckCreateManyInput | HealthCheckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HealthCheck createManyAndReturn
   */
  export type HealthCheckCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * The data used to create many HealthChecks.
     */
    data: HealthCheckCreateManyInput | HealthCheckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HealthCheck update
   */
  export type HealthCheckUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * The data needed to update a HealthCheck.
     */
    data: XOR<HealthCheckUpdateInput, HealthCheckUncheckedUpdateInput>
    /**
     * Choose, which HealthCheck to update.
     */
    where: HealthCheckWhereUniqueInput
  }

  /**
   * HealthCheck updateMany
   */
  export type HealthCheckUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HealthChecks.
     */
    data: XOR<HealthCheckUpdateManyMutationInput, HealthCheckUncheckedUpdateManyInput>
    /**
     * Filter which HealthChecks to update
     */
    where?: HealthCheckWhereInput
    /**
     * Limit how many HealthChecks to update.
     */
    limit?: number
  }

  /**
   * HealthCheck updateManyAndReturn
   */
  export type HealthCheckUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * The data used to update HealthChecks.
     */
    data: XOR<HealthCheckUpdateManyMutationInput, HealthCheckUncheckedUpdateManyInput>
    /**
     * Filter which HealthChecks to update
     */
    where?: HealthCheckWhereInput
    /**
     * Limit how many HealthChecks to update.
     */
    limit?: number
  }

  /**
   * HealthCheck upsert
   */
  export type HealthCheckUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * The filter to search for the HealthCheck to update in case it exists.
     */
    where: HealthCheckWhereUniqueInput
    /**
     * In case the HealthCheck found by the `where` argument doesn't exist, create a new HealthCheck with this data.
     */
    create: XOR<HealthCheckCreateInput, HealthCheckUncheckedCreateInput>
    /**
     * In case the HealthCheck was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HealthCheckUpdateInput, HealthCheckUncheckedUpdateInput>
  }

  /**
   * HealthCheck delete
   */
  export type HealthCheckDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
    /**
     * Filter which HealthCheck to delete.
     */
    where: HealthCheckWhereUniqueInput
  }

  /**
   * HealthCheck deleteMany
   */
  export type HealthCheckDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HealthChecks to delete
     */
    where?: HealthCheckWhereInput
    /**
     * Limit how many HealthChecks to delete.
     */
    limit?: number
  }

  /**
   * HealthCheck without action
   */
  export type HealthCheckDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HealthCheck
     */
    select?: HealthCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HealthCheck
     */
    omit?: HealthCheckOmit<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["template"]>

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates and returns the data updated in the database.
     * @param {TemplateUpdateManyAndReturnArgs} args - Arguments to update many Templates.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, TemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly description: FieldRef<"Template", 'String'>
    readonly isActive: FieldRef<"Template", 'Boolean'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
    readonly updatedAt: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template updateManyAndReturn
   */
  export type TemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to delete.
     */
    limit?: number
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    ownerUserId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    ownerUserId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    ownerId: number
    ownerUserId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    ownerUserId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    ownerUserId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    ownerUserId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string
    ownerId: string | null
    ownerUserId: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    ownerUserId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    ownerUserId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    ownerUserId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    ownerId?: boolean
    ownerUserId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "ownerId" | "ownerUserId" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["workspace"]>
  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ownerId: string | null
      ownerUserId: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces and returns the data updated in the database.
     * @param {WorkspaceUpdateManyAndReturnArgs} args - Arguments to update many Workspaces.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends Workspace$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workspace model
   */
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly ownerId: FieldRef<"Workspace", 'String'>
    readonly ownerUserId: FieldRef<"Workspace", 'String'>
    readonly isActive: FieldRef<"Workspace", 'Boolean'>
    readonly createdAt: FieldRef<"Workspace", 'DateTime'>
    readonly updatedAt: FieldRef<"Workspace", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace updateManyAndReturn
   */
  export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to delete.
     */
    limit?: number
  }

  /**
   * Workspace.projects
   */
  export type Workspace$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    name: string | null
    slug: string | null
    templateId: string | null
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus | null
    isActive: boolean | null
    previewUrl: string | null
    logsRef: string | null
    provisionError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    name: string | null
    slug: string | null
    templateId: string | null
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus | null
    isActive: boolean | null
    previewUrl: string | null
    logsRef: string | null
    provisionError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    workspaceId: number
    name: number
    slug: number
    templateId: number
    orchestratorProjectId: number
    status: number
    isActive: number
    previewUrl: number
    logsRef: number
    provisionError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    slug?: true
    templateId?: true
    orchestratorProjectId?: true
    status?: true
    isActive?: true
    previewUrl?: true
    logsRef?: true
    provisionError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    slug?: true
    templateId?: true
    orchestratorProjectId?: true
    status?: true
    isActive?: true
    previewUrl?: true
    logsRef?: true
    provisionError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    slug?: true
    templateId?: true
    orchestratorProjectId?: true
    status?: true
    isActive?: true
    previewUrl?: true
    logsRef?: true
    provisionError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    workspaceId: string
    name: string
    slug: string | null
    templateId: string
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus
    isActive: boolean
    previewUrl: string | null
    logsRef: string | null
    provisionError: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    slug?: boolean
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
    isActive?: boolean
    previewUrl?: boolean
    logsRef?: boolean
    provisionError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    provisioningRuns?: boolean | Project$provisioningRunsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    slug?: boolean
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
    isActive?: boolean
    previewUrl?: boolean
    logsRef?: boolean
    provisionError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    slug?: boolean
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
    isActive?: boolean
    previewUrl?: boolean
    logsRef?: boolean
    provisionError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    slug?: boolean
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
    isActive?: boolean
    previewUrl?: boolean
    logsRef?: boolean
    provisionError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workspaceId" | "name" | "slug" | "templateId" | "orchestratorProjectId" | "status" | "isActive" | "previewUrl" | "logsRef" | "provisionError" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    provisioningRuns?: boolean | Project$provisioningRunsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      provisioningRuns: Prisma.$ProvisioningRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workspaceId: string
      name: string
      slug: string | null
      templateId: string
      orchestratorProjectId: string | null
      status: $Enums.ProjectStatus
      isActive: boolean
      previewUrl: string | null
      logsRef: string | null
      provisionError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    provisioningRuns<T extends Project$provisioningRunsArgs<ExtArgs> = {}>(args?: Subset<T, Project$provisioningRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly workspaceId: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly slug: FieldRef<"Project", 'String'>
    readonly templateId: FieldRef<"Project", 'String'>
    readonly orchestratorProjectId: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly isActive: FieldRef<"Project", 'Boolean'>
    readonly previewUrl: FieldRef<"Project", 'String'>
    readonly logsRef: FieldRef<"Project", 'String'>
    readonly provisionError: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.provisioningRuns
   */
  export type Project$provisioningRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    where?: ProvisioningRunWhereInput
    orderBy?: ProvisioningRunOrderByWithRelationInput | ProvisioningRunOrderByWithRelationInput[]
    cursor?: ProvisioningRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProvisioningRunScalarFieldEnum | ProvisioningRunScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProvisioningRun
   */

  export type AggregateProvisioningRun = {
    _count: ProvisioningRunCountAggregateOutputType | null
    _min: ProvisioningRunMinAggregateOutputType | null
    _max: ProvisioningRunMaxAggregateOutputType | null
  }

  export type ProvisioningRunMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    status: $Enums.ProvisioningRunStatus | null
    error: string | null
    createdAt: Date | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type ProvisioningRunMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    status: $Enums.ProvisioningRunStatus | null
    error: string | null
    createdAt: Date | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type ProvisioningRunCountAggregateOutputType = {
    id: number
    projectId: number
    status: number
    error: number
    createdAt: number
    startedAt: number
    finishedAt: number
    _all: number
  }


  export type ProvisioningRunMinAggregateInputType = {
    id?: true
    projectId?: true
    status?: true
    error?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
  }

  export type ProvisioningRunMaxAggregateInputType = {
    id?: true
    projectId?: true
    status?: true
    error?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
  }

  export type ProvisioningRunCountAggregateInputType = {
    id?: true
    projectId?: true
    status?: true
    error?: true
    createdAt?: true
    startedAt?: true
    finishedAt?: true
    _all?: true
  }

  export type ProvisioningRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProvisioningRun to aggregate.
     */
    where?: ProvisioningRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvisioningRuns to fetch.
     */
    orderBy?: ProvisioningRunOrderByWithRelationInput | ProvisioningRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProvisioningRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvisioningRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvisioningRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProvisioningRuns
    **/
    _count?: true | ProvisioningRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProvisioningRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProvisioningRunMaxAggregateInputType
  }

  export type GetProvisioningRunAggregateType<T extends ProvisioningRunAggregateArgs> = {
        [P in keyof T & keyof AggregateProvisioningRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProvisioningRun[P]>
      : GetScalarType<T[P], AggregateProvisioningRun[P]>
  }




  export type ProvisioningRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProvisioningRunWhereInput
    orderBy?: ProvisioningRunOrderByWithAggregationInput | ProvisioningRunOrderByWithAggregationInput[]
    by: ProvisioningRunScalarFieldEnum[] | ProvisioningRunScalarFieldEnum
    having?: ProvisioningRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProvisioningRunCountAggregateInputType | true
    _min?: ProvisioningRunMinAggregateInputType
    _max?: ProvisioningRunMaxAggregateInputType
  }

  export type ProvisioningRunGroupByOutputType = {
    id: string
    projectId: string
    status: $Enums.ProvisioningRunStatus
    error: string | null
    createdAt: Date
    startedAt: Date
    finishedAt: Date | null
    _count: ProvisioningRunCountAggregateOutputType | null
    _min: ProvisioningRunMinAggregateOutputType | null
    _max: ProvisioningRunMaxAggregateOutputType | null
  }

  type GetProvisioningRunGroupByPayload<T extends ProvisioningRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProvisioningRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProvisioningRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProvisioningRunGroupByOutputType[P]>
            : GetScalarType<T[P], ProvisioningRunGroupByOutputType[P]>
        }
      >
    >


  export type ProvisioningRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provisioningRun"]>

  export type ProvisioningRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provisioningRun"]>

  export type ProvisioningRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provisioningRun"]>

  export type ProvisioningRunSelectScalar = {
    id?: boolean
    projectId?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    startedAt?: boolean
    finishedAt?: boolean
  }

  export type ProvisioningRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "status" | "error" | "createdAt" | "startedAt" | "finishedAt", ExtArgs["result"]["provisioningRun"]>
  export type ProvisioningRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProvisioningRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProvisioningRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProvisioningRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProvisioningRun"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      status: $Enums.ProvisioningRunStatus
      error: string | null
      createdAt: Date
      startedAt: Date
      finishedAt: Date | null
    }, ExtArgs["result"]["provisioningRun"]>
    composites: {}
  }

  type ProvisioningRunGetPayload<S extends boolean | null | undefined | ProvisioningRunDefaultArgs> = $Result.GetResult<Prisma.$ProvisioningRunPayload, S>

  type ProvisioningRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProvisioningRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProvisioningRunCountAggregateInputType | true
    }

  export interface ProvisioningRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProvisioningRun'], meta: { name: 'ProvisioningRun' } }
    /**
     * Find zero or one ProvisioningRun that matches the filter.
     * @param {ProvisioningRunFindUniqueArgs} args - Arguments to find a ProvisioningRun
     * @example
     * // Get one ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProvisioningRunFindUniqueArgs>(args: SelectSubset<T, ProvisioningRunFindUniqueArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProvisioningRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProvisioningRunFindUniqueOrThrowArgs} args - Arguments to find a ProvisioningRun
     * @example
     * // Get one ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProvisioningRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ProvisioningRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProvisioningRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunFindFirstArgs} args - Arguments to find a ProvisioningRun
     * @example
     * // Get one ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProvisioningRunFindFirstArgs>(args?: SelectSubset<T, ProvisioningRunFindFirstArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProvisioningRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunFindFirstOrThrowArgs} args - Arguments to find a ProvisioningRun
     * @example
     * // Get one ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProvisioningRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ProvisioningRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProvisioningRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProvisioningRuns
     * const provisioningRuns = await prisma.provisioningRun.findMany()
     * 
     * // Get first 10 ProvisioningRuns
     * const provisioningRuns = await prisma.provisioningRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const provisioningRunWithIdOnly = await prisma.provisioningRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProvisioningRunFindManyArgs>(args?: SelectSubset<T, ProvisioningRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProvisioningRun.
     * @param {ProvisioningRunCreateArgs} args - Arguments to create a ProvisioningRun.
     * @example
     * // Create one ProvisioningRun
     * const ProvisioningRun = await prisma.provisioningRun.create({
     *   data: {
     *     // ... data to create a ProvisioningRun
     *   }
     * })
     * 
     */
    create<T extends ProvisioningRunCreateArgs>(args: SelectSubset<T, ProvisioningRunCreateArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProvisioningRuns.
     * @param {ProvisioningRunCreateManyArgs} args - Arguments to create many ProvisioningRuns.
     * @example
     * // Create many ProvisioningRuns
     * const provisioningRun = await prisma.provisioningRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProvisioningRunCreateManyArgs>(args?: SelectSubset<T, ProvisioningRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProvisioningRuns and returns the data saved in the database.
     * @param {ProvisioningRunCreateManyAndReturnArgs} args - Arguments to create many ProvisioningRuns.
     * @example
     * // Create many ProvisioningRuns
     * const provisioningRun = await prisma.provisioningRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProvisioningRuns and only return the `id`
     * const provisioningRunWithIdOnly = await prisma.provisioningRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProvisioningRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ProvisioningRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProvisioningRun.
     * @param {ProvisioningRunDeleteArgs} args - Arguments to delete one ProvisioningRun.
     * @example
     * // Delete one ProvisioningRun
     * const ProvisioningRun = await prisma.provisioningRun.delete({
     *   where: {
     *     // ... filter to delete one ProvisioningRun
     *   }
     * })
     * 
     */
    delete<T extends ProvisioningRunDeleteArgs>(args: SelectSubset<T, ProvisioningRunDeleteArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProvisioningRun.
     * @param {ProvisioningRunUpdateArgs} args - Arguments to update one ProvisioningRun.
     * @example
     * // Update one ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProvisioningRunUpdateArgs>(args: SelectSubset<T, ProvisioningRunUpdateArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProvisioningRuns.
     * @param {ProvisioningRunDeleteManyArgs} args - Arguments to filter ProvisioningRuns to delete.
     * @example
     * // Delete a few ProvisioningRuns
     * const { count } = await prisma.provisioningRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProvisioningRunDeleteManyArgs>(args?: SelectSubset<T, ProvisioningRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProvisioningRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProvisioningRuns
     * const provisioningRun = await prisma.provisioningRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProvisioningRunUpdateManyArgs>(args: SelectSubset<T, ProvisioningRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProvisioningRuns and returns the data updated in the database.
     * @param {ProvisioningRunUpdateManyAndReturnArgs} args - Arguments to update many ProvisioningRuns.
     * @example
     * // Update many ProvisioningRuns
     * const provisioningRun = await prisma.provisioningRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProvisioningRuns and only return the `id`
     * const provisioningRunWithIdOnly = await prisma.provisioningRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProvisioningRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ProvisioningRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProvisioningRun.
     * @param {ProvisioningRunUpsertArgs} args - Arguments to update or create a ProvisioningRun.
     * @example
     * // Update or create a ProvisioningRun
     * const provisioningRun = await prisma.provisioningRun.upsert({
     *   create: {
     *     // ... data to create a ProvisioningRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProvisioningRun we want to update
     *   }
     * })
     */
    upsert<T extends ProvisioningRunUpsertArgs>(args: SelectSubset<T, ProvisioningRunUpsertArgs<ExtArgs>>): Prisma__ProvisioningRunClient<$Result.GetResult<Prisma.$ProvisioningRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProvisioningRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunCountArgs} args - Arguments to filter ProvisioningRuns to count.
     * @example
     * // Count the number of ProvisioningRuns
     * const count = await prisma.provisioningRun.count({
     *   where: {
     *     // ... the filter for the ProvisioningRuns we want to count
     *   }
     * })
    **/
    count<T extends ProvisioningRunCountArgs>(
      args?: Subset<T, ProvisioningRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProvisioningRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProvisioningRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProvisioningRunAggregateArgs>(args: Subset<T, ProvisioningRunAggregateArgs>): Prisma.PrismaPromise<GetProvisioningRunAggregateType<T>>

    /**
     * Group by ProvisioningRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvisioningRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProvisioningRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProvisioningRunGroupByArgs['orderBy'] }
        : { orderBy?: ProvisioningRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProvisioningRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProvisioningRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProvisioningRun model
   */
  readonly fields: ProvisioningRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProvisioningRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProvisioningRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProvisioningRun model
   */
  interface ProvisioningRunFieldRefs {
    readonly id: FieldRef<"ProvisioningRun", 'String'>
    readonly projectId: FieldRef<"ProvisioningRun", 'String'>
    readonly status: FieldRef<"ProvisioningRun", 'ProvisioningRunStatus'>
    readonly error: FieldRef<"ProvisioningRun", 'String'>
    readonly createdAt: FieldRef<"ProvisioningRun", 'DateTime'>
    readonly startedAt: FieldRef<"ProvisioningRun", 'DateTime'>
    readonly finishedAt: FieldRef<"ProvisioningRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProvisioningRun findUnique
   */
  export type ProvisioningRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter, which ProvisioningRun to fetch.
     */
    where: ProvisioningRunWhereUniqueInput
  }

  /**
   * ProvisioningRun findUniqueOrThrow
   */
  export type ProvisioningRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter, which ProvisioningRun to fetch.
     */
    where: ProvisioningRunWhereUniqueInput
  }

  /**
   * ProvisioningRun findFirst
   */
  export type ProvisioningRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter, which ProvisioningRun to fetch.
     */
    where?: ProvisioningRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvisioningRuns to fetch.
     */
    orderBy?: ProvisioningRunOrderByWithRelationInput | ProvisioningRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProvisioningRuns.
     */
    cursor?: ProvisioningRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvisioningRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvisioningRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProvisioningRuns.
     */
    distinct?: ProvisioningRunScalarFieldEnum | ProvisioningRunScalarFieldEnum[]
  }

  /**
   * ProvisioningRun findFirstOrThrow
   */
  export type ProvisioningRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter, which ProvisioningRun to fetch.
     */
    where?: ProvisioningRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvisioningRuns to fetch.
     */
    orderBy?: ProvisioningRunOrderByWithRelationInput | ProvisioningRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProvisioningRuns.
     */
    cursor?: ProvisioningRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvisioningRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvisioningRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProvisioningRuns.
     */
    distinct?: ProvisioningRunScalarFieldEnum | ProvisioningRunScalarFieldEnum[]
  }

  /**
   * ProvisioningRun findMany
   */
  export type ProvisioningRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter, which ProvisioningRuns to fetch.
     */
    where?: ProvisioningRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvisioningRuns to fetch.
     */
    orderBy?: ProvisioningRunOrderByWithRelationInput | ProvisioningRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProvisioningRuns.
     */
    cursor?: ProvisioningRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvisioningRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvisioningRuns.
     */
    skip?: number
    distinct?: ProvisioningRunScalarFieldEnum | ProvisioningRunScalarFieldEnum[]
  }

  /**
   * ProvisioningRun create
   */
  export type ProvisioningRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ProvisioningRun.
     */
    data: XOR<ProvisioningRunCreateInput, ProvisioningRunUncheckedCreateInput>
  }

  /**
   * ProvisioningRun createMany
   */
  export type ProvisioningRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProvisioningRuns.
     */
    data: ProvisioningRunCreateManyInput | ProvisioningRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProvisioningRun createManyAndReturn
   */
  export type ProvisioningRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * The data used to create many ProvisioningRuns.
     */
    data: ProvisioningRunCreateManyInput | ProvisioningRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProvisioningRun update
   */
  export type ProvisioningRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ProvisioningRun.
     */
    data: XOR<ProvisioningRunUpdateInput, ProvisioningRunUncheckedUpdateInput>
    /**
     * Choose, which ProvisioningRun to update.
     */
    where: ProvisioningRunWhereUniqueInput
  }

  /**
   * ProvisioningRun updateMany
   */
  export type ProvisioningRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProvisioningRuns.
     */
    data: XOR<ProvisioningRunUpdateManyMutationInput, ProvisioningRunUncheckedUpdateManyInput>
    /**
     * Filter which ProvisioningRuns to update
     */
    where?: ProvisioningRunWhereInput
    /**
     * Limit how many ProvisioningRuns to update.
     */
    limit?: number
  }

  /**
   * ProvisioningRun updateManyAndReturn
   */
  export type ProvisioningRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * The data used to update ProvisioningRuns.
     */
    data: XOR<ProvisioningRunUpdateManyMutationInput, ProvisioningRunUncheckedUpdateManyInput>
    /**
     * Filter which ProvisioningRuns to update
     */
    where?: ProvisioningRunWhereInput
    /**
     * Limit how many ProvisioningRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProvisioningRun upsert
   */
  export type ProvisioningRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ProvisioningRun to update in case it exists.
     */
    where: ProvisioningRunWhereUniqueInput
    /**
     * In case the ProvisioningRun found by the `where` argument doesn't exist, create a new ProvisioningRun with this data.
     */
    create: XOR<ProvisioningRunCreateInput, ProvisioningRunUncheckedCreateInput>
    /**
     * In case the ProvisioningRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProvisioningRunUpdateInput, ProvisioningRunUncheckedUpdateInput>
  }

  /**
   * ProvisioningRun delete
   */
  export type ProvisioningRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
    /**
     * Filter which ProvisioningRun to delete.
     */
    where: ProvisioningRunWhereUniqueInput
  }

  /**
   * ProvisioningRun deleteMany
   */
  export type ProvisioningRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProvisioningRuns to delete
     */
    where?: ProvisioningRunWhereInput
    /**
     * Limit how many ProvisioningRuns to delete.
     */
    limit?: number
  }

  /**
   * ProvisioningRun without action
   */
  export type ProvisioningRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvisioningRun
     */
    select?: ProvisioningRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProvisioningRun
     */
    omit?: ProvisioningRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvisioningRunInclude<ExtArgs> | null
  }


  /**
   * Model PublicProject
   */

  export type AggregatePublicProject = {
    _count: PublicProjectCountAggregateOutputType | null
    _min: PublicProjectMinAggregateOutputType | null
    _max: PublicProjectMaxAggregateOutputType | null
  }

  export type PublicProjectMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    templateId: string | null
    repoUrl: string | null
    status: string | null
    previewUrl: string | null
    containerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PublicProjectMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    templateId: string | null
    repoUrl: string | null
    status: string | null
    previewUrl: string | null
    containerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PublicProjectCountAggregateOutputType = {
    id: number
    ownerId: number
    templateId: number
    repoUrl: number
    status: number
    previewUrl: number
    containerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PublicProjectMinAggregateInputType = {
    id?: true
    ownerId?: true
    templateId?: true
    repoUrl?: true
    status?: true
    previewUrl?: true
    containerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PublicProjectMaxAggregateInputType = {
    id?: true
    ownerId?: true
    templateId?: true
    repoUrl?: true
    status?: true
    previewUrl?: true
    containerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PublicProjectCountAggregateInputType = {
    id?: true
    ownerId?: true
    templateId?: true
    repoUrl?: true
    status?: true
    previewUrl?: true
    containerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PublicProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PublicProject to aggregate.
     */
    where?: PublicProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PublicProjects to fetch.
     */
    orderBy?: PublicProjectOrderByWithRelationInput | PublicProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PublicProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PublicProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PublicProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PublicProjects
    **/
    _count?: true | PublicProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PublicProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PublicProjectMaxAggregateInputType
  }

  export type GetPublicProjectAggregateType<T extends PublicProjectAggregateArgs> = {
        [P in keyof T & keyof AggregatePublicProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePublicProject[P]>
      : GetScalarType<T[P], AggregatePublicProject[P]>
  }




  export type PublicProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PublicProjectWhereInput
    orderBy?: PublicProjectOrderByWithAggregationInput | PublicProjectOrderByWithAggregationInput[]
    by: PublicProjectScalarFieldEnum[] | PublicProjectScalarFieldEnum
    having?: PublicProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PublicProjectCountAggregateInputType | true
    _min?: PublicProjectMinAggregateInputType
    _max?: PublicProjectMaxAggregateInputType
  }

  export type PublicProjectGroupByOutputType = {
    id: string
    ownerId: string
    templateId: string
    repoUrl: string | null
    status: string
    previewUrl: string | null
    containerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PublicProjectCountAggregateOutputType | null
    _min: PublicProjectMinAggregateOutputType | null
    _max: PublicProjectMaxAggregateOutputType | null
  }

  type GetPublicProjectGroupByPayload<T extends PublicProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PublicProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PublicProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PublicProjectGroupByOutputType[P]>
            : GetScalarType<T[P], PublicProjectGroupByOutputType[P]>
        }
      >
    >


  export type PublicProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    templateId?: boolean
    repoUrl?: boolean
    status?: boolean
    previewUrl?: boolean
    containerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["publicProject"]>

  export type PublicProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    templateId?: boolean
    repoUrl?: boolean
    status?: boolean
    previewUrl?: boolean
    containerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["publicProject"]>

  export type PublicProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    templateId?: boolean
    repoUrl?: boolean
    status?: boolean
    previewUrl?: boolean
    containerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["publicProject"]>

  export type PublicProjectSelectScalar = {
    id?: boolean
    ownerId?: boolean
    templateId?: boolean
    repoUrl?: boolean
    status?: boolean
    previewUrl?: boolean
    containerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PublicProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "templateId" | "repoUrl" | "status" | "previewUrl" | "containerId" | "createdAt" | "updatedAt", ExtArgs["result"]["publicProject"]>

  export type $PublicProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PublicProject"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      templateId: string
      repoUrl: string | null
      status: string
      previewUrl: string | null
      containerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["publicProject"]>
    composites: {}
  }

  type PublicProjectGetPayload<S extends boolean | null | undefined | PublicProjectDefaultArgs> = $Result.GetResult<Prisma.$PublicProjectPayload, S>

  type PublicProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PublicProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PublicProjectCountAggregateInputType | true
    }

  export interface PublicProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PublicProject'], meta: { name: 'PublicProject' } }
    /**
     * Find zero or one PublicProject that matches the filter.
     * @param {PublicProjectFindUniqueArgs} args - Arguments to find a PublicProject
     * @example
     * // Get one PublicProject
     * const publicProject = await prisma.publicProject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PublicProjectFindUniqueArgs>(args: SelectSubset<T, PublicProjectFindUniqueArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PublicProject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PublicProjectFindUniqueOrThrowArgs} args - Arguments to find a PublicProject
     * @example
     * // Get one PublicProject
     * const publicProject = await prisma.publicProject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PublicProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, PublicProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PublicProject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectFindFirstArgs} args - Arguments to find a PublicProject
     * @example
     * // Get one PublicProject
     * const publicProject = await prisma.publicProject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PublicProjectFindFirstArgs>(args?: SelectSubset<T, PublicProjectFindFirstArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PublicProject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectFindFirstOrThrowArgs} args - Arguments to find a PublicProject
     * @example
     * // Get one PublicProject
     * const publicProject = await prisma.publicProject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PublicProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, PublicProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PublicProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PublicProjects
     * const publicProjects = await prisma.publicProject.findMany()
     * 
     * // Get first 10 PublicProjects
     * const publicProjects = await prisma.publicProject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const publicProjectWithIdOnly = await prisma.publicProject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PublicProjectFindManyArgs>(args?: SelectSubset<T, PublicProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PublicProject.
     * @param {PublicProjectCreateArgs} args - Arguments to create a PublicProject.
     * @example
     * // Create one PublicProject
     * const PublicProject = await prisma.publicProject.create({
     *   data: {
     *     // ... data to create a PublicProject
     *   }
     * })
     * 
     */
    create<T extends PublicProjectCreateArgs>(args: SelectSubset<T, PublicProjectCreateArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PublicProjects.
     * @param {PublicProjectCreateManyArgs} args - Arguments to create many PublicProjects.
     * @example
     * // Create many PublicProjects
     * const publicProject = await prisma.publicProject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PublicProjectCreateManyArgs>(args?: SelectSubset<T, PublicProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PublicProjects and returns the data saved in the database.
     * @param {PublicProjectCreateManyAndReturnArgs} args - Arguments to create many PublicProjects.
     * @example
     * // Create many PublicProjects
     * const publicProject = await prisma.publicProject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PublicProjects and only return the `id`
     * const publicProjectWithIdOnly = await prisma.publicProject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PublicProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, PublicProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PublicProject.
     * @param {PublicProjectDeleteArgs} args - Arguments to delete one PublicProject.
     * @example
     * // Delete one PublicProject
     * const PublicProject = await prisma.publicProject.delete({
     *   where: {
     *     // ... filter to delete one PublicProject
     *   }
     * })
     * 
     */
    delete<T extends PublicProjectDeleteArgs>(args: SelectSubset<T, PublicProjectDeleteArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PublicProject.
     * @param {PublicProjectUpdateArgs} args - Arguments to update one PublicProject.
     * @example
     * // Update one PublicProject
     * const publicProject = await prisma.publicProject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PublicProjectUpdateArgs>(args: SelectSubset<T, PublicProjectUpdateArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PublicProjects.
     * @param {PublicProjectDeleteManyArgs} args - Arguments to filter PublicProjects to delete.
     * @example
     * // Delete a few PublicProjects
     * const { count } = await prisma.publicProject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PublicProjectDeleteManyArgs>(args?: SelectSubset<T, PublicProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PublicProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PublicProjects
     * const publicProject = await prisma.publicProject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PublicProjectUpdateManyArgs>(args: SelectSubset<T, PublicProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PublicProjects and returns the data updated in the database.
     * @param {PublicProjectUpdateManyAndReturnArgs} args - Arguments to update many PublicProjects.
     * @example
     * // Update many PublicProjects
     * const publicProject = await prisma.publicProject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PublicProjects and only return the `id`
     * const publicProjectWithIdOnly = await prisma.publicProject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PublicProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, PublicProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PublicProject.
     * @param {PublicProjectUpsertArgs} args - Arguments to update or create a PublicProject.
     * @example
     * // Update or create a PublicProject
     * const publicProject = await prisma.publicProject.upsert({
     *   create: {
     *     // ... data to create a PublicProject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PublicProject we want to update
     *   }
     * })
     */
    upsert<T extends PublicProjectUpsertArgs>(args: SelectSubset<T, PublicProjectUpsertArgs<ExtArgs>>): Prisma__PublicProjectClient<$Result.GetResult<Prisma.$PublicProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PublicProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectCountArgs} args - Arguments to filter PublicProjects to count.
     * @example
     * // Count the number of PublicProjects
     * const count = await prisma.publicProject.count({
     *   where: {
     *     // ... the filter for the PublicProjects we want to count
     *   }
     * })
    **/
    count<T extends PublicProjectCountArgs>(
      args?: Subset<T, PublicProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PublicProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PublicProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PublicProjectAggregateArgs>(args: Subset<T, PublicProjectAggregateArgs>): Prisma.PrismaPromise<GetPublicProjectAggregateType<T>>

    /**
     * Group by PublicProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PublicProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PublicProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PublicProjectGroupByArgs['orderBy'] }
        : { orderBy?: PublicProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PublicProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPublicProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PublicProject model
   */
  readonly fields: PublicProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PublicProject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PublicProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PublicProject model
   */
  interface PublicProjectFieldRefs {
    readonly id: FieldRef<"PublicProject", 'String'>
    readonly ownerId: FieldRef<"PublicProject", 'String'>
    readonly templateId: FieldRef<"PublicProject", 'String'>
    readonly repoUrl: FieldRef<"PublicProject", 'String'>
    readonly status: FieldRef<"PublicProject", 'String'>
    readonly previewUrl: FieldRef<"PublicProject", 'String'>
    readonly containerId: FieldRef<"PublicProject", 'String'>
    readonly createdAt: FieldRef<"PublicProject", 'DateTime'>
    readonly updatedAt: FieldRef<"PublicProject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PublicProject findUnique
   */
  export type PublicProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter, which PublicProject to fetch.
     */
    where: PublicProjectWhereUniqueInput
  }

  /**
   * PublicProject findUniqueOrThrow
   */
  export type PublicProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter, which PublicProject to fetch.
     */
    where: PublicProjectWhereUniqueInput
  }

  /**
   * PublicProject findFirst
   */
  export type PublicProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter, which PublicProject to fetch.
     */
    where?: PublicProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PublicProjects to fetch.
     */
    orderBy?: PublicProjectOrderByWithRelationInput | PublicProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PublicProjects.
     */
    cursor?: PublicProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PublicProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PublicProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PublicProjects.
     */
    distinct?: PublicProjectScalarFieldEnum | PublicProjectScalarFieldEnum[]
  }

  /**
   * PublicProject findFirstOrThrow
   */
  export type PublicProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter, which PublicProject to fetch.
     */
    where?: PublicProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PublicProjects to fetch.
     */
    orderBy?: PublicProjectOrderByWithRelationInput | PublicProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PublicProjects.
     */
    cursor?: PublicProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PublicProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PublicProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PublicProjects.
     */
    distinct?: PublicProjectScalarFieldEnum | PublicProjectScalarFieldEnum[]
  }

  /**
   * PublicProject findMany
   */
  export type PublicProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter, which PublicProjects to fetch.
     */
    where?: PublicProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PublicProjects to fetch.
     */
    orderBy?: PublicProjectOrderByWithRelationInput | PublicProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PublicProjects.
     */
    cursor?: PublicProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PublicProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PublicProjects.
     */
    skip?: number
    distinct?: PublicProjectScalarFieldEnum | PublicProjectScalarFieldEnum[]
  }

  /**
   * PublicProject create
   */
  export type PublicProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * The data needed to create a PublicProject.
     */
    data: XOR<PublicProjectCreateInput, PublicProjectUncheckedCreateInput>
  }

  /**
   * PublicProject createMany
   */
  export type PublicProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PublicProjects.
     */
    data: PublicProjectCreateManyInput | PublicProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PublicProject createManyAndReturn
   */
  export type PublicProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * The data used to create many PublicProjects.
     */
    data: PublicProjectCreateManyInput | PublicProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PublicProject update
   */
  export type PublicProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * The data needed to update a PublicProject.
     */
    data: XOR<PublicProjectUpdateInput, PublicProjectUncheckedUpdateInput>
    /**
     * Choose, which PublicProject to update.
     */
    where: PublicProjectWhereUniqueInput
  }

  /**
   * PublicProject updateMany
   */
  export type PublicProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PublicProjects.
     */
    data: XOR<PublicProjectUpdateManyMutationInput, PublicProjectUncheckedUpdateManyInput>
    /**
     * Filter which PublicProjects to update
     */
    where?: PublicProjectWhereInput
    /**
     * Limit how many PublicProjects to update.
     */
    limit?: number
  }

  /**
   * PublicProject updateManyAndReturn
   */
  export type PublicProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * The data used to update PublicProjects.
     */
    data: XOR<PublicProjectUpdateManyMutationInput, PublicProjectUncheckedUpdateManyInput>
    /**
     * Filter which PublicProjects to update
     */
    where?: PublicProjectWhereInput
    /**
     * Limit how many PublicProjects to update.
     */
    limit?: number
  }

  /**
   * PublicProject upsert
   */
  export type PublicProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * The filter to search for the PublicProject to update in case it exists.
     */
    where: PublicProjectWhereUniqueInput
    /**
     * In case the PublicProject found by the `where` argument doesn't exist, create a new PublicProject with this data.
     */
    create: XOR<PublicProjectCreateInput, PublicProjectUncheckedCreateInput>
    /**
     * In case the PublicProject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PublicProjectUpdateInput, PublicProjectUncheckedUpdateInput>
  }

  /**
   * PublicProject delete
   */
  export type PublicProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
    /**
     * Filter which PublicProject to delete.
     */
    where: PublicProjectWhereUniqueInput
  }

  /**
   * PublicProject deleteMany
   */
  export type PublicProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PublicProjects to delete
     */
    where?: PublicProjectWhereInput
    /**
     * Limit how many PublicProjects to delete.
     */
    limit?: number
  }

  /**
   * PublicProject without action
   */
  export type PublicProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PublicProject
     */
    select?: PublicProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PublicProject
     */
    omit?: PublicProjectOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    sandboxes?: boolean | User$sandboxesArgs<ExtArgs>
    agentMemories?: boolean | User$agentMemoriesArgs<ExtArgs>
    agentEvents?: boolean | User$agentEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    sandboxes?: boolean | User$sandboxesArgs<ExtArgs>
    agentMemories?: boolean | User$agentMemoriesArgs<ExtArgs>
    agentEvents?: boolean | User$agentEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
      sandboxes: Prisma.$SandboxPayload<ExtArgs>[]
      agentMemories: Prisma.$AgentMemoryPayload<ExtArgs>[]
      agentEvents: Prisma.$AgentEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    apiKeys<T extends User$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, User$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sandboxes<T extends User$sandboxesArgs<ExtArgs> = {}>(args?: Subset<T, User$sandboxesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    agentMemories<T extends User$agentMemoriesArgs<ExtArgs> = {}>(args?: Subset<T, User$agentMemoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    agentEvents<T extends User$agentEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$agentEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.apiKeys
   */
  export type User$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * User.sandboxes
   */
  export type User$sandboxesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    where?: SandboxWhereInput
    orderBy?: SandboxOrderByWithRelationInput | SandboxOrderByWithRelationInput[]
    cursor?: SandboxWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SandboxScalarFieldEnum | SandboxScalarFieldEnum[]
  }

  /**
   * User.agentMemories
   */
  export type User$agentMemoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    where?: AgentMemoryWhereInput
    orderBy?: AgentMemoryOrderByWithRelationInput | AgentMemoryOrderByWithRelationInput[]
    cursor?: AgentMemoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentMemoryScalarFieldEnum | AgentMemoryScalarFieldEnum[]
  }

  /**
   * User.agentEvents
   */
  export type User$agentEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    where?: AgentEventWhereInput
    orderBy?: AgentEventOrderByWithRelationInput | AgentEventOrderByWithRelationInput[]
    cursor?: AgentEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentEventScalarFieldEnum | AgentEventScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    userId: string | null
    keyHash: string | null
    keyPrefix: string | null
    name: string | null
    isActive: boolean | null
    lastUsedAt: Date | null
    createdAt: Date | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    keyHash: string | null
    keyPrefix: string | null
    name: string | null
    isActive: boolean | null
    lastUsedAt: Date | null
    createdAt: Date | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    userId: number
    keyHash: number
    keyPrefix: number
    name: number
    isActive: number
    lastUsedAt: number
    createdAt: number
    _all: number
  }


  export type ApiKeyMinAggregateInputType = {
    id?: true
    userId?: true
    keyHash?: true
    keyPrefix?: true
    name?: true
    isActive?: true
    lastUsedAt?: true
    createdAt?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    userId?: true
    keyHash?: true
    keyPrefix?: true
    name?: true
    isActive?: true
    lastUsedAt?: true
    createdAt?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    userId?: true
    keyHash?: true
    keyPrefix?: true
    name?: true
    isActive?: true
    lastUsedAt?: true
    createdAt?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    userId: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive: boolean
    lastUsedAt: Date | null
    createdAt: Date
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    keyHash?: boolean
    keyPrefix?: boolean
    name?: boolean
    isActive?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    keyHash?: boolean
    keyPrefix?: boolean
    name?: boolean
    isActive?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    keyHash?: boolean
    keyPrefix?: boolean
    name?: boolean
    isActive?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    userId?: boolean
    keyHash?: boolean
    keyPrefix?: boolean
    name?: boolean
    isActive?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "keyHash" | "keyPrefix" | "name" | "isActive" | "lastUsedAt" | "createdAt", ExtArgs["result"]["apiKey"]>
  export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      keyHash: string
      keyPrefix: string
      name: string
      isActive: boolean
      lastUsedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly userId: FieldRef<"ApiKey", 'String'>
    readonly keyHash: FieldRef<"ApiKey", 'String'>
    readonly keyPrefix: FieldRef<"ApiKey", 'String'>
    readonly name: FieldRef<"ApiKey", 'String'>
    readonly isActive: FieldRef<"ApiKey", 'Boolean'>
    readonly lastUsedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
  }


  /**
   * Model Sandbox
   */

  export type AggregateSandbox = {
    _count: SandboxCountAggregateOutputType | null
    _avg: SandboxAvgAggregateOutputType | null
    _sum: SandboxSumAggregateOutputType | null
    _min: SandboxMinAggregateOutputType | null
    _max: SandboxMaxAggregateOutputType | null
  }

  export type SandboxAvgAggregateOutputType = {
    port: number | null
    timeoutSecs: number | null
  }

  export type SandboxSumAggregateOutputType = {
    port: number | null
    timeoutSecs: number | null
  }

  export type SandboxMinAggregateOutputType = {
    id: string | null
    userId: string | null
    language: $Enums.SandboxLanguage | null
    status: $Enums.SandboxStatus | null
    containerId: string | null
    port: number | null
    timeoutSecs: number | null
    startedAt: Date | null
    terminatedAt: Date | null
    createdAt: Date | null
  }

  export type SandboxMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    language: $Enums.SandboxLanguage | null
    status: $Enums.SandboxStatus | null
    containerId: string | null
    port: number | null
    timeoutSecs: number | null
    startedAt: Date | null
    terminatedAt: Date | null
    createdAt: Date | null
  }

  export type SandboxCountAggregateOutputType = {
    id: number
    userId: number
    language: number
    status: number
    containerId: number
    port: number
    timeoutSecs: number
    startedAt: number
    terminatedAt: number
    createdAt: number
    _all: number
  }


  export type SandboxAvgAggregateInputType = {
    port?: true
    timeoutSecs?: true
  }

  export type SandboxSumAggregateInputType = {
    port?: true
    timeoutSecs?: true
  }

  export type SandboxMinAggregateInputType = {
    id?: true
    userId?: true
    language?: true
    status?: true
    containerId?: true
    port?: true
    timeoutSecs?: true
    startedAt?: true
    terminatedAt?: true
    createdAt?: true
  }

  export type SandboxMaxAggregateInputType = {
    id?: true
    userId?: true
    language?: true
    status?: true
    containerId?: true
    port?: true
    timeoutSecs?: true
    startedAt?: true
    terminatedAt?: true
    createdAt?: true
  }

  export type SandboxCountAggregateInputType = {
    id?: true
    userId?: true
    language?: true
    status?: true
    containerId?: true
    port?: true
    timeoutSecs?: true
    startedAt?: true
    terminatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type SandboxAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sandbox to aggregate.
     */
    where?: SandboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sandboxes to fetch.
     */
    orderBy?: SandboxOrderByWithRelationInput | SandboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SandboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sandboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sandboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sandboxes
    **/
    _count?: true | SandboxCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SandboxAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SandboxSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SandboxMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SandboxMaxAggregateInputType
  }

  export type GetSandboxAggregateType<T extends SandboxAggregateArgs> = {
        [P in keyof T & keyof AggregateSandbox]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSandbox[P]>
      : GetScalarType<T[P], AggregateSandbox[P]>
  }




  export type SandboxGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SandboxWhereInput
    orderBy?: SandboxOrderByWithAggregationInput | SandboxOrderByWithAggregationInput[]
    by: SandboxScalarFieldEnum[] | SandboxScalarFieldEnum
    having?: SandboxScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SandboxCountAggregateInputType | true
    _avg?: SandboxAvgAggregateInputType
    _sum?: SandboxSumAggregateInputType
    _min?: SandboxMinAggregateInputType
    _max?: SandboxMaxAggregateInputType
  }

  export type SandboxGroupByOutputType = {
    id: string
    userId: string
    language: $Enums.SandboxLanguage
    status: $Enums.SandboxStatus
    containerId: string | null
    port: number | null
    timeoutSecs: number
    startedAt: Date | null
    terminatedAt: Date | null
    createdAt: Date
    _count: SandboxCountAggregateOutputType | null
    _avg: SandboxAvgAggregateOutputType | null
    _sum: SandboxSumAggregateOutputType | null
    _min: SandboxMinAggregateOutputType | null
    _max: SandboxMaxAggregateOutputType | null
  }

  type GetSandboxGroupByPayload<T extends SandboxGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SandboxGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SandboxGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SandboxGroupByOutputType[P]>
            : GetScalarType<T[P], SandboxGroupByOutputType[P]>
        }
      >
    >


  export type SandboxSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    language?: boolean
    status?: boolean
    containerId?: boolean
    port?: boolean
    timeoutSecs?: boolean
    startedAt?: boolean
    terminatedAt?: boolean
    createdAt?: boolean
    usageLogs?: boolean | Sandbox$usageLogsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | SandboxCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sandbox"]>

  export type SandboxSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    language?: boolean
    status?: boolean
    containerId?: boolean
    port?: boolean
    timeoutSecs?: boolean
    startedAt?: boolean
    terminatedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sandbox"]>

  export type SandboxSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    language?: boolean
    status?: boolean
    containerId?: boolean
    port?: boolean
    timeoutSecs?: boolean
    startedAt?: boolean
    terminatedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sandbox"]>

  export type SandboxSelectScalar = {
    id?: boolean
    userId?: boolean
    language?: boolean
    status?: boolean
    containerId?: boolean
    port?: boolean
    timeoutSecs?: boolean
    startedAt?: boolean
    terminatedAt?: boolean
    createdAt?: boolean
  }

  export type SandboxOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "language" | "status" | "containerId" | "port" | "timeoutSecs" | "startedAt" | "terminatedAt" | "createdAt", ExtArgs["result"]["sandbox"]>
  export type SandboxInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usageLogs?: boolean | Sandbox$usageLogsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | SandboxCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SandboxIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SandboxIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SandboxPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sandbox"
    objects: {
      usageLogs: Prisma.$UsageLogPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      language: $Enums.SandboxLanguage
      status: $Enums.SandboxStatus
      containerId: string | null
      port: number | null
      timeoutSecs: number
      startedAt: Date | null
      terminatedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["sandbox"]>
    composites: {}
  }

  type SandboxGetPayload<S extends boolean | null | undefined | SandboxDefaultArgs> = $Result.GetResult<Prisma.$SandboxPayload, S>

  type SandboxCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SandboxFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SandboxCountAggregateInputType | true
    }

  export interface SandboxDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sandbox'], meta: { name: 'Sandbox' } }
    /**
     * Find zero or one Sandbox that matches the filter.
     * @param {SandboxFindUniqueArgs} args - Arguments to find a Sandbox
     * @example
     * // Get one Sandbox
     * const sandbox = await prisma.sandbox.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SandboxFindUniqueArgs>(args: SelectSubset<T, SandboxFindUniqueArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sandbox that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SandboxFindUniqueOrThrowArgs} args - Arguments to find a Sandbox
     * @example
     * // Get one Sandbox
     * const sandbox = await prisma.sandbox.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SandboxFindUniqueOrThrowArgs>(args: SelectSubset<T, SandboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sandbox that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxFindFirstArgs} args - Arguments to find a Sandbox
     * @example
     * // Get one Sandbox
     * const sandbox = await prisma.sandbox.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SandboxFindFirstArgs>(args?: SelectSubset<T, SandboxFindFirstArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sandbox that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxFindFirstOrThrowArgs} args - Arguments to find a Sandbox
     * @example
     * // Get one Sandbox
     * const sandbox = await prisma.sandbox.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SandboxFindFirstOrThrowArgs>(args?: SelectSubset<T, SandboxFindFirstOrThrowArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sandboxes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sandboxes
     * const sandboxes = await prisma.sandbox.findMany()
     * 
     * // Get first 10 Sandboxes
     * const sandboxes = await prisma.sandbox.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sandboxWithIdOnly = await prisma.sandbox.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SandboxFindManyArgs>(args?: SelectSubset<T, SandboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sandbox.
     * @param {SandboxCreateArgs} args - Arguments to create a Sandbox.
     * @example
     * // Create one Sandbox
     * const Sandbox = await prisma.sandbox.create({
     *   data: {
     *     // ... data to create a Sandbox
     *   }
     * })
     * 
     */
    create<T extends SandboxCreateArgs>(args: SelectSubset<T, SandboxCreateArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sandboxes.
     * @param {SandboxCreateManyArgs} args - Arguments to create many Sandboxes.
     * @example
     * // Create many Sandboxes
     * const sandbox = await prisma.sandbox.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SandboxCreateManyArgs>(args?: SelectSubset<T, SandboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sandboxes and returns the data saved in the database.
     * @param {SandboxCreateManyAndReturnArgs} args - Arguments to create many Sandboxes.
     * @example
     * // Create many Sandboxes
     * const sandbox = await prisma.sandbox.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sandboxes and only return the `id`
     * const sandboxWithIdOnly = await prisma.sandbox.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SandboxCreateManyAndReturnArgs>(args?: SelectSubset<T, SandboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sandbox.
     * @param {SandboxDeleteArgs} args - Arguments to delete one Sandbox.
     * @example
     * // Delete one Sandbox
     * const Sandbox = await prisma.sandbox.delete({
     *   where: {
     *     // ... filter to delete one Sandbox
     *   }
     * })
     * 
     */
    delete<T extends SandboxDeleteArgs>(args: SelectSubset<T, SandboxDeleteArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sandbox.
     * @param {SandboxUpdateArgs} args - Arguments to update one Sandbox.
     * @example
     * // Update one Sandbox
     * const sandbox = await prisma.sandbox.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SandboxUpdateArgs>(args: SelectSubset<T, SandboxUpdateArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sandboxes.
     * @param {SandboxDeleteManyArgs} args - Arguments to filter Sandboxes to delete.
     * @example
     * // Delete a few Sandboxes
     * const { count } = await prisma.sandbox.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SandboxDeleteManyArgs>(args?: SelectSubset<T, SandboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sandboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sandboxes
     * const sandbox = await prisma.sandbox.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SandboxUpdateManyArgs>(args: SelectSubset<T, SandboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sandboxes and returns the data updated in the database.
     * @param {SandboxUpdateManyAndReturnArgs} args - Arguments to update many Sandboxes.
     * @example
     * // Update many Sandboxes
     * const sandbox = await prisma.sandbox.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sandboxes and only return the `id`
     * const sandboxWithIdOnly = await prisma.sandbox.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SandboxUpdateManyAndReturnArgs>(args: SelectSubset<T, SandboxUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sandbox.
     * @param {SandboxUpsertArgs} args - Arguments to update or create a Sandbox.
     * @example
     * // Update or create a Sandbox
     * const sandbox = await prisma.sandbox.upsert({
     *   create: {
     *     // ... data to create a Sandbox
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sandbox we want to update
     *   }
     * })
     */
    upsert<T extends SandboxUpsertArgs>(args: SelectSubset<T, SandboxUpsertArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sandboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxCountArgs} args - Arguments to filter Sandboxes to count.
     * @example
     * // Count the number of Sandboxes
     * const count = await prisma.sandbox.count({
     *   where: {
     *     // ... the filter for the Sandboxes we want to count
     *   }
     * })
    **/
    count<T extends SandboxCountArgs>(
      args?: Subset<T, SandboxCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SandboxCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sandbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SandboxAggregateArgs>(args: Subset<T, SandboxAggregateArgs>): Prisma.PrismaPromise<GetSandboxAggregateType<T>>

    /**
     * Group by Sandbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SandboxGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SandboxGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SandboxGroupByArgs['orderBy'] }
        : { orderBy?: SandboxGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SandboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSandboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sandbox model
   */
  readonly fields: SandboxFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sandbox.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SandboxClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usageLogs<T extends Sandbox$usageLogsArgs<ExtArgs> = {}>(args?: Subset<T, Sandbox$usageLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sandbox model
   */
  interface SandboxFieldRefs {
    readonly id: FieldRef<"Sandbox", 'String'>
    readonly userId: FieldRef<"Sandbox", 'String'>
    readonly language: FieldRef<"Sandbox", 'SandboxLanguage'>
    readonly status: FieldRef<"Sandbox", 'SandboxStatus'>
    readonly containerId: FieldRef<"Sandbox", 'String'>
    readonly port: FieldRef<"Sandbox", 'Int'>
    readonly timeoutSecs: FieldRef<"Sandbox", 'Int'>
    readonly startedAt: FieldRef<"Sandbox", 'DateTime'>
    readonly terminatedAt: FieldRef<"Sandbox", 'DateTime'>
    readonly createdAt: FieldRef<"Sandbox", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sandbox findUnique
   */
  export type SandboxFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter, which Sandbox to fetch.
     */
    where: SandboxWhereUniqueInput
  }

  /**
   * Sandbox findUniqueOrThrow
   */
  export type SandboxFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter, which Sandbox to fetch.
     */
    where: SandboxWhereUniqueInput
  }

  /**
   * Sandbox findFirst
   */
  export type SandboxFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter, which Sandbox to fetch.
     */
    where?: SandboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sandboxes to fetch.
     */
    orderBy?: SandboxOrderByWithRelationInput | SandboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sandboxes.
     */
    cursor?: SandboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sandboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sandboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sandboxes.
     */
    distinct?: SandboxScalarFieldEnum | SandboxScalarFieldEnum[]
  }

  /**
   * Sandbox findFirstOrThrow
   */
  export type SandboxFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter, which Sandbox to fetch.
     */
    where?: SandboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sandboxes to fetch.
     */
    orderBy?: SandboxOrderByWithRelationInput | SandboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sandboxes.
     */
    cursor?: SandboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sandboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sandboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sandboxes.
     */
    distinct?: SandboxScalarFieldEnum | SandboxScalarFieldEnum[]
  }

  /**
   * Sandbox findMany
   */
  export type SandboxFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter, which Sandboxes to fetch.
     */
    where?: SandboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sandboxes to fetch.
     */
    orderBy?: SandboxOrderByWithRelationInput | SandboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sandboxes.
     */
    cursor?: SandboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sandboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sandboxes.
     */
    skip?: number
    distinct?: SandboxScalarFieldEnum | SandboxScalarFieldEnum[]
  }

  /**
   * Sandbox create
   */
  export type SandboxCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * The data needed to create a Sandbox.
     */
    data: XOR<SandboxCreateInput, SandboxUncheckedCreateInput>
  }

  /**
   * Sandbox createMany
   */
  export type SandboxCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sandboxes.
     */
    data: SandboxCreateManyInput | SandboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sandbox createManyAndReturn
   */
  export type SandboxCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * The data used to create many Sandboxes.
     */
    data: SandboxCreateManyInput | SandboxCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sandbox update
   */
  export type SandboxUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * The data needed to update a Sandbox.
     */
    data: XOR<SandboxUpdateInput, SandboxUncheckedUpdateInput>
    /**
     * Choose, which Sandbox to update.
     */
    where: SandboxWhereUniqueInput
  }

  /**
   * Sandbox updateMany
   */
  export type SandboxUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sandboxes.
     */
    data: XOR<SandboxUpdateManyMutationInput, SandboxUncheckedUpdateManyInput>
    /**
     * Filter which Sandboxes to update
     */
    where?: SandboxWhereInput
    /**
     * Limit how many Sandboxes to update.
     */
    limit?: number
  }

  /**
   * Sandbox updateManyAndReturn
   */
  export type SandboxUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * The data used to update Sandboxes.
     */
    data: XOR<SandboxUpdateManyMutationInput, SandboxUncheckedUpdateManyInput>
    /**
     * Filter which Sandboxes to update
     */
    where?: SandboxWhereInput
    /**
     * Limit how many Sandboxes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sandbox upsert
   */
  export type SandboxUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * The filter to search for the Sandbox to update in case it exists.
     */
    where: SandboxWhereUniqueInput
    /**
     * In case the Sandbox found by the `where` argument doesn't exist, create a new Sandbox with this data.
     */
    create: XOR<SandboxCreateInput, SandboxUncheckedCreateInput>
    /**
     * In case the Sandbox was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SandboxUpdateInput, SandboxUncheckedUpdateInput>
  }

  /**
   * Sandbox delete
   */
  export type SandboxDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
    /**
     * Filter which Sandbox to delete.
     */
    where: SandboxWhereUniqueInput
  }

  /**
   * Sandbox deleteMany
   */
  export type SandboxDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sandboxes to delete
     */
    where?: SandboxWhereInput
    /**
     * Limit how many Sandboxes to delete.
     */
    limit?: number
  }

  /**
   * Sandbox.usageLogs
   */
  export type Sandbox$usageLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    where?: UsageLogWhereInput
    orderBy?: UsageLogOrderByWithRelationInput | UsageLogOrderByWithRelationInput[]
    cursor?: UsageLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageLogScalarFieldEnum | UsageLogScalarFieldEnum[]
  }

  /**
   * Sandbox without action
   */
  export type SandboxDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sandbox
     */
    select?: SandboxSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sandbox
     */
    omit?: SandboxOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SandboxInclude<ExtArgs> | null
  }


  /**
   * Model UsageLog
   */

  export type AggregateUsageLog = {
    _count: UsageLogCountAggregateOutputType | null
    _avg: UsageLogAvgAggregateOutputType | null
    _sum: UsageLogSumAggregateOutputType | null
    _min: UsageLogMinAggregateOutputType | null
    _max: UsageLogMaxAggregateOutputType | null
  }

  export type UsageLogAvgAggregateOutputType = {
    durationSecs: number | null
    billedAmount: number | null
  }

  export type UsageLogSumAggregateOutputType = {
    durationSecs: number | null
    billedAmount: number | null
  }

  export type UsageLogMinAggregateOutputType = {
    id: string | null
    sandboxId: string | null
    userId: string | null
    durationSecs: number | null
    billedAmount: number | null
    language: string | null
    createdAt: Date | null
  }

  export type UsageLogMaxAggregateOutputType = {
    id: string | null
    sandboxId: string | null
    userId: string | null
    durationSecs: number | null
    billedAmount: number | null
    language: string | null
    createdAt: Date | null
  }

  export type UsageLogCountAggregateOutputType = {
    id: number
    sandboxId: number
    userId: number
    durationSecs: number
    billedAmount: number
    language: number
    createdAt: number
    _all: number
  }


  export type UsageLogAvgAggregateInputType = {
    durationSecs?: true
    billedAmount?: true
  }

  export type UsageLogSumAggregateInputType = {
    durationSecs?: true
    billedAmount?: true
  }

  export type UsageLogMinAggregateInputType = {
    id?: true
    sandboxId?: true
    userId?: true
    durationSecs?: true
    billedAmount?: true
    language?: true
    createdAt?: true
  }

  export type UsageLogMaxAggregateInputType = {
    id?: true
    sandboxId?: true
    userId?: true
    durationSecs?: true
    billedAmount?: true
    language?: true
    createdAt?: true
  }

  export type UsageLogCountAggregateInputType = {
    id?: true
    sandboxId?: true
    userId?: true
    durationSecs?: true
    billedAmount?: true
    language?: true
    createdAt?: true
    _all?: true
  }

  export type UsageLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageLog to aggregate.
     */
    where?: UsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageLogs to fetch.
     */
    orderBy?: UsageLogOrderByWithRelationInput | UsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageLogs
    **/
    _count?: true | UsageLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageLogMaxAggregateInputType
  }

  export type GetUsageLogAggregateType<T extends UsageLogAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageLog[P]>
      : GetScalarType<T[P], AggregateUsageLog[P]>
  }




  export type UsageLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageLogWhereInput
    orderBy?: UsageLogOrderByWithAggregationInput | UsageLogOrderByWithAggregationInput[]
    by: UsageLogScalarFieldEnum[] | UsageLogScalarFieldEnum
    having?: UsageLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageLogCountAggregateInputType | true
    _avg?: UsageLogAvgAggregateInputType
    _sum?: UsageLogSumAggregateInputType
    _min?: UsageLogMinAggregateInputType
    _max?: UsageLogMaxAggregateInputType
  }

  export type UsageLogGroupByOutputType = {
    id: string
    sandboxId: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt: Date
    _count: UsageLogCountAggregateOutputType | null
    _avg: UsageLogAvgAggregateOutputType | null
    _sum: UsageLogSumAggregateOutputType | null
    _min: UsageLogMinAggregateOutputType | null
    _max: UsageLogMaxAggregateOutputType | null
  }

  type GetUsageLogGroupByPayload<T extends UsageLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageLogGroupByOutputType[P]>
            : GetScalarType<T[P], UsageLogGroupByOutputType[P]>
        }
      >
    >


  export type UsageLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sandboxId?: boolean
    userId?: boolean
    durationSecs?: boolean
    billedAmount?: boolean
    language?: boolean
    createdAt?: boolean
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageLog"]>

  export type UsageLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sandboxId?: boolean
    userId?: boolean
    durationSecs?: boolean
    billedAmount?: boolean
    language?: boolean
    createdAt?: boolean
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageLog"]>

  export type UsageLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sandboxId?: boolean
    userId?: boolean
    durationSecs?: boolean
    billedAmount?: boolean
    language?: boolean
    createdAt?: boolean
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageLog"]>

  export type UsageLogSelectScalar = {
    id?: boolean
    sandboxId?: boolean
    userId?: boolean
    durationSecs?: boolean
    billedAmount?: boolean
    language?: boolean
    createdAt?: boolean
  }

  export type UsageLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sandboxId" | "userId" | "durationSecs" | "billedAmount" | "language" | "createdAt", ExtArgs["result"]["usageLog"]>
  export type UsageLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }
  export type UsageLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }
  export type UsageLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sandbox?: boolean | SandboxDefaultArgs<ExtArgs>
  }

  export type $UsageLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageLog"
    objects: {
      sandbox: Prisma.$SandboxPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sandboxId: string
      userId: string
      durationSecs: number
      billedAmount: number
      language: string
      createdAt: Date
    }, ExtArgs["result"]["usageLog"]>
    composites: {}
  }

  type UsageLogGetPayload<S extends boolean | null | undefined | UsageLogDefaultArgs> = $Result.GetResult<Prisma.$UsageLogPayload, S>

  type UsageLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsageLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsageLogCountAggregateInputType | true
    }

  export interface UsageLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageLog'], meta: { name: 'UsageLog' } }
    /**
     * Find zero or one UsageLog that matches the filter.
     * @param {UsageLogFindUniqueArgs} args - Arguments to find a UsageLog
     * @example
     * // Get one UsageLog
     * const usageLog = await prisma.usageLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageLogFindUniqueArgs>(args: SelectSubset<T, UsageLogFindUniqueArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsageLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsageLogFindUniqueOrThrowArgs} args - Arguments to find a UsageLog
     * @example
     * // Get one UsageLog
     * const usageLog = await prisma.usageLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageLogFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogFindFirstArgs} args - Arguments to find a UsageLog
     * @example
     * // Get one UsageLog
     * const usageLog = await prisma.usageLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageLogFindFirstArgs>(args?: SelectSubset<T, UsageLogFindFirstArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogFindFirstOrThrowArgs} args - Arguments to find a UsageLog
     * @example
     * // Get one UsageLog
     * const usageLog = await prisma.usageLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageLogFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsageLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageLogs
     * const usageLogs = await prisma.usageLog.findMany()
     * 
     * // Get first 10 UsageLogs
     * const usageLogs = await prisma.usageLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageLogWithIdOnly = await prisma.usageLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageLogFindManyArgs>(args?: SelectSubset<T, UsageLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsageLog.
     * @param {UsageLogCreateArgs} args - Arguments to create a UsageLog.
     * @example
     * // Create one UsageLog
     * const UsageLog = await prisma.usageLog.create({
     *   data: {
     *     // ... data to create a UsageLog
     *   }
     * })
     * 
     */
    create<T extends UsageLogCreateArgs>(args: SelectSubset<T, UsageLogCreateArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsageLogs.
     * @param {UsageLogCreateManyArgs} args - Arguments to create many UsageLogs.
     * @example
     * // Create many UsageLogs
     * const usageLog = await prisma.usageLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageLogCreateManyArgs>(args?: SelectSubset<T, UsageLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageLogs and returns the data saved in the database.
     * @param {UsageLogCreateManyAndReturnArgs} args - Arguments to create many UsageLogs.
     * @example
     * // Create many UsageLogs
     * const usageLog = await prisma.usageLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageLogs and only return the `id`
     * const usageLogWithIdOnly = await prisma.usageLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageLogCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsageLog.
     * @param {UsageLogDeleteArgs} args - Arguments to delete one UsageLog.
     * @example
     * // Delete one UsageLog
     * const UsageLog = await prisma.usageLog.delete({
     *   where: {
     *     // ... filter to delete one UsageLog
     *   }
     * })
     * 
     */
    delete<T extends UsageLogDeleteArgs>(args: SelectSubset<T, UsageLogDeleteArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsageLog.
     * @param {UsageLogUpdateArgs} args - Arguments to update one UsageLog.
     * @example
     * // Update one UsageLog
     * const usageLog = await prisma.usageLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageLogUpdateArgs>(args: SelectSubset<T, UsageLogUpdateArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsageLogs.
     * @param {UsageLogDeleteManyArgs} args - Arguments to filter UsageLogs to delete.
     * @example
     * // Delete a few UsageLogs
     * const { count } = await prisma.usageLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageLogDeleteManyArgs>(args?: SelectSubset<T, UsageLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageLogs
     * const usageLog = await prisma.usageLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageLogUpdateManyArgs>(args: SelectSubset<T, UsageLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageLogs and returns the data updated in the database.
     * @param {UsageLogUpdateManyAndReturnArgs} args - Arguments to update many UsageLogs.
     * @example
     * // Update many UsageLogs
     * const usageLog = await prisma.usageLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsageLogs and only return the `id`
     * const usageLogWithIdOnly = await prisma.usageLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsageLogUpdateManyAndReturnArgs>(args: SelectSubset<T, UsageLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsageLog.
     * @param {UsageLogUpsertArgs} args - Arguments to update or create a UsageLog.
     * @example
     * // Update or create a UsageLog
     * const usageLog = await prisma.usageLog.upsert({
     *   create: {
     *     // ... data to create a UsageLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageLog we want to update
     *   }
     * })
     */
    upsert<T extends UsageLogUpsertArgs>(args: SelectSubset<T, UsageLogUpsertArgs<ExtArgs>>): Prisma__UsageLogClient<$Result.GetResult<Prisma.$UsageLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogCountArgs} args - Arguments to filter UsageLogs to count.
     * @example
     * // Count the number of UsageLogs
     * const count = await prisma.usageLog.count({
     *   where: {
     *     // ... the filter for the UsageLogs we want to count
     *   }
     * })
    **/
    count<T extends UsageLogCountArgs>(
      args?: Subset<T, UsageLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsageLogAggregateArgs>(args: Subset<T, UsageLogAggregateArgs>): Prisma.PrismaPromise<GetUsageLogAggregateType<T>>

    /**
     * Group by UsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsageLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageLogGroupByArgs['orderBy'] }
        : { orderBy?: UsageLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsageLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageLog model
   */
  readonly fields: UsageLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sandbox<T extends SandboxDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SandboxDefaultArgs<ExtArgs>>): Prisma__SandboxClient<$Result.GetResult<Prisma.$SandboxPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsageLog model
   */
  interface UsageLogFieldRefs {
    readonly id: FieldRef<"UsageLog", 'String'>
    readonly sandboxId: FieldRef<"UsageLog", 'String'>
    readonly userId: FieldRef<"UsageLog", 'String'>
    readonly durationSecs: FieldRef<"UsageLog", 'Int'>
    readonly billedAmount: FieldRef<"UsageLog", 'Float'>
    readonly language: FieldRef<"UsageLog", 'String'>
    readonly createdAt: FieldRef<"UsageLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageLog findUnique
   */
  export type UsageLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter, which UsageLog to fetch.
     */
    where: UsageLogWhereUniqueInput
  }

  /**
   * UsageLog findUniqueOrThrow
   */
  export type UsageLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter, which UsageLog to fetch.
     */
    where: UsageLogWhereUniqueInput
  }

  /**
   * UsageLog findFirst
   */
  export type UsageLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter, which UsageLog to fetch.
     */
    where?: UsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageLogs to fetch.
     */
    orderBy?: UsageLogOrderByWithRelationInput | UsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageLogs.
     */
    cursor?: UsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageLogs.
     */
    distinct?: UsageLogScalarFieldEnum | UsageLogScalarFieldEnum[]
  }

  /**
   * UsageLog findFirstOrThrow
   */
  export type UsageLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter, which UsageLog to fetch.
     */
    where?: UsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageLogs to fetch.
     */
    orderBy?: UsageLogOrderByWithRelationInput | UsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageLogs.
     */
    cursor?: UsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageLogs.
     */
    distinct?: UsageLogScalarFieldEnum | UsageLogScalarFieldEnum[]
  }

  /**
   * UsageLog findMany
   */
  export type UsageLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter, which UsageLogs to fetch.
     */
    where?: UsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageLogs to fetch.
     */
    orderBy?: UsageLogOrderByWithRelationInput | UsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageLogs.
     */
    cursor?: UsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageLogs.
     */
    skip?: number
    distinct?: UsageLogScalarFieldEnum | UsageLogScalarFieldEnum[]
  }

  /**
   * UsageLog create
   */
  export type UsageLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * The data needed to create a UsageLog.
     */
    data: XOR<UsageLogCreateInput, UsageLogUncheckedCreateInput>
  }

  /**
   * UsageLog createMany
   */
  export type UsageLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageLogs.
     */
    data: UsageLogCreateManyInput | UsageLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageLog createManyAndReturn
   */
  export type UsageLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * The data used to create many UsageLogs.
     */
    data: UsageLogCreateManyInput | UsageLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageLog update
   */
  export type UsageLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * The data needed to update a UsageLog.
     */
    data: XOR<UsageLogUpdateInput, UsageLogUncheckedUpdateInput>
    /**
     * Choose, which UsageLog to update.
     */
    where: UsageLogWhereUniqueInput
  }

  /**
   * UsageLog updateMany
   */
  export type UsageLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageLogs.
     */
    data: XOR<UsageLogUpdateManyMutationInput, UsageLogUncheckedUpdateManyInput>
    /**
     * Filter which UsageLogs to update
     */
    where?: UsageLogWhereInput
    /**
     * Limit how many UsageLogs to update.
     */
    limit?: number
  }

  /**
   * UsageLog updateManyAndReturn
   */
  export type UsageLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * The data used to update UsageLogs.
     */
    data: XOR<UsageLogUpdateManyMutationInput, UsageLogUncheckedUpdateManyInput>
    /**
     * Filter which UsageLogs to update
     */
    where?: UsageLogWhereInput
    /**
     * Limit how many UsageLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageLog upsert
   */
  export type UsageLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * The filter to search for the UsageLog to update in case it exists.
     */
    where: UsageLogWhereUniqueInput
    /**
     * In case the UsageLog found by the `where` argument doesn't exist, create a new UsageLog with this data.
     */
    create: XOR<UsageLogCreateInput, UsageLogUncheckedCreateInput>
    /**
     * In case the UsageLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageLogUpdateInput, UsageLogUncheckedUpdateInput>
  }

  /**
   * UsageLog delete
   */
  export type UsageLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
    /**
     * Filter which UsageLog to delete.
     */
    where: UsageLogWhereUniqueInput
  }

  /**
   * UsageLog deleteMany
   */
  export type UsageLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageLogs to delete
     */
    where?: UsageLogWhereInput
    /**
     * Limit how many UsageLogs to delete.
     */
    limit?: number
  }

  /**
   * UsageLog without action
   */
  export type UsageLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageLog
     */
    select?: UsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageLog
     */
    omit?: UsageLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageLogInclude<ExtArgs> | null
  }


  /**
   * Model AgentMemory
   */

  export type AggregateAgentMemory = {
    _count: AgentMemoryCountAggregateOutputType | null
    _min: AgentMemoryMinAggregateOutputType | null
    _max: AgentMemoryMaxAggregateOutputType | null
  }

  export type AgentMemoryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    namespace: string | null
    key: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentMemoryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    namespace: string | null
    key: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentMemoryCountAggregateOutputType = {
    id: number
    userId: number
    namespace: number
    key: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentMemoryMinAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    key?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentMemoryMaxAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    key?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentMemoryCountAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    key?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentMemoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentMemory to aggregate.
     */
    where?: AgentMemoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentMemories to fetch.
     */
    orderBy?: AgentMemoryOrderByWithRelationInput | AgentMemoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentMemoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentMemories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentMemories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentMemories
    **/
    _count?: true | AgentMemoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentMemoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentMemoryMaxAggregateInputType
  }

  export type GetAgentMemoryAggregateType<T extends AgentMemoryAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentMemory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentMemory[P]>
      : GetScalarType<T[P], AggregateAgentMemory[P]>
  }




  export type AgentMemoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentMemoryWhereInput
    orderBy?: AgentMemoryOrderByWithAggregationInput | AgentMemoryOrderByWithAggregationInput[]
    by: AgentMemoryScalarFieldEnum[] | AgentMemoryScalarFieldEnum
    having?: AgentMemoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentMemoryCountAggregateInputType | true
    _min?: AgentMemoryMinAggregateInputType
    _max?: AgentMemoryMaxAggregateInputType
  }

  export type AgentMemoryGroupByOutputType = {
    id: string
    userId: string
    namespace: string
    key: string
    value: string
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AgentMemoryCountAggregateOutputType | null
    _min: AgentMemoryMinAggregateOutputType | null
    _max: AgentMemoryMaxAggregateOutputType | null
  }

  type GetAgentMemoryGroupByPayload<T extends AgentMemoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentMemoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentMemoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentMemoryGroupByOutputType[P]>
            : GetScalarType<T[P], AgentMemoryGroupByOutputType[P]>
        }
      >
    >


  export type AgentMemorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    key?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentMemory"]>

  export type AgentMemorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    key?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentMemory"]>

  export type AgentMemorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    key?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentMemory"]>

  export type AgentMemorySelectScalar = {
    id?: boolean
    userId?: boolean
    namespace?: boolean
    key?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentMemoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "namespace" | "key" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["agentMemory"]>
  export type AgentMemoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AgentMemoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AgentMemoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AgentMemoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentMemory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      namespace: string
      key: string
      value: string
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agentMemory"]>
    composites: {}
  }

  type AgentMemoryGetPayload<S extends boolean | null | undefined | AgentMemoryDefaultArgs> = $Result.GetResult<Prisma.$AgentMemoryPayload, S>

  type AgentMemoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentMemoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentMemoryCountAggregateInputType | true
    }

  export interface AgentMemoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentMemory'], meta: { name: 'AgentMemory' } }
    /**
     * Find zero or one AgentMemory that matches the filter.
     * @param {AgentMemoryFindUniqueArgs} args - Arguments to find a AgentMemory
     * @example
     * // Get one AgentMemory
     * const agentMemory = await prisma.agentMemory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentMemoryFindUniqueArgs>(args: SelectSubset<T, AgentMemoryFindUniqueArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentMemory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentMemoryFindUniqueOrThrowArgs} args - Arguments to find a AgentMemory
     * @example
     * // Get one AgentMemory
     * const agentMemory = await prisma.agentMemory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentMemoryFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentMemoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentMemory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryFindFirstArgs} args - Arguments to find a AgentMemory
     * @example
     * // Get one AgentMemory
     * const agentMemory = await prisma.agentMemory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentMemoryFindFirstArgs>(args?: SelectSubset<T, AgentMemoryFindFirstArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentMemory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryFindFirstOrThrowArgs} args - Arguments to find a AgentMemory
     * @example
     * // Get one AgentMemory
     * const agentMemory = await prisma.agentMemory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentMemoryFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentMemoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentMemories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentMemories
     * const agentMemories = await prisma.agentMemory.findMany()
     * 
     * // Get first 10 AgentMemories
     * const agentMemories = await prisma.agentMemory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentMemoryWithIdOnly = await prisma.agentMemory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentMemoryFindManyArgs>(args?: SelectSubset<T, AgentMemoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentMemory.
     * @param {AgentMemoryCreateArgs} args - Arguments to create a AgentMemory.
     * @example
     * // Create one AgentMemory
     * const AgentMemory = await prisma.agentMemory.create({
     *   data: {
     *     // ... data to create a AgentMemory
     *   }
     * })
     * 
     */
    create<T extends AgentMemoryCreateArgs>(args: SelectSubset<T, AgentMemoryCreateArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentMemories.
     * @param {AgentMemoryCreateManyArgs} args - Arguments to create many AgentMemories.
     * @example
     * // Create many AgentMemories
     * const agentMemory = await prisma.agentMemory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentMemoryCreateManyArgs>(args?: SelectSubset<T, AgentMemoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentMemories and returns the data saved in the database.
     * @param {AgentMemoryCreateManyAndReturnArgs} args - Arguments to create many AgentMemories.
     * @example
     * // Create many AgentMemories
     * const agentMemory = await prisma.agentMemory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentMemories and only return the `id`
     * const agentMemoryWithIdOnly = await prisma.agentMemory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentMemoryCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentMemoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentMemory.
     * @param {AgentMemoryDeleteArgs} args - Arguments to delete one AgentMemory.
     * @example
     * // Delete one AgentMemory
     * const AgentMemory = await prisma.agentMemory.delete({
     *   where: {
     *     // ... filter to delete one AgentMemory
     *   }
     * })
     * 
     */
    delete<T extends AgentMemoryDeleteArgs>(args: SelectSubset<T, AgentMemoryDeleteArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentMemory.
     * @param {AgentMemoryUpdateArgs} args - Arguments to update one AgentMemory.
     * @example
     * // Update one AgentMemory
     * const agentMemory = await prisma.agentMemory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentMemoryUpdateArgs>(args: SelectSubset<T, AgentMemoryUpdateArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentMemories.
     * @param {AgentMemoryDeleteManyArgs} args - Arguments to filter AgentMemories to delete.
     * @example
     * // Delete a few AgentMemories
     * const { count } = await prisma.agentMemory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentMemoryDeleteManyArgs>(args?: SelectSubset<T, AgentMemoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentMemories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentMemories
     * const agentMemory = await prisma.agentMemory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentMemoryUpdateManyArgs>(args: SelectSubset<T, AgentMemoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentMemories and returns the data updated in the database.
     * @param {AgentMemoryUpdateManyAndReturnArgs} args - Arguments to update many AgentMemories.
     * @example
     * // Update many AgentMemories
     * const agentMemory = await prisma.agentMemory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentMemories and only return the `id`
     * const agentMemoryWithIdOnly = await prisma.agentMemory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentMemoryUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentMemoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentMemory.
     * @param {AgentMemoryUpsertArgs} args - Arguments to update or create a AgentMemory.
     * @example
     * // Update or create a AgentMemory
     * const agentMemory = await prisma.agentMemory.upsert({
     *   create: {
     *     // ... data to create a AgentMemory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentMemory we want to update
     *   }
     * })
     */
    upsert<T extends AgentMemoryUpsertArgs>(args: SelectSubset<T, AgentMemoryUpsertArgs<ExtArgs>>): Prisma__AgentMemoryClient<$Result.GetResult<Prisma.$AgentMemoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentMemories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryCountArgs} args - Arguments to filter AgentMemories to count.
     * @example
     * // Count the number of AgentMemories
     * const count = await prisma.agentMemory.count({
     *   where: {
     *     // ... the filter for the AgentMemories we want to count
     *   }
     * })
    **/
    count<T extends AgentMemoryCountArgs>(
      args?: Subset<T, AgentMemoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentMemoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentMemory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentMemoryAggregateArgs>(args: Subset<T, AgentMemoryAggregateArgs>): Prisma.PrismaPromise<GetAgentMemoryAggregateType<T>>

    /**
     * Group by AgentMemory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentMemoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentMemoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentMemoryGroupByArgs['orderBy'] }
        : { orderBy?: AgentMemoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentMemoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentMemoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentMemory model
   */
  readonly fields: AgentMemoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentMemory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentMemoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentMemory model
   */
  interface AgentMemoryFieldRefs {
    readonly id: FieldRef<"AgentMemory", 'String'>
    readonly userId: FieldRef<"AgentMemory", 'String'>
    readonly namespace: FieldRef<"AgentMemory", 'String'>
    readonly key: FieldRef<"AgentMemory", 'String'>
    readonly value: FieldRef<"AgentMemory", 'String'>
    readonly expiresAt: FieldRef<"AgentMemory", 'DateTime'>
    readonly createdAt: FieldRef<"AgentMemory", 'DateTime'>
    readonly updatedAt: FieldRef<"AgentMemory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentMemory findUnique
   */
  export type AgentMemoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter, which AgentMemory to fetch.
     */
    where: AgentMemoryWhereUniqueInput
  }

  /**
   * AgentMemory findUniqueOrThrow
   */
  export type AgentMemoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter, which AgentMemory to fetch.
     */
    where: AgentMemoryWhereUniqueInput
  }

  /**
   * AgentMemory findFirst
   */
  export type AgentMemoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter, which AgentMemory to fetch.
     */
    where?: AgentMemoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentMemories to fetch.
     */
    orderBy?: AgentMemoryOrderByWithRelationInput | AgentMemoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentMemories.
     */
    cursor?: AgentMemoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentMemories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentMemories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentMemories.
     */
    distinct?: AgentMemoryScalarFieldEnum | AgentMemoryScalarFieldEnum[]
  }

  /**
   * AgentMemory findFirstOrThrow
   */
  export type AgentMemoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter, which AgentMemory to fetch.
     */
    where?: AgentMemoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentMemories to fetch.
     */
    orderBy?: AgentMemoryOrderByWithRelationInput | AgentMemoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentMemories.
     */
    cursor?: AgentMemoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentMemories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentMemories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentMemories.
     */
    distinct?: AgentMemoryScalarFieldEnum | AgentMemoryScalarFieldEnum[]
  }

  /**
   * AgentMemory findMany
   */
  export type AgentMemoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter, which AgentMemories to fetch.
     */
    where?: AgentMemoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentMemories to fetch.
     */
    orderBy?: AgentMemoryOrderByWithRelationInput | AgentMemoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentMemories.
     */
    cursor?: AgentMemoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentMemories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentMemories.
     */
    skip?: number
    distinct?: AgentMemoryScalarFieldEnum | AgentMemoryScalarFieldEnum[]
  }

  /**
   * AgentMemory create
   */
  export type AgentMemoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentMemory.
     */
    data: XOR<AgentMemoryCreateInput, AgentMemoryUncheckedCreateInput>
  }

  /**
   * AgentMemory createMany
   */
  export type AgentMemoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentMemories.
     */
    data: AgentMemoryCreateManyInput | AgentMemoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentMemory createManyAndReturn
   */
  export type AgentMemoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * The data used to create many AgentMemories.
     */
    data: AgentMemoryCreateManyInput | AgentMemoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentMemory update
   */
  export type AgentMemoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentMemory.
     */
    data: XOR<AgentMemoryUpdateInput, AgentMemoryUncheckedUpdateInput>
    /**
     * Choose, which AgentMemory to update.
     */
    where: AgentMemoryWhereUniqueInput
  }

  /**
   * AgentMemory updateMany
   */
  export type AgentMemoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentMemories.
     */
    data: XOR<AgentMemoryUpdateManyMutationInput, AgentMemoryUncheckedUpdateManyInput>
    /**
     * Filter which AgentMemories to update
     */
    where?: AgentMemoryWhereInput
    /**
     * Limit how many AgentMemories to update.
     */
    limit?: number
  }

  /**
   * AgentMemory updateManyAndReturn
   */
  export type AgentMemoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * The data used to update AgentMemories.
     */
    data: XOR<AgentMemoryUpdateManyMutationInput, AgentMemoryUncheckedUpdateManyInput>
    /**
     * Filter which AgentMemories to update
     */
    where?: AgentMemoryWhereInput
    /**
     * Limit how many AgentMemories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentMemory upsert
   */
  export type AgentMemoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentMemory to update in case it exists.
     */
    where: AgentMemoryWhereUniqueInput
    /**
     * In case the AgentMemory found by the `where` argument doesn't exist, create a new AgentMemory with this data.
     */
    create: XOR<AgentMemoryCreateInput, AgentMemoryUncheckedCreateInput>
    /**
     * In case the AgentMemory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentMemoryUpdateInput, AgentMemoryUncheckedUpdateInput>
  }

  /**
   * AgentMemory delete
   */
  export type AgentMemoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
    /**
     * Filter which AgentMemory to delete.
     */
    where: AgentMemoryWhereUniqueInput
  }

  /**
   * AgentMemory deleteMany
   */
  export type AgentMemoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentMemories to delete
     */
    where?: AgentMemoryWhereInput
    /**
     * Limit how many AgentMemories to delete.
     */
    limit?: number
  }

  /**
   * AgentMemory without action
   */
  export type AgentMemoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentMemory
     */
    select?: AgentMemorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentMemory
     */
    omit?: AgentMemoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentMemoryInclude<ExtArgs> | null
  }


  /**
   * Model AgentEvent
   */

  export type AggregateAgentEvent = {
    _count: AgentEventCountAggregateOutputType | null
    _min: AgentEventMinAggregateOutputType | null
    _max: AgentEventMaxAggregateOutputType | null
  }

  export type AgentEventMinAggregateOutputType = {
    id: string | null
    userId: string | null
    namespace: string | null
    eventType: string | null
    payload: string | null
    createdAt: Date | null
  }

  export type AgentEventMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    namespace: string | null
    eventType: string | null
    payload: string | null
    createdAt: Date | null
  }

  export type AgentEventCountAggregateOutputType = {
    id: number
    userId: number
    namespace: number
    eventType: number
    payload: number
    createdAt: number
    _all: number
  }


  export type AgentEventMinAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    eventType?: true
    payload?: true
    createdAt?: true
  }

  export type AgentEventMaxAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    eventType?: true
    payload?: true
    createdAt?: true
  }

  export type AgentEventCountAggregateInputType = {
    id?: true
    userId?: true
    namespace?: true
    eventType?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type AgentEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentEvent to aggregate.
     */
    where?: AgentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentEvents to fetch.
     */
    orderBy?: AgentEventOrderByWithRelationInput | AgentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentEvents
    **/
    _count?: true | AgentEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentEventMaxAggregateInputType
  }

  export type GetAgentEventAggregateType<T extends AgentEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentEvent[P]>
      : GetScalarType<T[P], AggregateAgentEvent[P]>
  }




  export type AgentEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentEventWhereInput
    orderBy?: AgentEventOrderByWithAggregationInput | AgentEventOrderByWithAggregationInput[]
    by: AgentEventScalarFieldEnum[] | AgentEventScalarFieldEnum
    having?: AgentEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentEventCountAggregateInputType | true
    _min?: AgentEventMinAggregateInputType
    _max?: AgentEventMaxAggregateInputType
  }

  export type AgentEventGroupByOutputType = {
    id: string
    userId: string
    namespace: string
    eventType: string
    payload: string
    createdAt: Date
    _count: AgentEventCountAggregateOutputType | null
    _min: AgentEventMinAggregateOutputType | null
    _max: AgentEventMaxAggregateOutputType | null
  }

  type GetAgentEventGroupByPayload<T extends AgentEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentEventGroupByOutputType[P]>
            : GetScalarType<T[P], AgentEventGroupByOutputType[P]>
        }
      >
    >


  export type AgentEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    eventType?: boolean
    payload?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentEvent"]>

  export type AgentEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    eventType?: boolean
    payload?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentEvent"]>

  export type AgentEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    namespace?: boolean
    eventType?: boolean
    payload?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentEvent"]>

  export type AgentEventSelectScalar = {
    id?: boolean
    userId?: boolean
    namespace?: boolean
    eventType?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type AgentEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "namespace" | "eventType" | "payload" | "createdAt", ExtArgs["result"]["agentEvent"]>
  export type AgentEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AgentEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AgentEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AgentEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentEvent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      namespace: string
      eventType: string
      payload: string
      createdAt: Date
    }, ExtArgs["result"]["agentEvent"]>
    composites: {}
  }

  type AgentEventGetPayload<S extends boolean | null | undefined | AgentEventDefaultArgs> = $Result.GetResult<Prisma.$AgentEventPayload, S>

  type AgentEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentEventCountAggregateInputType | true
    }

  export interface AgentEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentEvent'], meta: { name: 'AgentEvent' } }
    /**
     * Find zero or one AgentEvent that matches the filter.
     * @param {AgentEventFindUniqueArgs} args - Arguments to find a AgentEvent
     * @example
     * // Get one AgentEvent
     * const agentEvent = await prisma.agentEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentEventFindUniqueArgs>(args: SelectSubset<T, AgentEventFindUniqueArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentEventFindUniqueOrThrowArgs} args - Arguments to find a AgentEvent
     * @example
     * // Get one AgentEvent
     * const agentEvent = await prisma.agentEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventFindFirstArgs} args - Arguments to find a AgentEvent
     * @example
     * // Get one AgentEvent
     * const agentEvent = await prisma.agentEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentEventFindFirstArgs>(args?: SelectSubset<T, AgentEventFindFirstArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventFindFirstOrThrowArgs} args - Arguments to find a AgentEvent
     * @example
     * // Get one AgentEvent
     * const agentEvent = await prisma.agentEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentEvents
     * const agentEvents = await prisma.agentEvent.findMany()
     * 
     * // Get first 10 AgentEvents
     * const agentEvents = await prisma.agentEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentEventWithIdOnly = await prisma.agentEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentEventFindManyArgs>(args?: SelectSubset<T, AgentEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentEvent.
     * @param {AgentEventCreateArgs} args - Arguments to create a AgentEvent.
     * @example
     * // Create one AgentEvent
     * const AgentEvent = await prisma.agentEvent.create({
     *   data: {
     *     // ... data to create a AgentEvent
     *   }
     * })
     * 
     */
    create<T extends AgentEventCreateArgs>(args: SelectSubset<T, AgentEventCreateArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentEvents.
     * @param {AgentEventCreateManyArgs} args - Arguments to create many AgentEvents.
     * @example
     * // Create many AgentEvents
     * const agentEvent = await prisma.agentEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentEventCreateManyArgs>(args?: SelectSubset<T, AgentEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentEvents and returns the data saved in the database.
     * @param {AgentEventCreateManyAndReturnArgs} args - Arguments to create many AgentEvents.
     * @example
     * // Create many AgentEvents
     * const agentEvent = await prisma.agentEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentEvents and only return the `id`
     * const agentEventWithIdOnly = await prisma.agentEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentEvent.
     * @param {AgentEventDeleteArgs} args - Arguments to delete one AgentEvent.
     * @example
     * // Delete one AgentEvent
     * const AgentEvent = await prisma.agentEvent.delete({
     *   where: {
     *     // ... filter to delete one AgentEvent
     *   }
     * })
     * 
     */
    delete<T extends AgentEventDeleteArgs>(args: SelectSubset<T, AgentEventDeleteArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentEvent.
     * @param {AgentEventUpdateArgs} args - Arguments to update one AgentEvent.
     * @example
     * // Update one AgentEvent
     * const agentEvent = await prisma.agentEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentEventUpdateArgs>(args: SelectSubset<T, AgentEventUpdateArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentEvents.
     * @param {AgentEventDeleteManyArgs} args - Arguments to filter AgentEvents to delete.
     * @example
     * // Delete a few AgentEvents
     * const { count } = await prisma.agentEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentEventDeleteManyArgs>(args?: SelectSubset<T, AgentEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentEvents
     * const agentEvent = await prisma.agentEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentEventUpdateManyArgs>(args: SelectSubset<T, AgentEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentEvents and returns the data updated in the database.
     * @param {AgentEventUpdateManyAndReturnArgs} args - Arguments to update many AgentEvents.
     * @example
     * // Update many AgentEvents
     * const agentEvent = await prisma.agentEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentEvents and only return the `id`
     * const agentEventWithIdOnly = await prisma.agentEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentEvent.
     * @param {AgentEventUpsertArgs} args - Arguments to update or create a AgentEvent.
     * @example
     * // Update or create a AgentEvent
     * const agentEvent = await prisma.agentEvent.upsert({
     *   create: {
     *     // ... data to create a AgentEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentEvent we want to update
     *   }
     * })
     */
    upsert<T extends AgentEventUpsertArgs>(args: SelectSubset<T, AgentEventUpsertArgs<ExtArgs>>): Prisma__AgentEventClient<$Result.GetResult<Prisma.$AgentEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventCountArgs} args - Arguments to filter AgentEvents to count.
     * @example
     * // Count the number of AgentEvents
     * const count = await prisma.agentEvent.count({
     *   where: {
     *     // ... the filter for the AgentEvents we want to count
     *   }
     * })
    **/
    count<T extends AgentEventCountArgs>(
      args?: Subset<T, AgentEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentEventAggregateArgs>(args: Subset<T, AgentEventAggregateArgs>): Prisma.PrismaPromise<GetAgentEventAggregateType<T>>

    /**
     * Group by AgentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentEventGroupByArgs['orderBy'] }
        : { orderBy?: AgentEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentEvent model
   */
  readonly fields: AgentEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentEvent model
   */
  interface AgentEventFieldRefs {
    readonly id: FieldRef<"AgentEvent", 'String'>
    readonly userId: FieldRef<"AgentEvent", 'String'>
    readonly namespace: FieldRef<"AgentEvent", 'String'>
    readonly eventType: FieldRef<"AgentEvent", 'String'>
    readonly payload: FieldRef<"AgentEvent", 'String'>
    readonly createdAt: FieldRef<"AgentEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentEvent findUnique
   */
  export type AgentEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter, which AgentEvent to fetch.
     */
    where: AgentEventWhereUniqueInput
  }

  /**
   * AgentEvent findUniqueOrThrow
   */
  export type AgentEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter, which AgentEvent to fetch.
     */
    where: AgentEventWhereUniqueInput
  }

  /**
   * AgentEvent findFirst
   */
  export type AgentEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter, which AgentEvent to fetch.
     */
    where?: AgentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentEvents to fetch.
     */
    orderBy?: AgentEventOrderByWithRelationInput | AgentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentEvents.
     */
    cursor?: AgentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentEvents.
     */
    distinct?: AgentEventScalarFieldEnum | AgentEventScalarFieldEnum[]
  }

  /**
   * AgentEvent findFirstOrThrow
   */
  export type AgentEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter, which AgentEvent to fetch.
     */
    where?: AgentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentEvents to fetch.
     */
    orderBy?: AgentEventOrderByWithRelationInput | AgentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentEvents.
     */
    cursor?: AgentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentEvents.
     */
    distinct?: AgentEventScalarFieldEnum | AgentEventScalarFieldEnum[]
  }

  /**
   * AgentEvent findMany
   */
  export type AgentEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter, which AgentEvents to fetch.
     */
    where?: AgentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentEvents to fetch.
     */
    orderBy?: AgentEventOrderByWithRelationInput | AgentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentEvents.
     */
    cursor?: AgentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentEvents.
     */
    skip?: number
    distinct?: AgentEventScalarFieldEnum | AgentEventScalarFieldEnum[]
  }

  /**
   * AgentEvent create
   */
  export type AgentEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentEvent.
     */
    data: XOR<AgentEventCreateInput, AgentEventUncheckedCreateInput>
  }

  /**
   * AgentEvent createMany
   */
  export type AgentEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentEvents.
     */
    data: AgentEventCreateManyInput | AgentEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentEvent createManyAndReturn
   */
  export type AgentEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * The data used to create many AgentEvents.
     */
    data: AgentEventCreateManyInput | AgentEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentEvent update
   */
  export type AgentEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentEvent.
     */
    data: XOR<AgentEventUpdateInput, AgentEventUncheckedUpdateInput>
    /**
     * Choose, which AgentEvent to update.
     */
    where: AgentEventWhereUniqueInput
  }

  /**
   * AgentEvent updateMany
   */
  export type AgentEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentEvents.
     */
    data: XOR<AgentEventUpdateManyMutationInput, AgentEventUncheckedUpdateManyInput>
    /**
     * Filter which AgentEvents to update
     */
    where?: AgentEventWhereInput
    /**
     * Limit how many AgentEvents to update.
     */
    limit?: number
  }

  /**
   * AgentEvent updateManyAndReturn
   */
  export type AgentEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * The data used to update AgentEvents.
     */
    data: XOR<AgentEventUpdateManyMutationInput, AgentEventUncheckedUpdateManyInput>
    /**
     * Filter which AgentEvents to update
     */
    where?: AgentEventWhereInput
    /**
     * Limit how many AgentEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentEvent upsert
   */
  export type AgentEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentEvent to update in case it exists.
     */
    where: AgentEventWhereUniqueInput
    /**
     * In case the AgentEvent found by the `where` argument doesn't exist, create a new AgentEvent with this data.
     */
    create: XOR<AgentEventCreateInput, AgentEventUncheckedCreateInput>
    /**
     * In case the AgentEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentEventUpdateInput, AgentEventUncheckedUpdateInput>
  }

  /**
   * AgentEvent delete
   */
  export type AgentEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
    /**
     * Filter which AgentEvent to delete.
     */
    where: AgentEventWhereUniqueInput
  }

  /**
   * AgentEvent deleteMany
   */
  export type AgentEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentEvents to delete
     */
    where?: AgentEventWhereInput
    /**
     * Limit how many AgentEvents to delete.
     */
    limit?: number
  }

  /**
   * AgentEvent without action
   */
  export type AgentEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentEvent
     */
    select?: AgentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentEvent
     */
    omit?: AgentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const HealthCheckScalarFieldEnum: {
    id: 'id',
    message: 'message',
    createdAt: 'createdAt'
  };

  export type HealthCheckScalarFieldEnum = (typeof HealthCheckScalarFieldEnum)[keyof typeof HealthCheckScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ownerId: 'ownerId',
    ownerUserId: 'ownerUserId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    slug: 'slug',
    templateId: 'templateId',
    orchestratorProjectId: 'orchestratorProjectId',
    status: 'status',
    isActive: 'isActive',
    previewUrl: 'previewUrl',
    logsRef: 'logsRef',
    provisionError: 'provisionError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProvisioningRunScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    status: 'status',
    error: 'error',
    createdAt: 'createdAt',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt'
  };

  export type ProvisioningRunScalarFieldEnum = (typeof ProvisioningRunScalarFieldEnum)[keyof typeof ProvisioningRunScalarFieldEnum]


  export const PublicProjectScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    templateId: 'templateId',
    repoUrl: 'repoUrl',
    status: 'status',
    previewUrl: 'previewUrl',
    containerId: 'containerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PublicProjectScalarFieldEnum = (typeof PublicProjectScalarFieldEnum)[keyof typeof PublicProjectScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    keyHash: 'keyHash',
    keyPrefix: 'keyPrefix',
    name: 'name',
    isActive: 'isActive',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const SandboxScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    language: 'language',
    status: 'status',
    containerId: 'containerId',
    port: 'port',
    timeoutSecs: 'timeoutSecs',
    startedAt: 'startedAt',
    terminatedAt: 'terminatedAt',
    createdAt: 'createdAt'
  };

  export type SandboxScalarFieldEnum = (typeof SandboxScalarFieldEnum)[keyof typeof SandboxScalarFieldEnum]


  export const UsageLogScalarFieldEnum: {
    id: 'id',
    sandboxId: 'sandboxId',
    userId: 'userId',
    durationSecs: 'durationSecs',
    billedAmount: 'billedAmount',
    language: 'language',
    createdAt: 'createdAt'
  };

  export type UsageLogScalarFieldEnum = (typeof UsageLogScalarFieldEnum)[keyof typeof UsageLogScalarFieldEnum]


  export const AgentMemoryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    namespace: 'namespace',
    key: 'key',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentMemoryScalarFieldEnum = (typeof AgentMemoryScalarFieldEnum)[keyof typeof AgentMemoryScalarFieldEnum]


  export const AgentEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    namespace: 'namespace',
    eventType: 'eventType',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type AgentEventScalarFieldEnum = (typeof AgentEventScalarFieldEnum)[keyof typeof AgentEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ProjectStatus[]'
   */
  export type ListEnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus[]'>
    


  /**
   * Reference to a field of type 'ProvisioningRunStatus'
   */
  export type EnumProvisioningRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProvisioningRunStatus'>
    


  /**
   * Reference to a field of type 'ProvisioningRunStatus[]'
   */
  export type ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProvisioningRunStatus[]'>
    


  /**
   * Reference to a field of type 'SandboxLanguage'
   */
  export type EnumSandboxLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SandboxLanguage'>
    


  /**
   * Reference to a field of type 'SandboxLanguage[]'
   */
  export type ListEnumSandboxLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SandboxLanguage[]'>
    


  /**
   * Reference to a field of type 'SandboxStatus'
   */
  export type EnumSandboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SandboxStatus'>
    


  /**
   * Reference to a field of type 'SandboxStatus[]'
   */
  export type ListEnumSandboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SandboxStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type HealthCheckWhereInput = {
    AND?: HealthCheckWhereInput | HealthCheckWhereInput[]
    OR?: HealthCheckWhereInput[]
    NOT?: HealthCheckWhereInput | HealthCheckWhereInput[]
    id?: StringFilter<"HealthCheck"> | string
    message?: StringFilter<"HealthCheck"> | string
    createdAt?: DateTimeFilter<"HealthCheck"> | Date | string
  }

  export type HealthCheckOrderByWithRelationInput = {
    id?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type HealthCheckWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HealthCheckWhereInput | HealthCheckWhereInput[]
    OR?: HealthCheckWhereInput[]
    NOT?: HealthCheckWhereInput | HealthCheckWhereInput[]
    message?: StringFilter<"HealthCheck"> | string
    createdAt?: DateTimeFilter<"HealthCheck"> | Date | string
  }, "id">

  export type HealthCheckOrderByWithAggregationInput = {
    id?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    _count?: HealthCheckCountOrderByAggregateInput
    _max?: HealthCheckMaxOrderByAggregateInput
    _min?: HealthCheckMinOrderByAggregateInput
  }

  export type HealthCheckScalarWhereWithAggregatesInput = {
    AND?: HealthCheckScalarWhereWithAggregatesInput | HealthCheckScalarWhereWithAggregatesInput[]
    OR?: HealthCheckScalarWhereWithAggregatesInput[]
    NOT?: HealthCheckScalarWhereWithAggregatesInput | HealthCheckScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HealthCheck"> | string
    message?: StringWithAggregatesFilter<"HealthCheck"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HealthCheck"> | Date | string
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
  }, "id">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    description?: StringNullableWithAggregatesFilter<"Template"> | string | null
    isActive?: BoolWithAggregatesFilter<"Template"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    ownerId?: StringNullableFilter<"Workspace"> | string | null
    ownerUserId?: StringNullableFilter<"Workspace"> | string | null
    isActive?: BoolFilter<"Workspace"> | boolean
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringFilter<"Workspace"> | string
    ownerId?: StringNullableFilter<"Workspace"> | string | null
    ownerUserId?: StringNullableFilter<"Workspace"> | string | null
    isActive?: BoolFilter<"Workspace"> | boolean
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringWithAggregatesFilter<"Workspace"> | string
    ownerId?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    ownerUserId?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    isActive?: BoolWithAggregatesFilter<"Workspace"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringNullableFilter<"Project"> | string | null
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    isActive?: BoolFilter<"Project"> | boolean
    previewUrl?: StringNullableFilter<"Project"> | string | null
    logsRef?: StringNullableFilter<"Project"> | string | null
    provisionError?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    provisioningRuns?: ProvisioningRunListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    slug?: SortOrderInput | SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrderInput | SortOrder
    status?: SortOrder
    isActive?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    logsRef?: SortOrderInput | SortOrder
    provisionError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    provisioningRuns?: ProvisioningRunOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workspaceId_slug?: ProjectWorkspaceIdSlugCompoundUniqueInput
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringNullableFilter<"Project"> | string | null
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    isActive?: BoolFilter<"Project"> | boolean
    previewUrl?: StringNullableFilter<"Project"> | string | null
    logsRef?: StringNullableFilter<"Project"> | string | null
    provisionError?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    provisioningRuns?: ProvisioningRunListRelationFilter
  }, "id" | "workspaceId_slug">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    slug?: SortOrderInput | SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrderInput | SortOrder
    status?: SortOrder
    isActive?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    logsRef?: SortOrderInput | SortOrder
    provisionError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    workspaceId?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    slug?: StringNullableWithAggregatesFilter<"Project"> | string | null
    templateId?: StringWithAggregatesFilter<"Project"> | string
    orchestratorProjectId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    isActive?: BoolWithAggregatesFilter<"Project"> | boolean
    previewUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    logsRef?: StringNullableWithAggregatesFilter<"Project"> | string | null
    provisionError?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProvisioningRunWhereInput = {
    AND?: ProvisioningRunWhereInput | ProvisioningRunWhereInput[]
    OR?: ProvisioningRunWhereInput[]
    NOT?: ProvisioningRunWhereInput | ProvisioningRunWhereInput[]
    id?: StringFilter<"ProvisioningRun"> | string
    projectId?: StringFilter<"ProvisioningRun"> | string
    status?: EnumProvisioningRunStatusFilter<"ProvisioningRun"> | $Enums.ProvisioningRunStatus
    error?: StringNullableFilter<"ProvisioningRun"> | string | null
    createdAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    startedAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ProvisioningRun"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProvisioningRunOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProvisioningRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProvisioningRunWhereInput | ProvisioningRunWhereInput[]
    OR?: ProvisioningRunWhereInput[]
    NOT?: ProvisioningRunWhereInput | ProvisioningRunWhereInput[]
    projectId?: StringFilter<"ProvisioningRun"> | string
    status?: EnumProvisioningRunStatusFilter<"ProvisioningRun"> | $Enums.ProvisioningRunStatus
    error?: StringNullableFilter<"ProvisioningRun"> | string | null
    createdAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    startedAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ProvisioningRun"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type ProvisioningRunOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    _count?: ProvisioningRunCountOrderByAggregateInput
    _max?: ProvisioningRunMaxOrderByAggregateInput
    _min?: ProvisioningRunMinOrderByAggregateInput
  }

  export type ProvisioningRunScalarWhereWithAggregatesInput = {
    AND?: ProvisioningRunScalarWhereWithAggregatesInput | ProvisioningRunScalarWhereWithAggregatesInput[]
    OR?: ProvisioningRunScalarWhereWithAggregatesInput[]
    NOT?: ProvisioningRunScalarWhereWithAggregatesInput | ProvisioningRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProvisioningRun"> | string
    projectId?: StringWithAggregatesFilter<"ProvisioningRun"> | string
    status?: EnumProvisioningRunStatusWithAggregatesFilter<"ProvisioningRun"> | $Enums.ProvisioningRunStatus
    error?: StringNullableWithAggregatesFilter<"ProvisioningRun"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProvisioningRun"> | Date | string
    startedAt?: DateTimeWithAggregatesFilter<"ProvisioningRun"> | Date | string
    finishedAt?: DateTimeNullableWithAggregatesFilter<"ProvisioningRun"> | Date | string | null
  }

  export type PublicProjectWhereInput = {
    AND?: PublicProjectWhereInput | PublicProjectWhereInput[]
    OR?: PublicProjectWhereInput[]
    NOT?: PublicProjectWhereInput | PublicProjectWhereInput[]
    id?: StringFilter<"PublicProject"> | string
    ownerId?: StringFilter<"PublicProject"> | string
    templateId?: StringFilter<"PublicProject"> | string
    repoUrl?: StringNullableFilter<"PublicProject"> | string | null
    status?: StringFilter<"PublicProject"> | string
    previewUrl?: StringNullableFilter<"PublicProject"> | string | null
    containerId?: StringNullableFilter<"PublicProject"> | string | null
    createdAt?: DateTimeFilter<"PublicProject"> | Date | string
    updatedAt?: DateTimeFilter<"PublicProject"> | Date | string
  }

  export type PublicProjectOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    templateId?: SortOrder
    repoUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PublicProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PublicProjectWhereInput | PublicProjectWhereInput[]
    OR?: PublicProjectWhereInput[]
    NOT?: PublicProjectWhereInput | PublicProjectWhereInput[]
    ownerId?: StringFilter<"PublicProject"> | string
    templateId?: StringFilter<"PublicProject"> | string
    repoUrl?: StringNullableFilter<"PublicProject"> | string | null
    status?: StringFilter<"PublicProject"> | string
    previewUrl?: StringNullableFilter<"PublicProject"> | string | null
    containerId?: StringNullableFilter<"PublicProject"> | string | null
    createdAt?: DateTimeFilter<"PublicProject"> | Date | string
    updatedAt?: DateTimeFilter<"PublicProject"> | Date | string
  }, "id">

  export type PublicProjectOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    templateId?: SortOrder
    repoUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    previewUrl?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PublicProjectCountOrderByAggregateInput
    _max?: PublicProjectMaxOrderByAggregateInput
    _min?: PublicProjectMinOrderByAggregateInput
  }

  export type PublicProjectScalarWhereWithAggregatesInput = {
    AND?: PublicProjectScalarWhereWithAggregatesInput | PublicProjectScalarWhereWithAggregatesInput[]
    OR?: PublicProjectScalarWhereWithAggregatesInput[]
    NOT?: PublicProjectScalarWhereWithAggregatesInput | PublicProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PublicProject"> | string
    ownerId?: StringWithAggregatesFilter<"PublicProject"> | string
    templateId?: StringWithAggregatesFilter<"PublicProject"> | string
    repoUrl?: StringNullableWithAggregatesFilter<"PublicProject"> | string | null
    status?: StringWithAggregatesFilter<"PublicProject"> | string
    previewUrl?: StringNullableWithAggregatesFilter<"PublicProject"> | string | null
    containerId?: StringNullableWithAggregatesFilter<"PublicProject"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PublicProject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PublicProject"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    apiKeys?: ApiKeyListRelationFilter
    sandboxes?: SandboxListRelationFilter
    agentMemories?: AgentMemoryListRelationFilter
    agentEvents?: AgentEventListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    sandboxes?: SandboxOrderByRelationAggregateInput
    agentMemories?: AgentMemoryOrderByRelationAggregateInput
    agentEvents?: AgentEventOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    apiKeys?: ApiKeyListRelationFilter
    sandboxes?: SandboxListRelationFilter
    agentMemories?: AgentMemoryListRelationFilter
    agentEvents?: AgentEventListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    keyPrefix?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    keyHash?: SortOrder
    keyPrefix?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    keyHash?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    userId?: StringFilter<"ApiKey"> | string
    keyPrefix?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "keyHash">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    keyHash?: SortOrder
    keyPrefix?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiKey"> | string
    userId?: StringWithAggregatesFilter<"ApiKey"> | string
    keyHash?: StringWithAggregatesFilter<"ApiKey"> | string
    keyPrefix?: StringWithAggregatesFilter<"ApiKey"> | string
    name?: StringWithAggregatesFilter<"ApiKey"> | string
    isActive?: BoolWithAggregatesFilter<"ApiKey"> | boolean
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
  }

  export type SandboxWhereInput = {
    AND?: SandboxWhereInput | SandboxWhereInput[]
    OR?: SandboxWhereInput[]
    NOT?: SandboxWhereInput | SandboxWhereInput[]
    id?: StringFilter<"Sandbox"> | string
    userId?: StringFilter<"Sandbox"> | string
    language?: EnumSandboxLanguageFilter<"Sandbox"> | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFilter<"Sandbox"> | $Enums.SandboxStatus
    containerId?: StringNullableFilter<"Sandbox"> | string | null
    port?: IntNullableFilter<"Sandbox"> | number | null
    timeoutSecs?: IntFilter<"Sandbox"> | number
    startedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    terminatedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    createdAt?: DateTimeFilter<"Sandbox"> | Date | string
    usageLogs?: UsageLogListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SandboxOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    language?: SortOrder
    status?: SortOrder
    containerId?: SortOrderInput | SortOrder
    port?: SortOrderInput | SortOrder
    timeoutSecs?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    terminatedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    usageLogs?: UsageLogOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type SandboxWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SandboxWhereInput | SandboxWhereInput[]
    OR?: SandboxWhereInput[]
    NOT?: SandboxWhereInput | SandboxWhereInput[]
    userId?: StringFilter<"Sandbox"> | string
    language?: EnumSandboxLanguageFilter<"Sandbox"> | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFilter<"Sandbox"> | $Enums.SandboxStatus
    containerId?: StringNullableFilter<"Sandbox"> | string | null
    port?: IntNullableFilter<"Sandbox"> | number | null
    timeoutSecs?: IntFilter<"Sandbox"> | number
    startedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    terminatedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    createdAt?: DateTimeFilter<"Sandbox"> | Date | string
    usageLogs?: UsageLogListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SandboxOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    language?: SortOrder
    status?: SortOrder
    containerId?: SortOrderInput | SortOrder
    port?: SortOrderInput | SortOrder
    timeoutSecs?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    terminatedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SandboxCountOrderByAggregateInput
    _avg?: SandboxAvgOrderByAggregateInput
    _max?: SandboxMaxOrderByAggregateInput
    _min?: SandboxMinOrderByAggregateInput
    _sum?: SandboxSumOrderByAggregateInput
  }

  export type SandboxScalarWhereWithAggregatesInput = {
    AND?: SandboxScalarWhereWithAggregatesInput | SandboxScalarWhereWithAggregatesInput[]
    OR?: SandboxScalarWhereWithAggregatesInput[]
    NOT?: SandboxScalarWhereWithAggregatesInput | SandboxScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sandbox"> | string
    userId?: StringWithAggregatesFilter<"Sandbox"> | string
    language?: EnumSandboxLanguageWithAggregatesFilter<"Sandbox"> | $Enums.SandboxLanguage
    status?: EnumSandboxStatusWithAggregatesFilter<"Sandbox"> | $Enums.SandboxStatus
    containerId?: StringNullableWithAggregatesFilter<"Sandbox"> | string | null
    port?: IntNullableWithAggregatesFilter<"Sandbox"> | number | null
    timeoutSecs?: IntWithAggregatesFilter<"Sandbox"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"Sandbox"> | Date | string | null
    terminatedAt?: DateTimeNullableWithAggregatesFilter<"Sandbox"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Sandbox"> | Date | string
  }

  export type UsageLogWhereInput = {
    AND?: UsageLogWhereInput | UsageLogWhereInput[]
    OR?: UsageLogWhereInput[]
    NOT?: UsageLogWhereInput | UsageLogWhereInput[]
    id?: StringFilter<"UsageLog"> | string
    sandboxId?: StringFilter<"UsageLog"> | string
    userId?: StringFilter<"UsageLog"> | string
    durationSecs?: IntFilter<"UsageLog"> | number
    billedAmount?: FloatFilter<"UsageLog"> | number
    language?: StringFilter<"UsageLog"> | string
    createdAt?: DateTimeFilter<"UsageLog"> | Date | string
    sandbox?: XOR<SandboxScalarRelationFilter, SandboxWhereInput>
  }

  export type UsageLogOrderByWithRelationInput = {
    id?: SortOrder
    sandboxId?: SortOrder
    userId?: SortOrder
    durationSecs?: SortOrder
    billedAmount?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    sandbox?: SandboxOrderByWithRelationInput
  }

  export type UsageLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsageLogWhereInput | UsageLogWhereInput[]
    OR?: UsageLogWhereInput[]
    NOT?: UsageLogWhereInput | UsageLogWhereInput[]
    sandboxId?: StringFilter<"UsageLog"> | string
    userId?: StringFilter<"UsageLog"> | string
    durationSecs?: IntFilter<"UsageLog"> | number
    billedAmount?: FloatFilter<"UsageLog"> | number
    language?: StringFilter<"UsageLog"> | string
    createdAt?: DateTimeFilter<"UsageLog"> | Date | string
    sandbox?: XOR<SandboxScalarRelationFilter, SandboxWhereInput>
  }, "id">

  export type UsageLogOrderByWithAggregationInput = {
    id?: SortOrder
    sandboxId?: SortOrder
    userId?: SortOrder
    durationSecs?: SortOrder
    billedAmount?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    _count?: UsageLogCountOrderByAggregateInput
    _avg?: UsageLogAvgOrderByAggregateInput
    _max?: UsageLogMaxOrderByAggregateInput
    _min?: UsageLogMinOrderByAggregateInput
    _sum?: UsageLogSumOrderByAggregateInput
  }

  export type UsageLogScalarWhereWithAggregatesInput = {
    AND?: UsageLogScalarWhereWithAggregatesInput | UsageLogScalarWhereWithAggregatesInput[]
    OR?: UsageLogScalarWhereWithAggregatesInput[]
    NOT?: UsageLogScalarWhereWithAggregatesInput | UsageLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageLog"> | string
    sandboxId?: StringWithAggregatesFilter<"UsageLog"> | string
    userId?: StringWithAggregatesFilter<"UsageLog"> | string
    durationSecs?: IntWithAggregatesFilter<"UsageLog"> | number
    billedAmount?: FloatWithAggregatesFilter<"UsageLog"> | number
    language?: StringWithAggregatesFilter<"UsageLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UsageLog"> | Date | string
  }

  export type AgentMemoryWhereInput = {
    AND?: AgentMemoryWhereInput | AgentMemoryWhereInput[]
    OR?: AgentMemoryWhereInput[]
    NOT?: AgentMemoryWhereInput | AgentMemoryWhereInput[]
    id?: StringFilter<"AgentMemory"> | string
    userId?: StringFilter<"AgentMemory"> | string
    namespace?: StringFilter<"AgentMemory"> | string
    key?: StringFilter<"AgentMemory"> | string
    value?: StringFilter<"AgentMemory"> | string
    expiresAt?: DateTimeNullableFilter<"AgentMemory"> | Date | string | null
    createdAt?: DateTimeFilter<"AgentMemory"> | Date | string
    updatedAt?: DateTimeFilter<"AgentMemory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AgentMemoryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    key?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AgentMemoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_namespace_key?: AgentMemoryUserIdNamespaceKeyCompoundUniqueInput
    AND?: AgentMemoryWhereInput | AgentMemoryWhereInput[]
    OR?: AgentMemoryWhereInput[]
    NOT?: AgentMemoryWhereInput | AgentMemoryWhereInput[]
    userId?: StringFilter<"AgentMemory"> | string
    namespace?: StringFilter<"AgentMemory"> | string
    key?: StringFilter<"AgentMemory"> | string
    value?: StringFilter<"AgentMemory"> | string
    expiresAt?: DateTimeNullableFilter<"AgentMemory"> | Date | string | null
    createdAt?: DateTimeFilter<"AgentMemory"> | Date | string
    updatedAt?: DateTimeFilter<"AgentMemory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_namespace_key">

  export type AgentMemoryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    key?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentMemoryCountOrderByAggregateInput
    _max?: AgentMemoryMaxOrderByAggregateInput
    _min?: AgentMemoryMinOrderByAggregateInput
  }

  export type AgentMemoryScalarWhereWithAggregatesInput = {
    AND?: AgentMemoryScalarWhereWithAggregatesInput | AgentMemoryScalarWhereWithAggregatesInput[]
    OR?: AgentMemoryScalarWhereWithAggregatesInput[]
    NOT?: AgentMemoryScalarWhereWithAggregatesInput | AgentMemoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentMemory"> | string
    userId?: StringWithAggregatesFilter<"AgentMemory"> | string
    namespace?: StringWithAggregatesFilter<"AgentMemory"> | string
    key?: StringWithAggregatesFilter<"AgentMemory"> | string
    value?: StringWithAggregatesFilter<"AgentMemory"> | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"AgentMemory"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AgentMemory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgentMemory"> | Date | string
  }

  export type AgentEventWhereInput = {
    AND?: AgentEventWhereInput | AgentEventWhereInput[]
    OR?: AgentEventWhereInput[]
    NOT?: AgentEventWhereInput | AgentEventWhereInput[]
    id?: StringFilter<"AgentEvent"> | string
    userId?: StringFilter<"AgentEvent"> | string
    namespace?: StringFilter<"AgentEvent"> | string
    eventType?: StringFilter<"AgentEvent"> | string
    payload?: StringFilter<"AgentEvent"> | string
    createdAt?: DateTimeFilter<"AgentEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AgentEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AgentEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentEventWhereInput | AgentEventWhereInput[]
    OR?: AgentEventWhereInput[]
    NOT?: AgentEventWhereInput | AgentEventWhereInput[]
    userId?: StringFilter<"AgentEvent"> | string
    namespace?: StringFilter<"AgentEvent"> | string
    eventType?: StringFilter<"AgentEvent"> | string
    payload?: StringFilter<"AgentEvent"> | string
    createdAt?: DateTimeFilter<"AgentEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AgentEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    _count?: AgentEventCountOrderByAggregateInput
    _max?: AgentEventMaxOrderByAggregateInput
    _min?: AgentEventMinOrderByAggregateInput
  }

  export type AgentEventScalarWhereWithAggregatesInput = {
    AND?: AgentEventScalarWhereWithAggregatesInput | AgentEventScalarWhereWithAggregatesInput[]
    OR?: AgentEventScalarWhereWithAggregatesInput[]
    NOT?: AgentEventScalarWhereWithAggregatesInput | AgentEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentEvent"> | string
    userId?: StringWithAggregatesFilter<"AgentEvent"> | string
    namespace?: StringWithAggregatesFilter<"AgentEvent"> | string
    eventType?: StringWithAggregatesFilter<"AgentEvent"> | string
    payload?: StringWithAggregatesFilter<"AgentEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AgentEvent"> | Date | string
  }

  export type HealthCheckCreateInput = {
    id?: string
    message: string
    createdAt?: Date | string
  }

  export type HealthCheckUncheckedCreateInput = {
    id?: string
    message: string
    createdAt?: Date | string
  }

  export type HealthCheckUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HealthCheckUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HealthCheckCreateManyInput = {
    id?: string
    message: string
    createdAt?: Date | string
  }

  export type HealthCheckUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HealthCheckUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateInput = {
    id: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateManyInput = {
    id: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceCreateInput = {
    id?: string
    name: string
    ownerId?: string | null
    ownerUserId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name: string
    ownerId?: string | null
    ownerUserId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name: string
    ownerId?: string | null
    ownerUserId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    provisioningRuns?: ProvisioningRunCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    workspaceId: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    provisioningRuns?: ProvisioningRunUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    provisioningRuns?: ProvisioningRunUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provisioningRuns?: ProvisioningRunUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    workspaceId: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvisioningRunCreateInput = {
    id?: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutProvisioningRunsInput
  }

  export type ProvisioningRunUncheckedCreateInput = {
    id?: string
    projectId: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ProvisioningRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutProvisioningRunsNestedInput
  }

  export type ProvisioningRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProvisioningRunCreateManyInput = {
    id?: string
    projectId: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ProvisioningRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProvisioningRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PublicProjectCreateInput = {
    id?: string
    ownerId: string
    templateId: string
    repoUrl?: string | null
    status: string
    previewUrl?: string | null
    containerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PublicProjectUncheckedCreateInput = {
    id?: string
    ownerId: string
    templateId: string
    repoUrl?: string | null
    status: string
    previewUrl?: string | null
    containerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PublicProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PublicProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PublicProjectCreateManyInput = {
    id?: string
    ownerId: string
    templateId: string
    repoUrl?: string | null
    status: string
    previewUrl?: string | null
    containerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PublicProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PublicProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    sandboxes?: SandboxCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    sandboxes?: SandboxUncheckedCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryUncheckedCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUncheckedUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUncheckedUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    id?: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutApiKeysInput
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    userId: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    userId: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SandboxCreateInput = {
    id?: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
    usageLogs?: UsageLogCreateNestedManyWithoutSandboxInput
    user: UserCreateNestedOneWithoutSandboxesInput
  }

  export type SandboxUncheckedCreateInput = {
    id?: string
    userId: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
    usageLogs?: UsageLogUncheckedCreateNestedManyWithoutSandboxInput
  }

  export type SandboxUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageLogs?: UsageLogUpdateManyWithoutSandboxNestedInput
    user?: UserUpdateOneRequiredWithoutSandboxesNestedInput
  }

  export type SandboxUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageLogs?: UsageLogUncheckedUpdateManyWithoutSandboxNestedInput
  }

  export type SandboxCreateManyInput = {
    id?: string
    userId: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SandboxUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SandboxUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogCreateInput = {
    id?: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
    sandbox: SandboxCreateNestedOneWithoutUsageLogsInput
  }

  export type UsageLogUncheckedCreateInput = {
    id?: string
    sandboxId: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
  }

  export type UsageLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sandbox?: SandboxUpdateOneRequiredWithoutUsageLogsNestedInput
  }

  export type UsageLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sandboxId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogCreateManyInput = {
    id?: string
    sandboxId: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
  }

  export type UsageLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sandboxId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryCreateInput = {
    id?: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAgentMemoriesInput
  }

  export type AgentMemoryUncheckedCreateInput = {
    id?: string
    userId: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentMemoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAgentMemoriesNestedInput
  }

  export type AgentMemoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryCreateManyInput = {
    id?: string
    userId: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentMemoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventCreateInput = {
    id?: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAgentEventsInput
  }

  export type AgentEventUncheckedCreateInput = {
    id?: string
    userId: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
  }

  export type AgentEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAgentEventsNestedInput
  }

  export type AgentEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventCreateManyInput = {
    id?: string
    userId: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
  }

  export type AgentEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type HealthCheckCountOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type HealthCheckMaxOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type HealthCheckMinOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    ownerUserId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    ownerUserId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    ownerUserId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type WorkspaceScalarRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type ProvisioningRunListRelationFilter = {
    every?: ProvisioningRunWhereInput
    some?: ProvisioningRunWhereInput
    none?: ProvisioningRunWhereInput
  }

  export type ProvisioningRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectWorkspaceIdSlugCompoundUniqueInput = {
    workspaceId: string
    slug: string
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    previewUrl?: SortOrder
    logsRef?: SortOrder
    provisionError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    previewUrl?: SortOrder
    logsRef?: SortOrder
    provisionError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    previewUrl?: SortOrder
    logsRef?: SortOrder
    provisionError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type EnumProvisioningRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProvisioningRunStatus | EnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProvisioningRunStatusFilter<$PrismaModel> | $Enums.ProvisioningRunStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProvisioningRunCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type ProvisioningRunMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type ProvisioningRunMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type EnumProvisioningRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProvisioningRunStatus | EnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProvisioningRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProvisioningRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProvisioningRunStatusFilter<$PrismaModel>
    _max?: NestedEnumProvisioningRunStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PublicProjectCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    templateId?: SortOrder
    repoUrl?: SortOrder
    status?: SortOrder
    previewUrl?: SortOrder
    containerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PublicProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    templateId?: SortOrder
    repoUrl?: SortOrder
    status?: SortOrder
    previewUrl?: SortOrder
    containerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PublicProjectMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    templateId?: SortOrder
    repoUrl?: SortOrder
    status?: SortOrder
    previewUrl?: SortOrder
    containerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiKeyListRelationFilter = {
    every?: ApiKeyWhereInput
    some?: ApiKeyWhereInput
    none?: ApiKeyWhereInput
  }

  export type SandboxListRelationFilter = {
    every?: SandboxWhereInput
    some?: SandboxWhereInput
    none?: SandboxWhereInput
  }

  export type AgentMemoryListRelationFilter = {
    every?: AgentMemoryWhereInput
    some?: AgentMemoryWhereInput
    none?: AgentMemoryWhereInput
  }

  export type AgentEventListRelationFilter = {
    every?: AgentEventWhereInput
    some?: AgentEventWhereInput
    none?: AgentEventWhereInput
  }

  export type ApiKeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SandboxOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentMemoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keyHash?: SortOrder
    keyPrefix?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keyHash?: SortOrder
    keyPrefix?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keyHash?: SortOrder
    keyPrefix?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSandboxLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxLanguage | EnumSandboxLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxLanguageFilter<$PrismaModel> | $Enums.SandboxLanguage
  }

  export type EnumSandboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxStatus | EnumSandboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxStatusFilter<$PrismaModel> | $Enums.SandboxStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UsageLogListRelationFilter = {
    every?: UsageLogWhereInput
    some?: UsageLogWhereInput
    none?: UsageLogWhereInput
  }

  export type UsageLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SandboxCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    language?: SortOrder
    status?: SortOrder
    containerId?: SortOrder
    port?: SortOrder
    timeoutSecs?: SortOrder
    startedAt?: SortOrder
    terminatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SandboxAvgOrderByAggregateInput = {
    port?: SortOrder
    timeoutSecs?: SortOrder
  }

  export type SandboxMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    language?: SortOrder
    status?: SortOrder
    containerId?: SortOrder
    port?: SortOrder
    timeoutSecs?: SortOrder
    startedAt?: SortOrder
    terminatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SandboxMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    language?: SortOrder
    status?: SortOrder
    containerId?: SortOrder
    port?: SortOrder
    timeoutSecs?: SortOrder
    startedAt?: SortOrder
    terminatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SandboxSumOrderByAggregateInput = {
    port?: SortOrder
    timeoutSecs?: SortOrder
  }

  export type EnumSandboxLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxLanguage | EnumSandboxLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxLanguageWithAggregatesFilter<$PrismaModel> | $Enums.SandboxLanguage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSandboxLanguageFilter<$PrismaModel>
    _max?: NestedEnumSandboxLanguageFilter<$PrismaModel>
  }

  export type EnumSandboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxStatus | EnumSandboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.SandboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSandboxStatusFilter<$PrismaModel>
    _max?: NestedEnumSandboxStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type SandboxScalarRelationFilter = {
    is?: SandboxWhereInput
    isNot?: SandboxWhereInput
  }

  export type UsageLogCountOrderByAggregateInput = {
    id?: SortOrder
    sandboxId?: SortOrder
    userId?: SortOrder
    durationSecs?: SortOrder
    billedAmount?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageLogAvgOrderByAggregateInput = {
    durationSecs?: SortOrder
    billedAmount?: SortOrder
  }

  export type UsageLogMaxOrderByAggregateInput = {
    id?: SortOrder
    sandboxId?: SortOrder
    userId?: SortOrder
    durationSecs?: SortOrder
    billedAmount?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageLogMinOrderByAggregateInput = {
    id?: SortOrder
    sandboxId?: SortOrder
    userId?: SortOrder
    durationSecs?: SortOrder
    billedAmount?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageLogSumOrderByAggregateInput = {
    durationSecs?: SortOrder
    billedAmount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type AgentMemoryUserIdNamespaceKeyCompoundUniqueInput = {
    userId: string
    namespace: string
    key: string
  }

  export type AgentMemoryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    key?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentMemoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    key?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentMemoryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    key?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    namespace?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProjectCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutProjectsInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type ProvisioningRunCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput> | ProvisioningRunCreateWithoutProjectInput[] | ProvisioningRunUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProvisioningRunCreateOrConnectWithoutProjectInput | ProvisioningRunCreateOrConnectWithoutProjectInput[]
    createMany?: ProvisioningRunCreateManyProjectInputEnvelope
    connect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
  }

  export type ProvisioningRunUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput> | ProvisioningRunCreateWithoutProjectInput[] | ProvisioningRunUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProvisioningRunCreateOrConnectWithoutProjectInput | ProvisioningRunCreateOrConnectWithoutProjectInput[]
    createMany?: ProvisioningRunCreateManyProjectInputEnvelope
    connect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type WorkspaceUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    upsert?: WorkspaceUpsertWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutProjectsInput, WorkspaceUpdateWithoutProjectsInput>, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type ProvisioningRunUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput> | ProvisioningRunCreateWithoutProjectInput[] | ProvisioningRunUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProvisioningRunCreateOrConnectWithoutProjectInput | ProvisioningRunCreateOrConnectWithoutProjectInput[]
    upsert?: ProvisioningRunUpsertWithWhereUniqueWithoutProjectInput | ProvisioningRunUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProvisioningRunCreateManyProjectInputEnvelope
    set?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    disconnect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    delete?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    connect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    update?: ProvisioningRunUpdateWithWhereUniqueWithoutProjectInput | ProvisioningRunUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProvisioningRunUpdateManyWithWhereWithoutProjectInput | ProvisioningRunUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProvisioningRunScalarWhereInput | ProvisioningRunScalarWhereInput[]
  }

  export type ProvisioningRunUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput> | ProvisioningRunCreateWithoutProjectInput[] | ProvisioningRunUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProvisioningRunCreateOrConnectWithoutProjectInput | ProvisioningRunCreateOrConnectWithoutProjectInput[]
    upsert?: ProvisioningRunUpsertWithWhereUniqueWithoutProjectInput | ProvisioningRunUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProvisioningRunCreateManyProjectInputEnvelope
    set?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    disconnect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    delete?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    connect?: ProvisioningRunWhereUniqueInput | ProvisioningRunWhereUniqueInput[]
    update?: ProvisioningRunUpdateWithWhereUniqueWithoutProjectInput | ProvisioningRunUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProvisioningRunUpdateManyWithWhereWithoutProjectInput | ProvisioningRunUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProvisioningRunScalarWhereInput | ProvisioningRunScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutProvisioningRunsInput = {
    create?: XOR<ProjectCreateWithoutProvisioningRunsInput, ProjectUncheckedCreateWithoutProvisioningRunsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutProvisioningRunsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumProvisioningRunStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProvisioningRunStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProjectUpdateOneRequiredWithoutProvisioningRunsNestedInput = {
    create?: XOR<ProjectCreateWithoutProvisioningRunsInput, ProjectUncheckedCreateWithoutProvisioningRunsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutProvisioningRunsInput
    upsert?: ProjectUpsertWithoutProvisioningRunsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutProvisioningRunsInput, ProjectUpdateWithoutProvisioningRunsInput>, ProjectUncheckedUpdateWithoutProvisioningRunsInput>
  }

  export type ApiKeyCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type SandboxCreateNestedManyWithoutUserInput = {
    create?: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput> | SandboxCreateWithoutUserInput[] | SandboxUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SandboxCreateOrConnectWithoutUserInput | SandboxCreateOrConnectWithoutUserInput[]
    createMany?: SandboxCreateManyUserInputEnvelope
    connect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
  }

  export type AgentMemoryCreateNestedManyWithoutUserInput = {
    create?: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput> | AgentMemoryCreateWithoutUserInput[] | AgentMemoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentMemoryCreateOrConnectWithoutUserInput | AgentMemoryCreateOrConnectWithoutUserInput[]
    createMany?: AgentMemoryCreateManyUserInputEnvelope
    connect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
  }

  export type AgentEventCreateNestedManyWithoutUserInput = {
    create?: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput> | AgentEventCreateWithoutUserInput[] | AgentEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentEventCreateOrConnectWithoutUserInput | AgentEventCreateOrConnectWithoutUserInput[]
    createMany?: AgentEventCreateManyUserInputEnvelope
    connect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type SandboxUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput> | SandboxCreateWithoutUserInput[] | SandboxUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SandboxCreateOrConnectWithoutUserInput | SandboxCreateOrConnectWithoutUserInput[]
    createMany?: SandboxCreateManyUserInputEnvelope
    connect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
  }

  export type AgentMemoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput> | AgentMemoryCreateWithoutUserInput[] | AgentMemoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentMemoryCreateOrConnectWithoutUserInput | AgentMemoryCreateOrConnectWithoutUserInput[]
    createMany?: AgentMemoryCreateManyUserInputEnvelope
    connect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
  }

  export type AgentEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput> | AgentEventCreateWithoutUserInput[] | AgentEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentEventCreateOrConnectWithoutUserInput | AgentEventCreateOrConnectWithoutUserInput[]
    createMany?: AgentEventCreateManyUserInputEnvelope
    connect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
  }

  export type ApiKeyUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type SandboxUpdateManyWithoutUserNestedInput = {
    create?: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput> | SandboxCreateWithoutUserInput[] | SandboxUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SandboxCreateOrConnectWithoutUserInput | SandboxCreateOrConnectWithoutUserInput[]
    upsert?: SandboxUpsertWithWhereUniqueWithoutUserInput | SandboxUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SandboxCreateManyUserInputEnvelope
    set?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    disconnect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    delete?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    connect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    update?: SandboxUpdateWithWhereUniqueWithoutUserInput | SandboxUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SandboxUpdateManyWithWhereWithoutUserInput | SandboxUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SandboxScalarWhereInput | SandboxScalarWhereInput[]
  }

  export type AgentMemoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput> | AgentMemoryCreateWithoutUserInput[] | AgentMemoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentMemoryCreateOrConnectWithoutUserInput | AgentMemoryCreateOrConnectWithoutUserInput[]
    upsert?: AgentMemoryUpsertWithWhereUniqueWithoutUserInput | AgentMemoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AgentMemoryCreateManyUserInputEnvelope
    set?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    disconnect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    delete?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    connect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    update?: AgentMemoryUpdateWithWhereUniqueWithoutUserInput | AgentMemoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AgentMemoryUpdateManyWithWhereWithoutUserInput | AgentMemoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AgentMemoryScalarWhereInput | AgentMemoryScalarWhereInput[]
  }

  export type AgentEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput> | AgentEventCreateWithoutUserInput[] | AgentEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentEventCreateOrConnectWithoutUserInput | AgentEventCreateOrConnectWithoutUserInput[]
    upsert?: AgentEventUpsertWithWhereUniqueWithoutUserInput | AgentEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AgentEventCreateManyUserInputEnvelope
    set?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    disconnect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    delete?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    connect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    update?: AgentEventUpdateWithWhereUniqueWithoutUserInput | AgentEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AgentEventUpdateManyWithWhereWithoutUserInput | AgentEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AgentEventScalarWhereInput | AgentEventScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type SandboxUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput> | SandboxCreateWithoutUserInput[] | SandboxUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SandboxCreateOrConnectWithoutUserInput | SandboxCreateOrConnectWithoutUserInput[]
    upsert?: SandboxUpsertWithWhereUniqueWithoutUserInput | SandboxUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SandboxCreateManyUserInputEnvelope
    set?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    disconnect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    delete?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    connect?: SandboxWhereUniqueInput | SandboxWhereUniqueInput[]
    update?: SandboxUpdateWithWhereUniqueWithoutUserInput | SandboxUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SandboxUpdateManyWithWhereWithoutUserInput | SandboxUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SandboxScalarWhereInput | SandboxScalarWhereInput[]
  }

  export type AgentMemoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput> | AgentMemoryCreateWithoutUserInput[] | AgentMemoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentMemoryCreateOrConnectWithoutUserInput | AgentMemoryCreateOrConnectWithoutUserInput[]
    upsert?: AgentMemoryUpsertWithWhereUniqueWithoutUserInput | AgentMemoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AgentMemoryCreateManyUserInputEnvelope
    set?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    disconnect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    delete?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    connect?: AgentMemoryWhereUniqueInput | AgentMemoryWhereUniqueInput[]
    update?: AgentMemoryUpdateWithWhereUniqueWithoutUserInput | AgentMemoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AgentMemoryUpdateManyWithWhereWithoutUserInput | AgentMemoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AgentMemoryScalarWhereInput | AgentMemoryScalarWhereInput[]
  }

  export type AgentEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput> | AgentEventCreateWithoutUserInput[] | AgentEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AgentEventCreateOrConnectWithoutUserInput | AgentEventCreateOrConnectWithoutUserInput[]
    upsert?: AgentEventUpsertWithWhereUniqueWithoutUserInput | AgentEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AgentEventCreateManyUserInputEnvelope
    set?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    disconnect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    delete?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    connect?: AgentEventWhereUniqueInput | AgentEventWhereUniqueInput[]
    update?: AgentEventUpdateWithWhereUniqueWithoutUserInput | AgentEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AgentEventUpdateManyWithWhereWithoutUserInput | AgentEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AgentEventScalarWhereInput | AgentEventScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    upsert?: UserUpsertWithoutApiKeysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApiKeysInput, UserUpdateWithoutApiKeysInput>, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type UsageLogCreateNestedManyWithoutSandboxInput = {
    create?: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput> | UsageLogCreateWithoutSandboxInput[] | UsageLogUncheckedCreateWithoutSandboxInput[]
    connectOrCreate?: UsageLogCreateOrConnectWithoutSandboxInput | UsageLogCreateOrConnectWithoutSandboxInput[]
    createMany?: UsageLogCreateManySandboxInputEnvelope
    connect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutSandboxesInput = {
    create?: XOR<UserCreateWithoutSandboxesInput, UserUncheckedCreateWithoutSandboxesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSandboxesInput
    connect?: UserWhereUniqueInput
  }

  export type UsageLogUncheckedCreateNestedManyWithoutSandboxInput = {
    create?: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput> | UsageLogCreateWithoutSandboxInput[] | UsageLogUncheckedCreateWithoutSandboxInput[]
    connectOrCreate?: UsageLogCreateOrConnectWithoutSandboxInput | UsageLogCreateOrConnectWithoutSandboxInput[]
    createMany?: UsageLogCreateManySandboxInputEnvelope
    connect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
  }

  export type EnumSandboxLanguageFieldUpdateOperationsInput = {
    set?: $Enums.SandboxLanguage
  }

  export type EnumSandboxStatusFieldUpdateOperationsInput = {
    set?: $Enums.SandboxStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsageLogUpdateManyWithoutSandboxNestedInput = {
    create?: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput> | UsageLogCreateWithoutSandboxInput[] | UsageLogUncheckedCreateWithoutSandboxInput[]
    connectOrCreate?: UsageLogCreateOrConnectWithoutSandboxInput | UsageLogCreateOrConnectWithoutSandboxInput[]
    upsert?: UsageLogUpsertWithWhereUniqueWithoutSandboxInput | UsageLogUpsertWithWhereUniqueWithoutSandboxInput[]
    createMany?: UsageLogCreateManySandboxInputEnvelope
    set?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    disconnect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    delete?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    connect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    update?: UsageLogUpdateWithWhereUniqueWithoutSandboxInput | UsageLogUpdateWithWhereUniqueWithoutSandboxInput[]
    updateMany?: UsageLogUpdateManyWithWhereWithoutSandboxInput | UsageLogUpdateManyWithWhereWithoutSandboxInput[]
    deleteMany?: UsageLogScalarWhereInput | UsageLogScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutSandboxesNestedInput = {
    create?: XOR<UserCreateWithoutSandboxesInput, UserUncheckedCreateWithoutSandboxesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSandboxesInput
    upsert?: UserUpsertWithoutSandboxesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSandboxesInput, UserUpdateWithoutSandboxesInput>, UserUncheckedUpdateWithoutSandboxesInput>
  }

  export type UsageLogUncheckedUpdateManyWithoutSandboxNestedInput = {
    create?: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput> | UsageLogCreateWithoutSandboxInput[] | UsageLogUncheckedCreateWithoutSandboxInput[]
    connectOrCreate?: UsageLogCreateOrConnectWithoutSandboxInput | UsageLogCreateOrConnectWithoutSandboxInput[]
    upsert?: UsageLogUpsertWithWhereUniqueWithoutSandboxInput | UsageLogUpsertWithWhereUniqueWithoutSandboxInput[]
    createMany?: UsageLogCreateManySandboxInputEnvelope
    set?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    disconnect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    delete?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    connect?: UsageLogWhereUniqueInput | UsageLogWhereUniqueInput[]
    update?: UsageLogUpdateWithWhereUniqueWithoutSandboxInput | UsageLogUpdateWithWhereUniqueWithoutSandboxInput[]
    updateMany?: UsageLogUpdateManyWithWhereWithoutSandboxInput | UsageLogUpdateManyWithWhereWithoutSandboxInput[]
    deleteMany?: UsageLogScalarWhereInput | UsageLogScalarWhereInput[]
  }

  export type SandboxCreateNestedOneWithoutUsageLogsInput = {
    create?: XOR<SandboxCreateWithoutUsageLogsInput, SandboxUncheckedCreateWithoutUsageLogsInput>
    connectOrCreate?: SandboxCreateOrConnectWithoutUsageLogsInput
    connect?: SandboxWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SandboxUpdateOneRequiredWithoutUsageLogsNestedInput = {
    create?: XOR<SandboxCreateWithoutUsageLogsInput, SandboxUncheckedCreateWithoutUsageLogsInput>
    connectOrCreate?: SandboxCreateOrConnectWithoutUsageLogsInput
    upsert?: SandboxUpsertWithoutUsageLogsInput
    connect?: SandboxWhereUniqueInput
    update?: XOR<XOR<SandboxUpdateToOneWithWhereWithoutUsageLogsInput, SandboxUpdateWithoutUsageLogsInput>, SandboxUncheckedUpdateWithoutUsageLogsInput>
  }

  export type UserCreateNestedOneWithoutAgentMemoriesInput = {
    create?: XOR<UserCreateWithoutAgentMemoriesInput, UserUncheckedCreateWithoutAgentMemoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentMemoriesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAgentMemoriesNestedInput = {
    create?: XOR<UserCreateWithoutAgentMemoriesInput, UserUncheckedCreateWithoutAgentMemoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentMemoriesInput
    upsert?: UserUpsertWithoutAgentMemoriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAgentMemoriesInput, UserUpdateWithoutAgentMemoriesInput>, UserUncheckedUpdateWithoutAgentMemoriesInput>
  }

  export type UserCreateNestedOneWithoutAgentEventsInput = {
    create?: XOR<UserCreateWithoutAgentEventsInput, UserUncheckedCreateWithoutAgentEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentEventsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAgentEventsNestedInput = {
    create?: XOR<UserCreateWithoutAgentEventsInput, UserUncheckedCreateWithoutAgentEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentEventsInput
    upsert?: UserUpsertWithoutAgentEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAgentEventsInput, UserUpdateWithoutAgentEventsInput>, UserUncheckedUpdateWithoutAgentEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedEnumProvisioningRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProvisioningRunStatus | EnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProvisioningRunStatusFilter<$PrismaModel> | $Enums.ProvisioningRunStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumProvisioningRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProvisioningRunStatus | EnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProvisioningRunStatus[] | ListEnumProvisioningRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProvisioningRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProvisioningRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProvisioningRunStatusFilter<$PrismaModel>
    _max?: NestedEnumProvisioningRunStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSandboxLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxLanguage | EnumSandboxLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxLanguageFilter<$PrismaModel> | $Enums.SandboxLanguage
  }

  export type NestedEnumSandboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxStatus | EnumSandboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxStatusFilter<$PrismaModel> | $Enums.SandboxStatus
  }

  export type NestedEnumSandboxLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxLanguage | EnumSandboxLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxLanguage[] | ListEnumSandboxLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxLanguageWithAggregatesFilter<$PrismaModel> | $Enums.SandboxLanguage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSandboxLanguageFilter<$PrismaModel>
    _max?: NestedEnumSandboxLanguageFilter<$PrismaModel>
  }

  export type NestedEnumSandboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SandboxStatus | EnumSandboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SandboxStatus[] | ListEnumSandboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSandboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.SandboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSandboxStatusFilter<$PrismaModel>
    _max?: NestedEnumSandboxStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    provisioningRuns?: ProvisioningRunCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    provisioningRuns?: ProvisioningRunUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectCreateManyWorkspaceInputEnvelope = {
    data: ProjectCreateManyWorkspaceInput | ProjectCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
  }

  export type ProjectUpdateManyWithWhereWithoutWorkspaceInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    slug?: StringNullableFilter<"Project"> | string | null
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    isActive?: BoolFilter<"Project"> | boolean
    previewUrl?: StringNullableFilter<"Project"> | string | null
    logsRef?: StringNullableFilter<"Project"> | string | null
    provisionError?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type WorkspaceCreateWithoutProjectsInput = {
    id?: string
    name: string
    ownerId?: string | null
    ownerUserId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    ownerId?: string | null
    ownerUserId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceCreateOrConnectWithoutProjectsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
  }

  export type ProvisioningRunCreateWithoutProjectInput = {
    id?: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ProvisioningRunUncheckedCreateWithoutProjectInput = {
    id?: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ProvisioningRunCreateOrConnectWithoutProjectInput = {
    where: ProvisioningRunWhereUniqueInput
    create: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput>
  }

  export type ProvisioningRunCreateManyProjectInputEnvelope = {
    data: ProvisioningRunCreateManyProjectInput | ProvisioningRunCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutProjectsInput = {
    update: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutProjectsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type WorkspaceUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvisioningRunUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProvisioningRunWhereUniqueInput
    update: XOR<ProvisioningRunUpdateWithoutProjectInput, ProvisioningRunUncheckedUpdateWithoutProjectInput>
    create: XOR<ProvisioningRunCreateWithoutProjectInput, ProvisioningRunUncheckedCreateWithoutProjectInput>
  }

  export type ProvisioningRunUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProvisioningRunWhereUniqueInput
    data: XOR<ProvisioningRunUpdateWithoutProjectInput, ProvisioningRunUncheckedUpdateWithoutProjectInput>
  }

  export type ProvisioningRunUpdateManyWithWhereWithoutProjectInput = {
    where: ProvisioningRunScalarWhereInput
    data: XOR<ProvisioningRunUpdateManyMutationInput, ProvisioningRunUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProvisioningRunScalarWhereInput = {
    AND?: ProvisioningRunScalarWhereInput | ProvisioningRunScalarWhereInput[]
    OR?: ProvisioningRunScalarWhereInput[]
    NOT?: ProvisioningRunScalarWhereInput | ProvisioningRunScalarWhereInput[]
    id?: StringFilter<"ProvisioningRun"> | string
    projectId?: StringFilter<"ProvisioningRun"> | string
    status?: EnumProvisioningRunStatusFilter<"ProvisioningRun"> | $Enums.ProvisioningRunStatus
    error?: StringNullableFilter<"ProvisioningRun"> | string | null
    createdAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    startedAt?: DateTimeFilter<"ProvisioningRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ProvisioningRun"> | Date | string | null
  }

  export type ProjectCreateWithoutProvisioningRunsInput = {
    id?: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateWithoutProvisioningRunsInput = {
    id?: string
    workspaceId: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateOrConnectWithoutProvisioningRunsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutProvisioningRunsInput, ProjectUncheckedCreateWithoutProvisioningRunsInput>
  }

  export type ProjectUpsertWithoutProvisioningRunsInput = {
    update: XOR<ProjectUpdateWithoutProvisioningRunsInput, ProjectUncheckedUpdateWithoutProvisioningRunsInput>
    create: XOR<ProjectCreateWithoutProvisioningRunsInput, ProjectUncheckedCreateWithoutProvisioningRunsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutProvisioningRunsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutProvisioningRunsInput, ProjectUncheckedUpdateWithoutProvisioningRunsInput>
  }

  export type ProjectUpdateWithoutProvisioningRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutProvisioningRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateWithoutUserInput = {
    id?: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUncheckedCreateWithoutUserInput = {
    id?: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyCreateOrConnectWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyCreateManyUserInputEnvelope = {
    data: ApiKeyCreateManyUserInput | ApiKeyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SandboxCreateWithoutUserInput = {
    id?: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
    usageLogs?: UsageLogCreateNestedManyWithoutSandboxInput
  }

  export type SandboxUncheckedCreateWithoutUserInput = {
    id?: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
    usageLogs?: UsageLogUncheckedCreateNestedManyWithoutSandboxInput
  }

  export type SandboxCreateOrConnectWithoutUserInput = {
    where: SandboxWhereUniqueInput
    create: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput>
  }

  export type SandboxCreateManyUserInputEnvelope = {
    data: SandboxCreateManyUserInput | SandboxCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AgentMemoryCreateWithoutUserInput = {
    id?: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentMemoryUncheckedCreateWithoutUserInput = {
    id?: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentMemoryCreateOrConnectWithoutUserInput = {
    where: AgentMemoryWhereUniqueInput
    create: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput>
  }

  export type AgentMemoryCreateManyUserInputEnvelope = {
    data: AgentMemoryCreateManyUserInput | AgentMemoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AgentEventCreateWithoutUserInput = {
    id?: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
  }

  export type AgentEventUncheckedCreateWithoutUserInput = {
    id?: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
  }

  export type AgentEventCreateOrConnectWithoutUserInput = {
    where: AgentEventWhereUniqueInput
    create: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput>
  }

  export type AgentEventCreateManyUserInputEnvelope = {
    data: AgentEventCreateManyUserInput | AgentEventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutUserInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutUserInput>
  }

  export type ApiKeyScalarWhereInput = {
    AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    OR?: ApiKeyScalarWhereInput[]
    NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    keyPrefix?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
  }

  export type SandboxUpsertWithWhereUniqueWithoutUserInput = {
    where: SandboxWhereUniqueInput
    update: XOR<SandboxUpdateWithoutUserInput, SandboxUncheckedUpdateWithoutUserInput>
    create: XOR<SandboxCreateWithoutUserInput, SandboxUncheckedCreateWithoutUserInput>
  }

  export type SandboxUpdateWithWhereUniqueWithoutUserInput = {
    where: SandboxWhereUniqueInput
    data: XOR<SandboxUpdateWithoutUserInput, SandboxUncheckedUpdateWithoutUserInput>
  }

  export type SandboxUpdateManyWithWhereWithoutUserInput = {
    where: SandboxScalarWhereInput
    data: XOR<SandboxUpdateManyMutationInput, SandboxUncheckedUpdateManyWithoutUserInput>
  }

  export type SandboxScalarWhereInput = {
    AND?: SandboxScalarWhereInput | SandboxScalarWhereInput[]
    OR?: SandboxScalarWhereInput[]
    NOT?: SandboxScalarWhereInput | SandboxScalarWhereInput[]
    id?: StringFilter<"Sandbox"> | string
    userId?: StringFilter<"Sandbox"> | string
    language?: EnumSandboxLanguageFilter<"Sandbox"> | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFilter<"Sandbox"> | $Enums.SandboxStatus
    containerId?: StringNullableFilter<"Sandbox"> | string | null
    port?: IntNullableFilter<"Sandbox"> | number | null
    timeoutSecs?: IntFilter<"Sandbox"> | number
    startedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    terminatedAt?: DateTimeNullableFilter<"Sandbox"> | Date | string | null
    createdAt?: DateTimeFilter<"Sandbox"> | Date | string
  }

  export type AgentMemoryUpsertWithWhereUniqueWithoutUserInput = {
    where: AgentMemoryWhereUniqueInput
    update: XOR<AgentMemoryUpdateWithoutUserInput, AgentMemoryUncheckedUpdateWithoutUserInput>
    create: XOR<AgentMemoryCreateWithoutUserInput, AgentMemoryUncheckedCreateWithoutUserInput>
  }

  export type AgentMemoryUpdateWithWhereUniqueWithoutUserInput = {
    where: AgentMemoryWhereUniqueInput
    data: XOR<AgentMemoryUpdateWithoutUserInput, AgentMemoryUncheckedUpdateWithoutUserInput>
  }

  export type AgentMemoryUpdateManyWithWhereWithoutUserInput = {
    where: AgentMemoryScalarWhereInput
    data: XOR<AgentMemoryUpdateManyMutationInput, AgentMemoryUncheckedUpdateManyWithoutUserInput>
  }

  export type AgentMemoryScalarWhereInput = {
    AND?: AgentMemoryScalarWhereInput | AgentMemoryScalarWhereInput[]
    OR?: AgentMemoryScalarWhereInput[]
    NOT?: AgentMemoryScalarWhereInput | AgentMemoryScalarWhereInput[]
    id?: StringFilter<"AgentMemory"> | string
    userId?: StringFilter<"AgentMemory"> | string
    namespace?: StringFilter<"AgentMemory"> | string
    key?: StringFilter<"AgentMemory"> | string
    value?: StringFilter<"AgentMemory"> | string
    expiresAt?: DateTimeNullableFilter<"AgentMemory"> | Date | string | null
    createdAt?: DateTimeFilter<"AgentMemory"> | Date | string
    updatedAt?: DateTimeFilter<"AgentMemory"> | Date | string
  }

  export type AgentEventUpsertWithWhereUniqueWithoutUserInput = {
    where: AgentEventWhereUniqueInput
    update: XOR<AgentEventUpdateWithoutUserInput, AgentEventUncheckedUpdateWithoutUserInput>
    create: XOR<AgentEventCreateWithoutUserInput, AgentEventUncheckedCreateWithoutUserInput>
  }

  export type AgentEventUpdateWithWhereUniqueWithoutUserInput = {
    where: AgentEventWhereUniqueInput
    data: XOR<AgentEventUpdateWithoutUserInput, AgentEventUncheckedUpdateWithoutUserInput>
  }

  export type AgentEventUpdateManyWithWhereWithoutUserInput = {
    where: AgentEventScalarWhereInput
    data: XOR<AgentEventUpdateManyMutationInput, AgentEventUncheckedUpdateManyWithoutUserInput>
  }

  export type AgentEventScalarWhereInput = {
    AND?: AgentEventScalarWhereInput | AgentEventScalarWhereInput[]
    OR?: AgentEventScalarWhereInput[]
    NOT?: AgentEventScalarWhereInput | AgentEventScalarWhereInput[]
    id?: StringFilter<"AgentEvent"> | string
    userId?: StringFilter<"AgentEvent"> | string
    namespace?: StringFilter<"AgentEvent"> | string
    eventType?: StringFilter<"AgentEvent"> | string
    payload?: StringFilter<"AgentEvent"> | string
    createdAt?: DateTimeFilter<"AgentEvent"> | Date | string
  }

  export type UserCreateWithoutApiKeysInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sandboxes?: SandboxCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApiKeysInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sandboxes?: SandboxUncheckedCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryUncheckedCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApiKeysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
  }

  export type UserUpsertWithoutApiKeysInput = {
    update: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sandboxes?: SandboxUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sandboxes?: SandboxUncheckedUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUncheckedUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UsageLogCreateWithoutSandboxInput = {
    id?: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
  }

  export type UsageLogUncheckedCreateWithoutSandboxInput = {
    id?: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
  }

  export type UsageLogCreateOrConnectWithoutSandboxInput = {
    where: UsageLogWhereUniqueInput
    create: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput>
  }

  export type UsageLogCreateManySandboxInputEnvelope = {
    data: UsageLogCreateManySandboxInput | UsageLogCreateManySandboxInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutSandboxesInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSandboxesInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryUncheckedCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSandboxesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSandboxesInput, UserUncheckedCreateWithoutSandboxesInput>
  }

  export type UsageLogUpsertWithWhereUniqueWithoutSandboxInput = {
    where: UsageLogWhereUniqueInput
    update: XOR<UsageLogUpdateWithoutSandboxInput, UsageLogUncheckedUpdateWithoutSandboxInput>
    create: XOR<UsageLogCreateWithoutSandboxInput, UsageLogUncheckedCreateWithoutSandboxInput>
  }

  export type UsageLogUpdateWithWhereUniqueWithoutSandboxInput = {
    where: UsageLogWhereUniqueInput
    data: XOR<UsageLogUpdateWithoutSandboxInput, UsageLogUncheckedUpdateWithoutSandboxInput>
  }

  export type UsageLogUpdateManyWithWhereWithoutSandboxInput = {
    where: UsageLogScalarWhereInput
    data: XOR<UsageLogUpdateManyMutationInput, UsageLogUncheckedUpdateManyWithoutSandboxInput>
  }

  export type UsageLogScalarWhereInput = {
    AND?: UsageLogScalarWhereInput | UsageLogScalarWhereInput[]
    OR?: UsageLogScalarWhereInput[]
    NOT?: UsageLogScalarWhereInput | UsageLogScalarWhereInput[]
    id?: StringFilter<"UsageLog"> | string
    sandboxId?: StringFilter<"UsageLog"> | string
    userId?: StringFilter<"UsageLog"> | string
    durationSecs?: IntFilter<"UsageLog"> | number
    billedAmount?: FloatFilter<"UsageLog"> | number
    language?: StringFilter<"UsageLog"> | string
    createdAt?: DateTimeFilter<"UsageLog"> | Date | string
  }

  export type UserUpsertWithoutSandboxesInput = {
    update: XOR<UserUpdateWithoutSandboxesInput, UserUncheckedUpdateWithoutSandboxesInput>
    create: XOR<UserCreateWithoutSandboxesInput, UserUncheckedCreateWithoutSandboxesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSandboxesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSandboxesInput, UserUncheckedUpdateWithoutSandboxesInput>
  }

  export type UserUpdateWithoutSandboxesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSandboxesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUncheckedUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SandboxCreateWithoutUsageLogsInput = {
    id?: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSandboxesInput
  }

  export type SandboxUncheckedCreateWithoutUsageLogsInput = {
    id?: string
    userId: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SandboxCreateOrConnectWithoutUsageLogsInput = {
    where: SandboxWhereUniqueInput
    create: XOR<SandboxCreateWithoutUsageLogsInput, SandboxUncheckedCreateWithoutUsageLogsInput>
  }

  export type SandboxUpsertWithoutUsageLogsInput = {
    update: XOR<SandboxUpdateWithoutUsageLogsInput, SandboxUncheckedUpdateWithoutUsageLogsInput>
    create: XOR<SandboxCreateWithoutUsageLogsInput, SandboxUncheckedCreateWithoutUsageLogsInput>
    where?: SandboxWhereInput
  }

  export type SandboxUpdateToOneWithWhereWithoutUsageLogsInput = {
    where?: SandboxWhereInput
    data: XOR<SandboxUpdateWithoutUsageLogsInput, SandboxUncheckedUpdateWithoutUsageLogsInput>
  }

  export type SandboxUpdateWithoutUsageLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSandboxesNestedInput
  }

  export type SandboxUncheckedUpdateWithoutUsageLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutAgentMemoriesInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    sandboxes?: SandboxCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAgentMemoriesInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    sandboxes?: SandboxUncheckedCreateNestedManyWithoutUserInput
    agentEvents?: AgentEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAgentMemoriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAgentMemoriesInput, UserUncheckedCreateWithoutAgentMemoriesInput>
  }

  export type UserUpsertWithoutAgentMemoriesInput = {
    update: XOR<UserUpdateWithoutAgentMemoriesInput, UserUncheckedUpdateWithoutAgentMemoriesInput>
    create: XOR<UserCreateWithoutAgentMemoriesInput, UserUncheckedCreateWithoutAgentMemoriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAgentMemoriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAgentMemoriesInput, UserUncheckedUpdateWithoutAgentMemoriesInput>
  }

  export type UserUpdateWithoutAgentMemoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAgentMemoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUncheckedUpdateManyWithoutUserNestedInput
    agentEvents?: AgentEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAgentEventsInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    sandboxes?: SandboxCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAgentEventsInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    sandboxes?: SandboxUncheckedCreateNestedManyWithoutUserInput
    agentMemories?: AgentMemoryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAgentEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAgentEventsInput, UserUncheckedCreateWithoutAgentEventsInput>
  }

  export type UserUpsertWithoutAgentEventsInput = {
    update: XOR<UserUpdateWithoutAgentEventsInput, UserUncheckedUpdateWithoutAgentEventsInput>
    create: XOR<UserCreateWithoutAgentEventsInput, UserUncheckedCreateWithoutAgentEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAgentEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAgentEventsInput, UserUncheckedUpdateWithoutAgentEventsInput>
  }

  export type UserUpdateWithoutAgentEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAgentEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    sandboxes?: SandboxUncheckedUpdateManyWithoutUserNestedInput
    agentMemories?: AgentMemoryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateManyWorkspaceInput = {
    id?: string
    name: string
    slug?: string | null
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    isActive?: boolean
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provisioningRuns?: ProvisioningRunUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provisioningRuns?: ProvisioningRunUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvisioningRunCreateManyProjectInput = {
    id?: string
    status: $Enums.ProvisioningRunStatus
    error?: string | null
    createdAt?: Date | string
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ProvisioningRunUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProvisioningRunUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProvisioningRunUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumProvisioningRunStatusFieldUpdateOperationsInput | $Enums.ProvisioningRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyCreateManyUserInput = {
    id?: string
    keyHash: string
    keyPrefix: string
    name: string
    isActive?: boolean
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SandboxCreateManyUserInput = {
    id?: string
    language: $Enums.SandboxLanguage
    status?: $Enums.SandboxStatus
    containerId?: string | null
    port?: number | null
    timeoutSecs?: number
    startedAt?: Date | string | null
    terminatedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AgentMemoryCreateManyUserInput = {
    id?: string
    namespace: string
    key: string
    value: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentEventCreateManyUserInput = {
    id?: string
    namespace: string
    eventType: string
    payload: string
    createdAt?: Date | string
  }

  export type ApiKeyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SandboxUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageLogs?: UsageLogUpdateManyWithoutSandboxNestedInput
  }

  export type SandboxUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageLogs?: UsageLogUncheckedUpdateManyWithoutSandboxNestedInput
  }

  export type SandboxUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumSandboxLanguageFieldUpdateOperationsInput | $Enums.SandboxLanguage
    status?: EnumSandboxStatusFieldUpdateOperationsInput | $Enums.SandboxStatus
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableIntFieldUpdateOperationsInput | number | null
    timeoutSecs?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terminatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentMemoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentEventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogCreateManySandboxInput = {
    id?: string
    userId: string
    durationSecs: number
    billedAmount: number
    language: string
    createdAt?: Date | string
  }

  export type UsageLogUpdateWithoutSandboxInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogUncheckedUpdateWithoutSandboxInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageLogUncheckedUpdateManyWithoutSandboxInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationSecs?: IntFieldUpdateOperationsInput | number
    billedAmount?: FloatFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}