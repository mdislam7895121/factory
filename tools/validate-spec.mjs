#!/usr/bin/env node
/**
 * validate-spec.mjs
 * Validates mobile feature spec JSON files (v1 and v2)
 * 
 * Usage:
 *   node validate-spec.mjs <spec-file-path>
 * 
 * Exit codes:
 *   0 - Validation passed
 *   1 - Validation failed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('[FAIL] Usage: node validate-spec.mjs <spec-file-path>');
  process.exit(1);
}

const specPath = args[0];

// Check if file exists
if (!fs.existsSync(specPath)) {
  console.error(`[FAIL] Spec file not found: ${specPath}`);
  process.exit(1);
}

console.log(`[INFO] Validating spec: ${specPath}`);

// Read and parse JSON
let spec;
try {
  const content = fs.readFileSync(specPath, 'utf8');
  spec = JSON.parse(content);
  console.log('[OK] JSON is valid');
} catch (error) {
  console.error(`[FAIL] Invalid JSON: ${error.message}`);
  process.exit(1);
}

// Detect version
let version = 'v1'; // default
if (spec.version === '2.0') {
  version = 'v2';
} else if (spec.version && spec.version.startsWith('1.')) {
  version = 'v1';
}

console.log(`[INFO] Detected spec version: ${version}`);

// Validation rules
const errors = [];
const warnings = [];

// Common validations for both v1 and v2
if (!spec.featureId || typeof spec.featureId !== 'string') {
  errors.push('featureId is required and must be a string');
}

if (!spec.title || typeof spec.title !== 'string') {
  errors.push('title is required and must be a string');
}

if (!spec.version || typeof spec.version !== 'string') {
  errors.push('version is required and must be a string');
}

// Routes validation
if (!Array.isArray(spec.routes)) {
  errors.push('routes must be an array');
} else if (spec.routes.length === 0) {
  warnings.push('routes array is empty');
} else {
  spec.routes.forEach((route, index) => {
    if (!route.name) {
      errors.push(`routes[${index}]: name is required`);
    }
    if (!route.path) {
      errors.push(`routes[${index}]: path is required`);
    }
    if (!route.screenId) {
      errors.push(`routes[${index}]: screenId is required`);
    }
    if (!route.title) {
      errors.push(`routes[${index}]: title is required`);
    }
  });
}

// Screens validation
if (!Array.isArray(spec.screens)) {
  errors.push('screens must be an array');
} else if (spec.screens.length === 0) {
  warnings.push('screens array is empty');
} else {
  spec.screens.forEach((screen, index) => {
    if (!screen.id) {
      errors.push(`screens[${index}]: id is required`);
    }
    if (!screen.title) {
      errors.push(`screens[${index}]: title is required`);
    }
    // Type is optional but useful
    if (screen.type && typeof screen.type !== 'string') {
      errors.push(`screens[${index}]: type must be a string if present`);
    }
  });
}

// V1-specific validations
if (version === 'v1') {
  if (!Array.isArray(spec.apiClients)) {
    errors.push('apiClients must be an array (required in v1)');
  }
}

// V2-specific validations
if (version === 'v2') {
  // Auth is optional in v2
  if (spec.auth && typeof spec.auth !== 'object') {
    errors.push('auth must be an object if present');
  }
  
  // Permissions are optional
  if (spec.permissions && typeof spec.permissions !== 'object') {
    errors.push('permissions must be an object if present');
  }
  
  // Mocks are optional
  if (spec.mocks) {
    if (typeof spec.mocks !== 'object') {
      errors.push('mocks must be an object if present');
    } else if (spec.mocks.scenarios && !Array.isArray(spec.mocks.scenarios)) {
      errors.push('mocks.scenarios must be an array if present');
    }
  }
}

// Cross-reference validation: ensure route screenIds reference valid screens
const screenIds = new Set(spec.screens?.map(s => s.id) || []);
spec.routes?.forEach((route, index) => {
  if (route.screenId && !screenIds.has(route.screenId)) {
    warnings.push(`routes[${index}]: screenId "${route.screenId}" not found in screens array`);
  }
});

// Print results
if (errors.length > 0) {
  console.error(`[FAIL] Validation failed with ${errors.length} error(s):`);
  errors.forEach(err => console.error(`  - ${err}`));
  
  if (warnings.length > 0) {
    console.warn(`[WARN] ${warnings.length} warning(s):`);
    warnings.forEach(warn => console.warn(`  - ${warn}`));
  }
  
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`[WARN] ${warnings.length} warning(s):`);
  warnings.forEach(warn => console.warn(`  - ${warn}`));
}

console.log('[OK] Spec validation passed');
console.log(`[INFO] Summary: ${spec.routes?.length || 0} route(s), ${spec.screens?.length || 0} screen(s)`);

process.exit(0);
