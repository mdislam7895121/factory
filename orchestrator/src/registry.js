import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

function emptyRegistry() {
  return { projects: {} };
}

function normalizeRegistry(parsed) {
  if (Array.isArray(parsed)) {
    const projects = {};
    for (const project of parsed) {
      if (project?.id) {
        projects[project.id] = project;
      }
    }
    return { projects };
  }

  if (parsed && typeof parsed === 'object' && parsed.projects && typeof parsed.projects === 'object') {
    return { projects: parsed.projects };
  }

  return emptyRegistry();
}

export async function loadRegistry() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await fs.readFile(PROJECTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeRegistry(parsed);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error(`[registry] failed to read or parse projects file, falling back to empty registry: ${String(error?.message || error)}`);
    }

    const initial = emptyRegistry();
    await saveRegistry(initial);
    return initial;
  }
}

export async function saveRegistry(registry) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized = normalizeRegistry(registry);
  const tempFile = `${PROJECTS_FILE}.tmp`;
  const payload = JSON.stringify(normalized, null, 2);

  await fs.writeFile(tempFile, payload, 'utf8');
  await fs.rename(tempFile, PROJECTS_FILE);
}

export function getAllProjects(registry) {
  return Object.values(registry.projects || {});
}

export function addProject(registry, project) {
  registry.projects = registry.projects || {};
  registry.projects[project.id] = project;
  return project;
}

export function setProject(registry, id, project) {
  registry.projects = registry.projects || {};
  registry.projects[id] = {
    ...project,
    id,
  };
  return registry.projects[id];
}

export function getProjectById(registry, id) {
  return (registry.projects || {})[id] || null;
}

export function updateProject(registry, id, updates) {
  registry.projects = registry.projects || {};
  const current = registry.projects[id];
  if (!current) {
    return null;
  }

  registry.projects[id] = {
    ...current,
    ...updates,
  };

  return registry.projects[id];
}

export function getUsedPorts(registry) {
  const ports = new Set();
  for (const project of getAllProjects(registry)) {
    const port = Number(project.port);
    if (Number.isFinite(port) && port > 0) {
      ports.add(port);
    }
  }
  return Array.from(ports);
}
