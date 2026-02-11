#!/usr/bin/env node
/**
 * Factory Mobile Feature Generator
 * Spec-driven code generation for mobile features
 * 
 * Usage:
 *   node generate-mobile-feature.mjs --spec specs/examples/feature-sample.json
 *   node generate-mobile-feature.mjs --spec specs/examples/feature-sample.json --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ensureDir,
  readFile,
  writeFile,
  updateWithMarkers,
  capitalize,
  toCamelCase,
  toPascalCase,
} from './lib/fs-helpers.mjs';
import {
  renderTemplate,
  formatTitle,
} from './lib/template-helpers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Parse CLI args
const args = process.argv.slice(2);
const specPath = args[args.indexOf('--spec') + 1];
const dryRun = args.includes('--dry-run');

if (!specPath) {
  console.error('❌ Missing required argument: --spec <path>');
  console.error('Usage: node generate-mobile-feature.mjs --spec specs/examples/feature-sample.json');
  process.exit(1);
}

const fullSpecPath = path.resolve(ROOT, specPath);
if (!fs.existsSync(fullSpecPath)) {
  console.error(`❌ Spec file not found: ${fullSpecPath}`);
  process.exit(1);
}

console.log(`\n📖 Generating from spec: ${specPath}`);
if (dryRun) {
  console.log('   [DRY-RUN] - No files will be written');
}
console.log('');

let spec;
try {
  const specContent = readFile(fullSpecPath);
  spec = JSON.parse(specContent);
} catch (err) {
  console.error(`❌ Failed to parse spec: ${err.message}`);
  process.exit(1);
}

const {
  featureId,
  title,
  version,
  routes = [],
  screens = [],
  apiClients = [],
  mocks = [],
  flags = [],
} = spec;

const camelFeature = toCamelCase(featureId);
const pascalFeature = toPascalCase(featureId);

console.log(`✓ Feature: ${title} (${featureId})`);
console.log(`✓ Screens: ${screens.length}`);
console.log(`✓ Routes: ${routes.length}`);
console.log(`✓ API Clients: ${apiClients.length}`);
console.log('');

// Create feature directory
const featurePath = path.resolve(ROOT, 'mobile', 'src', 'features', featureId);

const filesToCreate = [];

// Generate screens
for (const screen of screens) {
  const screenName = screen.id;
  const screenType = screen.type; // list, details, form, dashboard

  let templateFile;
  switch (screenType) {
    case 'list':
      templateFile = 'screen.list.js.tpl';
      break;
    case 'details':
      templateFile = 'screen.details.js.tpl';
      break;
    case 'form':
      templateFile = 'screen.form.js.tpl';
      break;
    case 'dashboard':
      templateFile = 'screen.list.js.tpl'; // Use list as base
      break;
    default:
      console.warn(`⚠️  Unknown screen type: ${screenType}`);
      templateFile = 'screen.list.js.tpl';
  }

  const templatePath = path.resolve(__dirname, 'templates', 'mobile', templateFile);
  const template = readFile(templatePath);

  const rendered = renderTemplate(template, {
    screenName,
    featureId,
    camelCaseFeature: camelFeature,
    version,
    itemPlural: formatTitle(featureId + 's'),
    singular: formatTitle(featureId),
  });

  const screenPath = path.resolve(featurePath, 'screens', `${screenName}.js`);
  filesToCreate.push({
    path: screenPath,
    content: rendered,
    description: `Screen: ${screenName} (${screenType})`,
  });
}

// Generate API client
if (apiClients.length > 0) {
  const apiClient = apiClients[0]; // Take first for now
  
  const clientMethods = apiClient.endpoints
    .map((ep) => {
      const params = ep.path.includes(':') 
        ? ep.path.split('/').filter(p => p.startsWith(':')).map(p => p.slice(1))
        : [];
      const paramList = params.length > 0 ? params.join(', ') + ', ' : '';
      const paramPassthrough = params.length > 0 ? ', ' + params.map(p => `${p}: ${p}`).join(', ') : '';

      return `
  ${ep.name}: async (${paramList}body = null) => {
    return request('${ep.method}', '${ep.path}'${paramPassthrough.split(',').length > 1 ? paramPassthrough : ''}, body);
  },`;
    })
    .join('\n');

  const endpoints = apiClient.endpoints
    .map((ep) => ` * - ${ep.name}: ${ep.method} ${ep.path}`)
    .join('\n');

  const apiTemplate = readFile(path.resolve(__dirname, 'templates', 'mobile', 'api.client.js.tpl'));
  const apiRendered = renderTemplate(apiTemplate, {
    title,
    featureId,
    camelCaseFeature: camelFeature,
    version,
    apiBase: apiClient.base,
    endpoints,
    clientMethods,
  });

  const apiPath = path.resolve(featurePath, 'api', `${featureId}.api.js`);
  filesToCreate.push({
    path: apiPath,
    content: apiRendered,
    description: `API Client: ${apiClient.id}`,
  });
}

// Generate mocks
if (mocks.length > 0) {
  const mocksContent = `/**
 * Mock Data for {{title}}
 * Generated from spec: {{featureId}}/{{version}}
 */

const {{camelCaseFeature}}Mocks = {
${mocks
  .map(
    (mock) => `
  ${mock.endpoint.split('.')[1]}: {
    mockPath: '${mock.endpoint.split('.')[0]}',
    method: 'GET',
    response: ${JSON.stringify(mock.response, null, 2)},
    status: ${mock.status || 200},
  },`
  )
  .join('\n')}
};

export default {{camelCaseFeature}}Mocks;
`;

  const mocksRendered = renderTemplate(mocksContent, {
    title,
    featureId,
    camelCaseFeature: camelFeature,
    version,
  });

  const mocksPath = path.resolve(featurePath, 'mocks', `${featureId}.mocks.js`);
  filesToCreate.push({
    path: mocksPath,
    content: JSON.stringify(mocks, null, 2),
    description: `Mocks: ${mocks.length} entries`,
  });
}

// Generate barrel export
const barrelContent = `/**
 * {{title}} Feature Exports
 * Generated from spec: {{featureId}}/{{version}}
 */

export * from './screens';
export { {{camelCaseFeature}}Api } from './api/{{featureId}}.api';
export { default as {{camelCaseFeature}}Mocks } from './mocks/{{featureId}}.mocks';
`;

const barrelRendered = renderTemplate(barrelContent, {
  title,
  featureId,
  camelCaseFeature: camelFeature,
  version,
});

filesToCreate.push({
  path: path.resolve(featurePath, 'index.js'),
  content: barrelRendered,
  description: `Barrel: index.js`,
});

// Generate route entries (route objects for manualRoutes array)
const routeEntries = routes
  .map(
    (route) => `  {
    name: '${route.name}',
    path: '${route.path}',
    title: '${route.title}',
    screenId: '${route.screenId}',
    requiresAuth: ${route.requiresAuth !== false},
  },`
  )
  .join('\n');

// Write files
console.log('📝 Generated files:');
console.log('');

if (!dryRun) {
  for (const file of filesToCreate) {
    ensureDir(path.dirname(file.path));
    writeFile(file.path, file.content);
    console.log(`  ✓ ${file.path.replace(ROOT + '/', '')}`);
    console.log(`    └─ ${file.description}`);
  }
}

// Update route registry
const routeRegistryPath = path.resolve(ROOT, 'mobile', 'src', 'routes', 'routeRegistry.js');
console.log('');
console.log('🔗 Updating route registry:');
console.log(`  ${routeRegistryPath.replace(ROOT + '/', '')}`);

if (!dryRun) {
  ensureDir(path.dirname(routeRegistryPath));
  
  const startMarker = `  // START_MARKER: GENERATED_ROUTES`;
  const endMarker = `  // END_MARKER: GENERATED_ROUTES`;
  
  let registryContent = readFile(routeRegistryPath);
  
  const regex = new RegExp(
    `${startMarker}[\\s\\S]*?${endMarker}`,
    'g'
  );
  
  registryContent = registryContent.replace(
    regex,
    `${startMarker}\n${routeEntries}\n${endMarker}`
  );
  
  writeFile(routeRegistryPath, registryContent);
}

console.log('');
console.log('✅ Generation complete!');
if (dryRun) {
  console.log('   [DRY-RUN] No files were actually written');
}
console.log('');
