const fs = require('node:fs');
const path = require('node:path');

const sourceDir = path.join(__dirname, '..', 'src', 'generated', 'prisma');
const targetDir = path.join(__dirname, '..', 'dist', 'src', 'generated', 'prisma');

if (!fs.existsSync(sourceDir)) {
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
