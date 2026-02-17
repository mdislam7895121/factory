import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = Number(process.env.PORT || 4100);
const ROOT_DIR = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT_DIR, 'data');
const WORKSPACES_DIR = path.join(ROOT_DIR, 'workspaces');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const CONTAINER_PREFIX = 'factory_proj_';

app.use(express.json({ limit: '1mb' }));
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

async function ensureStateDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(WORKSPACES_DIR, { recursive: true });
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  try {
    await fs.access(PROJECTS_FILE);
  } catch {
    await fs.writeFile(PROJECTS_FILE, '[]', 'utf8');
  }
}

async function readProjects() {
  const raw = await fs.readFile(PROJECTS_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeProjects(projects) {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf8');
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `Command failed: ${command} ${args.join(' ')}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function findProject(projects, id) {
  return projects.find((item) => item.id === id);
}

function pickPort(projects, start = 4300, end = 4399) {
  const used = new Set(
    projects
      .map((project) => Number(project.port))
      .filter((port) => Number.isFinite(port) && port >= start && port <= end),
  );

  for (let port = start; port <= end; port++) {
    if (!used.has(port)) {
      return port;
    }
  }
  throw new Error('No free port available in range 4300-4399');
}

async function getContainerRunning(containerName) {
  try {
    const output = await runCommand('docker', ['inspect', '--format', '{{.State.Running}}', containerName]);
    return output === 'true';
  } catch {
    return false;
  }
}

async function collectStatus(project) {
  const running = await getContainerRunning(project.containerName);
  let healthy = false;

  if (running) {
    try {
      const response = await fetch(`http://host.docker.internal:${project.port}/`, { method: 'GET' });
      healthy = response.status >= 200 && response.status < 500;
    } catch {
      healthy = false;
    }
  }

  return {
    id: project.id,
    name: project.name,
    template: project.template,
    running,
    healthy,
    port: project.port,
    previewPath: `/p/${project.id}/`,
    containerName: project.containerName,
    createdAt: project.createdAt,
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'orchestrator', version: packageJson.version });
});

app.get('/v1/projects', async (_req, res) => {
  const projects = await readProjects();
  const enriched = await Promise.all(projects.map((project) => collectStatus(project)));
  res.json({ ok: true, projects: enriched });
});

app.post('/v1/projects', async (req, res) => {
  const template = String(req.body?.template || 'basic-web');
  const name = String(req.body?.name || 'Factory Project');

  const templatePath = path.join(TEMPLATES_DIR, template);
  try {
    await fs.access(templatePath);
  } catch {
    res.status(400).json({ ok: false, error: `Template not found: ${template}` });
    return;
  }

  const id = `proj-${Date.now().toString(36)}`;
  const workspacePath = path.join(WORKSPACES_DIR, id);
  await fs.cp(templatePath, workspacePath, { recursive: true });

  const projects = await readProjects();
  const port = Number(req.body?.port) || pickPort(projects);
  const project = {
    id,
    name,
    template,
    workspacePath,
    port,
    containerName: `${CONTAINER_PREFIX}${id}`,
    createdAt: new Date().toISOString(),
  };

  projects.push(project);
  await writeProjects(projects);

  res.status(201).json({ ok: true, project: await collectStatus(project) });
});

app.post('/v1/projects/:id/start', async (req, res) => {
  const projects = await readProjects();
  const project = findProject(projects, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  const running = await getContainerRunning(project.containerName);
  if (!running) {
    try {
      await runCommand('docker', [
        'run',
        '-d',
        '--name',
        project.containerName,
        '--label',
        `factory.project.id=${project.id}`,
        '--label',
        'factory.project.managed=true',
        '-p',
        `${project.port}:80`,
        'nginx:alpine',
      ]);
      await runCommand('docker', [
        'cp',
        `${project.workspacePath}${path.sep}.`,
        `${project.containerName}:/usr/share/nginx/html`,
      ]);
    } catch (error) {
      res.status(500).json({ ok: false, error: String(error.message || error) });
      return;
    }
  }

  res.json({ ok: true, status: await collectStatus(project) });
});

app.post('/v1/projects/:id/stop', async (req, res) => {
  const projects = await readProjects();
  const project = findProject(projects, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  try {
    await runCommand('docker', ['rm', '-f', project.containerName]);
  } catch {
  }

  res.json({ ok: true, status: await collectStatus(project) });
});

app.get('/v1/projects/:id/status', async (req, res) => {
  const projects = await readProjects();
  const project = findProject(projects, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  res.json({ ok: true, status: await collectStatus(project) });
});

app.get('/v1/projects/:id/logs', async (req, res) => {
  const projects = await readProjects();
  const project = findProject(projects, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  try {
    const output = await runCommand('docker', ['logs', '--tail', '100', project.containerName]);
    res.type('text/plain').send(output);
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error.message || error) });
  }
});

app.use('/v1/preview/:id', async (req, res) => {
  const projects = await readProjects();
  const project = findProject(projects, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  const running = await getContainerRunning(project.containerName);
  if (!running) {
    res.status(409).json({ ok: false, error: 'Project is not running' });
    return;
  }

  const forwardPath = req.originalUrl.replace(`/v1/preview/${project.id}`, '') || '/';
  const targetUrl = `http://host.docker.internal:${project.port}${forwardPath}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        accept: req.headers.accept || '*/*',
      },
    });

    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.send(body);
  } catch (error) {
    res.status(502).json({ ok: false, error: `Preview upstream error: ${String(error.message || error)}` });
  }
});

server.on('upgrade', async (request, socket, head) => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const match = url.pathname.match(/^\/v1\/ws\/projects\/([^/]+)\/logs$/);
    if (!match) {
      socket.destroy();
      return;
    }

    const projectId = match[1];
    const projects = await readProjects();
    const project = findProject(projects, projectId);
    if (!project) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      const proc = spawn('docker', ['logs', '-f', '--tail', '50', project.containerName]);

      ws.send(`[orchestrator] streaming logs for ${project.id}`);

      proc.stdout.on('data', (chunk) => {
        ws.send(chunk.toString());
      });
      proc.stderr.on('data', (chunk) => {
        ws.send(chunk.toString());
      });
      proc.on('close', (code) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(`[orchestrator] log stream closed (exit=${code})`);
          ws.close();
        }
      });

      ws.on('close', () => {
        proc.kill('SIGTERM');
      });
    });
  } catch {
    socket.destroy();
  }
});

await ensureStateDirs();
server.listen(PORT, () => {
  console.log(`[orchestrator] listening on http://0.0.0.0:${PORT}`);
});
