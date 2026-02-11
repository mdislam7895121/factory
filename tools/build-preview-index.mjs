#!/usr/bin/env node
/**
 * Build Preview Index
 * Generates a JSON index of mobile routes and specs for web preview page
 * 
 * Usage:
 *   node tools/build-preview-index.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Configuration
const ROUTE_REGISTRY_PATH = path.resolve(ROOT, 'mobile/src/routes/routeRegistry.js');
const SPECS_DIR = path.resolve(ROOT, 'tools/specs');
const OUTPUT_DIR = path.resolve(ROOT, 'web/public/factory-preview');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.json');

/**
 * Extract routes from route registry file
 * Safely parses the JS export to get manualRoutes array
 */
function extractRoutesFromRegistry() {
  if (!fs.existsSync(ROUTE_REGISTRY_PATH)) {
    console.error(`[FAIL] Route registry not found: ${ROUTE_REGISTRY_PATH}`);
    return [];
  }

  try {
    // Read the file
    const content = fs.readFileSync(ROUTE_REGISTRY_PATH, 'utf8');
    
    // Extract manualRoutes array using regex (safe approach)
    const routesMatch = content.match(/export const manualRoutes = \[([\s\S]*?)\];/);
    if (!routesMatch) {
      console.warn('[WARN] Could not find manualRoutes in registry');
      return [];
    }

    // Parse manually to extract route objects
    const routes = [];
    const routePattern = /{\s*\n?\s*name:\s*['"]([^'"]+)['"]/g;
    let match;

    while ((match = routePattern.exec(routesMatch[1])) !== null) {
      const routeName = match[1];
      const routeObj = extractRouteObject(routesMatch[1], routeName);
      if (routeObj) {
        routes.push(routeObj);
      }
    }

    return routes;
  } catch (err) {
    console.error(`[FAIL] Error reading route registry: ${err.message}`);
    return [];
  }
}

/**
 * Extract individual route object properties
 */
function extractRouteObject(routesContent, routeName) {
  try {
    // Find the route object block
    const routeStart = routesContent.indexOf(`name: '${routeName}'`);
    if (routeStart === -1) return null;

    // Find the opening brace
    let braceCount = 0;
    let objectStart = routeStart;
    while (objectStart >= 0 && routesContent[objectStart] !== '{') {
      objectStart--;
    }

    // Find closing brace
    let braceOpen = 1;
    let objectEnd = objectStart + 1;
    while (objectEnd < routesContent.length && braceOpen > 0) {
      if (routesContent[objectEnd] === '{') braceOpen++;
      if (routesContent[objectEnd] === '}') braceOpen--;
      objectEnd++;
    }

    const objectStr = routesContent.substring(objectStart, objectEnd);

    // Extract properties using regex
    const extractProp = (key) => {
      const regex = new RegExp(`${key}:\\s*['"]?([^'"\\n]+)['"]?[,\\n]`);
      const m = objectStr.match(regex);
      return m ? m[1].trim() : undefined;
    };

    return {
      name: extractProp('name'),
      path: extractProp('path'),
      title: extractProp('title'),
      screenId: extractProp('screenId'),
      requiresAuth: objectStr.includes('requiresAuth') && objectStr.includes('requiresAuth: true'),
      source: routeName.includes('inventory') ? 'generated' : 'manual'
    };
  } catch (err) {
    return null;
  }
}

/**
 * Find all spec files
 */
function findSpecFiles() {
  const specs = [];
  
  if (!fs.existsSync(SPECS_DIR)) {
    console.warn(`[WARN] Specs directory not found: ${SPECS_DIR}`);
    return specs;
  }

  try {
    const files = fs.readdirSync(SPECS_DIR);
    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('schema')) {
        const filePath = path.join(SPECS_DIR, file);
        specs.push({
          filename: file,
          path: `/tools/specs/${file}`
        });
      }
    }
    return specs;
  } catch (err) {
    console.error(`[FAIL] Error reading specs directory: ${err.message}`);
    return specs;
  }
}

/**
 * Build the index JSON
 */
function buildIndex() {
  const routes = extractRoutesFromRegistry();
  const specs = findSpecFiles();

  const index = {
    timestamp: new Date().toISOString(),
    routes: routes.length > 0 ? routes : [],
    specs: specs.length > 0 ? specs : [],
    summary: {
      totalRoutes: routes.length,
      manualRoutes: routes.filter(r => r.source === 'manual').length,
      generatedRoutes: routes.filter(r => r.source === 'generated').length,
      totalSpecs: specs.length,
      routesUpdated: routes.length > 0,
      specsFound: specs.length > 0
    }
  };

  return index;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('[GEN] Building preview index...\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Build index
    const index = buildIndex();

    // Write output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf8');

    console.log(`[OK] Routes found: ${index.routes.length}`);
    console.log(`[OK] Specs found: ${index.specs.length}`);
    console.log(`[OK] Index written to: ${OUTPUT_FILE}\n`);

    // Display summary
    if (index.routes.length > 0) {
      console.log('[ROUTE] Detected routes:');
      index.routes.forEach(r => {
        const auth = r.requiresAuth ? '[AUTH]' : '[PUBLIC]';
        console.log(`  ${auth} ${r.name.padEnd(20)} -> ${r.path}`);
      });
      console.log();
    }

    if (index.specs.length > 0) {
      console.log('[SPEC] Found specs:');
      index.specs.forEach(s => {
        console.log(`  ${s.filename}`);
      });
      console.log();
    }

    console.log('[OK] Preview index build complete!\n');
    process.exit(0);
  } catch (err) {
    console.error(`[FAIL] ${err.message}`);
    process.exit(1);
  }
}

main();
