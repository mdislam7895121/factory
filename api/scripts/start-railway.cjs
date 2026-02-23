const { spawnSync } = require('node:child_process');

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
}

const migrate = run('prisma', ['migrate', 'deploy']);
if (migrate.status !== 0) {
  console.warn(
    '[WARN] prisma migrate deploy failed during startup. Continuing boot and relying on /ready JSON for health gating.',
  );
}

const app = run('node', ['dist/src/main.js']);
process.exit(app.status ?? 1);
