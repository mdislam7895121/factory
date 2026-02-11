import fs from 'fs';
import path from 'path';

/**
 * File system helpers for generator
 */

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

export function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

export function listDir(dirPath) {
  if (!dirExists(dirPath)) return [];
  return fs.readdirSync(dirPath);
}

/**
 * Update or create file with marker-based content insertion
 * If markers exist, only content between them is replaced
 * If markers don't exist, append content
 * @param {string} filePath - File to update
 * @param {string} content - Content to insert
 * @param {string} markerId - Marker ID (e.g., 'GENERATED_ROUTES')
 */
export function updateWithMarkers(filePath, content, markerId) {
  const startMarker = `// START_MARKER: ${markerId}`;
  const endMarker = `// END_MARKER: ${markerId}`;

  let fileContent = '';
  if (fileExists(filePath)) {
    fileContent = readFile(filePath);
  }

  if (fileContent.includes(startMarker)) {
    // Replace between markers
    const regex = new RegExp(
      `${startMarker}[\\s\\S]*?${endMarker}`,
      'g'
    );
    fileContent = fileContent.replace(
      regex,
      `${startMarker}\n${content}\n${endMarker}`
    );
  } else {
    // Append with markers
    if (fileContent && !fileContent.endsWith('\n')) {
      fileContent += '\n';
    }
    fileContent += `${startMarker}\n${content}\n${endMarker}\n`;
  }

  writeFile(filePath, fileContent);
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert kebab-case to camelCase
 */
export function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Convert kebab-case to PascalCase
 */
export function toPascalCase(str) {
  return capitalize(toCamelCase(str));
}

export default {
  ensureDir,
  readFile,
  writeFile,
  fileExists,
  dirExists,
  listDir,
  updateWithMarkers,
  capitalize,
  toCamelCase,
  toPascalCase,
};
