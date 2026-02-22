#!/usr/bin/env node

const RESERVED_NAMES = new Set(['api', 'web', 'mobile', 'apps', 'docs', 'scripts']);
const NAME_PATTERN = /^[a-z][a-z0-9-]{2,39}$/;
const DATABASE_VALUES = new Set(['postgres', 'sqlite']);

const FILE_MAP = [
  { path: 'README.md', source: 'template:root/README.md.hbs' },
  { path: '.gitignore', source: 'template:root/.gitignore.hbs' },
  { path: '.env.example', source: 'template:root/.env.example.hbs' },
  { path: 'apps/api/package.json', source: 'template:apps/api/package.json.hbs' },
  { path: 'apps/api/tsconfig.json', source: 'template:apps/api/tsconfig.json.hbs' },
  { path: 'apps/api/src/main.ts', source: 'template:apps/api/src/main.ts.hbs' },
  { path: 'apps/web/package.json', source: 'template:apps/web/package.json.hbs' },
  { path: 'apps/web/next.config.js', source: 'template:apps/web/next.config.js.hbs' },
  { path: 'apps/web/tsconfig.json', source: 'template:apps/web/tsconfig.json.hbs' },
  { path: 'apps/web/src/app/layout.tsx', source: 'template:apps/web/src/app/layout.tsx.hbs' },
  { path: 'apps/web/src/app/page.tsx', source: 'template:apps/web/src/app/page.tsx.hbs' },
  { path: 'packages/shared/package.json', source: 'template:packages/shared/package.json.hbs' },
  { path: 'packages/shared/src/index.ts', source: 'template:packages/shared/src/index.ts.hbs' },
  { path: 'packages/shared/src/types.ts', source: 'template:packages/shared/src/types.ts.hbs' },
];

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const flags = {};

  for (let index = 1; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const nextToken = args[index + 1];
    if (!nextToken || nextToken.startsWith('--')) {
      flags[key] = true;
      continue;
    }

    flags[key] = nextToken;
    index += 1;
  }

  return { command, flags };
}

function normalizeBoolean(rawValue, fallback) {
  if (rawValue === undefined) {
    return fallback;
  }

  if (typeof rawValue === 'boolean') {
    return rawValue;
  }

  if (typeof rawValue === 'string') {
    if (rawValue.toLowerCase() === 'true') {
      return true;
    }

    if (rawValue.toLowerCase() === 'false') {
      return false;
    }
  }

  return rawValue;
}

function validateInputs(rawInputs) {
  const issues = [];
  const normalized = {
    name: typeof rawInputs.name === 'string' ? rawInputs.name.trim() : rawInputs.name,
    withAuth: normalizeBoolean(rawInputs.withAuth, false),
    database: typeof rawInputs.database === 'string' && rawInputs.database.length > 0
      ? rawInputs.database
      : 'postgres',
    outputDir: typeof rawInputs.outputDir === 'string' && rawInputs.outputDir.length > 0
      ? rawInputs.outputDir
      : '.',
  };

  if (typeof normalized.name !== 'string' || normalized.name.length === 0) {
    issues.push({ field: 'name', message: 'name is required' });
  } else {
    if (!NAME_PATTERN.test(normalized.name)) {
      issues.push({ field: 'name', message: 'name must match ^[a-z][a-z0-9-]{2,39}$' });
    }

    if (RESERVED_NAMES.has(normalized.name)) {
      issues.push({ field: 'name', message: 'name must not be a reserved name' });
    }
  }

  if (typeof normalized.withAuth !== 'boolean') {
    issues.push({ field: 'withAuth', message: 'withAuth must be a boolean' });
  }

  if (typeof normalized.database !== 'string' || !DATABASE_VALUES.has(normalized.database)) {
    issues.push({ field: 'database', message: 'database must be one of: postgres, sqlite' });
  }

  return { normalized, issues };
}

function buildPlan(rawInputs) {
  const { normalized, issues } = validateInputs(rawInputs);

  if (issues.length > 0) {
    return {
      ok: false,
      error: 'ValidationError',
      issues,
    };
  }

  const targetRoot = normalized.outputDir === '.'
    ? `./${normalized.name}`
    : `${normalized.outputDir}/${normalized.name}`;

  const files = FILE_MAP
    .slice()
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((entry) => ({
      path: entry.path,
      action: 'CREATE',
      source: entry.source,
    }));

  const dirs = new Set();
  for (const entry of files) {
    const slashIndex = entry.path.lastIndexOf('/');
    if (slashIndex > 0) {
      dirs.add(entry.path.slice(0, slashIndex));
    }
  }

  return {
    ok: true,
    templateId: 'fullstack-v1',
    mode: 'plan',
    inputs: {
      name: normalized.name,
      withAuth: normalized.withAuth,
      database: normalized.database,
      outputDir: normalized.outputDir,
    },
    output: {
      rule: 'targetDir = outputDir ? outputDir + "/" + name : "./" + name',
      targetFolder: targetRoot,
    },
    files,
    counts: {
      totalFiles: files.length,
      totalDirs: dirs.size,
    },
  };
}

function printUsage() {
  process.stdout.write(
    [
      'fullstack-v1 plan mode CLI',
      '',
      'Usage:',
      '  node templates/fullstack-v1/bin/fullstack-v1.mjs plan --name <value> [--withAuth true|false] [--database postgres|sqlite] [--outputDir <dir>] [--json]',
      '',
    ].join('\n'),
  );
}

function main() {
  const { command, flags } = parseArgs(process.argv);

  if (!command || command === '--help' || command === '-h') {
    printUsage();
    return;
  }

  if (command !== 'plan') {
    process.stderr.write('Unsupported command. Only "plan" is available in Step 3.\n');
    process.exitCode = 1;
    return;
  }

  const result = buildPlan({
    name: flags.name,
    withAuth: flags.withAuth,
    database: flags.database,
    outputDir: flags.outputDir,
  });

  const payload = `${JSON.stringify(result, null, 2)}\n`;
  process.stdout.write(payload);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main();
