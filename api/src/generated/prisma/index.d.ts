
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

}

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type ProvisioningRunStatus = $Enums.ProvisioningRunStatus

export const ProvisioningRunStatus: typeof $Enums.ProvisioningRunStatus

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
    Workspace: 'Workspace',
    Project: 'Project',
    ProvisioningRun: 'ProvisioningRun'
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
      modelProps: "healthCheck" | "workspace" | "project" | "provisioningRun"
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
    workspace?: WorkspaceOmit
    project?: ProjectOmit
    provisioningRun?: ProvisioningRunOmit
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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
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
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["workspace"]>
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
    templateId: string | null
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus | null
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
    templateId: string | null
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus | null
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
    templateId: number
    orchestratorProjectId: number
    status: number
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
    templateId?: true
    orchestratorProjectId?: true
    status?: true
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
    templateId?: true
    orchestratorProjectId?: true
    status?: true
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
    templateId?: true
    orchestratorProjectId?: true
    status?: true
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
    templateId: string
    orchestratorProjectId: string | null
    status: $Enums.ProjectStatus
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
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
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
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
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
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
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
    templateId?: boolean
    orchestratorProjectId?: boolean
    status?: boolean
    previewUrl?: boolean
    logsRef?: boolean
    provisionError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workspaceId" | "name" | "templateId" | "orchestratorProjectId" | "status" | "previewUrl" | "logsRef" | "provisionError" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
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
      templateId: string
      orchestratorProjectId: string | null
      status: $Enums.ProjectStatus
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
    readonly templateId: FieldRef<"Project", 'String'>
    readonly orchestratorProjectId: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
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


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    templateId: 'templateId',
    orchestratorProjectId: 'orchestratorProjectId',
    status: 'status',
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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
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

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
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
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
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
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
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
    templateId?: SortOrder
    orchestratorProjectId?: SortOrderInput | SortOrder
    status?: SortOrder
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
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    previewUrl?: StringNullableFilter<"Project"> | string | null
    logsRef?: StringNullableFilter<"Project"> | string | null
    provisionError?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    provisioningRuns?: ProvisioningRunListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrderInput | SortOrder
    status?: SortOrder
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
    templateId?: StringWithAggregatesFilter<"Project"> | string
    orchestratorProjectId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
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

  export type WorkspaceCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProvisioningRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
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
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
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
    templateId?: SortOrder
    orchestratorProjectId?: SortOrder
    status?: SortOrder
    previewUrl?: SortOrder
    logsRef?: SortOrder
    provisionError?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
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

  export type ProjectCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId?: StringFilter<"Project"> | string
    orchestratorProjectId?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    previewUrl?: StringNullableFilter<"Project"> | string | null
    logsRef?: StringNullableFilter<"Project"> | string | null
    provisionError?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type WorkspaceCreateWithoutProjectsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
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
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logsRef?: NullableStringFieldUpdateOperationsInput | string | null
    provisionError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyWorkspaceInput = {
    id?: string
    name: string
    templateId: string
    orchestratorProjectId?: string | null
    status?: $Enums.ProjectStatus
    previewUrl?: string | null
    logsRef?: string | null
    provisionError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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
    templateId?: StringFieldUpdateOperationsInput | string
    orchestratorProjectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
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