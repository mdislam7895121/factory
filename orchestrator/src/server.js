import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  loadRegistry,
  saveRegistry,
  getAllProjects,
  addProject,
  updateProject,
  getProjectById,
  getUsedPorts,
} from './registry.js';

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
}

async function readProjects() {
  const registry = await loadRegistry();
  return getAllProjects(registry);
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

function parseHostPorts(text) {
  const ports = new Set();
  const value = String(text || '');
  const matches = value.matchAll(/(?:0\.0\.0\.0|\[::\]|\*):(\d+)->/g);
  for (const match of matches) {
    const port = Number(match[1]);
    if (Number.isFinite(port) && port > 0) {
      ports.add(port);
    }
  }
  return ports;
}

async function getDockerPublishedHostPorts() {
  const all = new Set();

  try {
    const output = await runCommand('docker', ['ps', '--format', '{{.Ports}}']);
    for (const line of output.split('\n')) {
      for (const port of parseHostPorts(line)) {
        all.add(port);
      }
    }

    if (all.size > 0 || !output.trim()) {
      return all;
    }
  } catch {
  }

  try {
    const output = await runCommand('docker', ['ps', '--format', 'JSON']);
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      try {
        const parsed = JSON.parse(trimmed);
        for (const port of parseHostPorts(parsed?.Ports)) {
          all.add(port);
        }
      } catch {
        for (const port of parseHostPorts(trimmed)) {
          all.add(port);
        }
      }
    }
  } catch {
  }

  return all;
}

async function pickPort(registry, start = 4300, end = 4399) {
  const used = new Set(
    getUsedPorts(registry)
      .map((port) => Number(port))
      .filter((port) => Number.isFinite(port) && port >= start && port <= end),
  );

  const publishedPorts = await getDockerPublishedHostPorts();
  for (const port of publishedPorts) {
    if (port >= start && port <= end) {
      used.add(port);
    }
  }

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
  let healthy = Boolean(project.healthy);

  if (running) {
    try {
      const response = await fetch(`http://host.docker.internal:${project.port}/`, { method: 'GET' });
      healthy = response.status >= 200 && response.status < 500;
    } catch {
      healthy = false;
    }
  }

  if (!running) {
    healthy = false;
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

async function reconcileRegistryState() {
  const registry = await loadRegistry();
  const projects = getAllProjects(registry);

  for (const project of projects) {
    const status = await collectStatus(project);
    updateProject(registry, project.id, {
      running: status.running,
      healthy: status.healthy,
      previewPath: status.previewPath,
    });
  }

  await saveRegistry(registry);
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

  const registry = await loadRegistry();
  const requestedPort = Number(req.body?.port);
  const port = Number.isFinite(requestedPort) && requestedPort > 0
    ? requestedPort
    : await pickPort(registry);
  const project = {
    id,
    name,
    template,
    workspacePath,
    port,
    containerName: `${CONTAINER_PREFIX}${id}`,
    createdAt: new Date().toISOString(),
    running: false,
    healthy: false,
    previewPath: `/p/${id}/`,
  };

  addProject(registry, project);
  await saveRegistry(registry);

  res.status(201).json({ ok: true, project: await collectStatus(project) });
});

app.post('/v1/projects/:id/start', async (req, res) => {
  const registry = await loadRegistry();
  const project = getProjectById(registry, req.params.id);
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

  const status = await collectStatus(project);
  updateProject(registry, project.id, {
    running: status.running,
    healthy: status.healthy,
    previewPath: status.previewPath,
  });
  await saveRegistry(registry);

  res.json({ ok: true, status });
});

app.post('/v1/projects/:id/stop', async (req, res) => {
  const registry = await loadRegistry();
  const project = getProjectById(registry, req.params.id);
  if (!project) {
    res.status(404).json({ ok: false, error: 'Project not found' });
    return;
  }

  try {
    await runCommand('docker', ['rm', '-f', project.containerName]);
  } catch {
  }

  updateProject(registry, project.id, {
    running: false,
    healthy: false,
    previewPath: `/p/${project.id}/`,
  });
  await saveRegistry(registry);

  const stopped = await collectStatus({ ...project, running: false, healthy: false });
  res.json({ ok: true, status: stopped });
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
await loadRegistry();
await reconcileRegistryState();
server.listen(PORT, () => {
  console.log(`[orchestrator] listening on http://0.0.0.0:${PORT}`);
});
