import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../src/', import.meta.url);
const violations = [];

async function walk(url) {
  const entries = await readdir(url, { withFileTypes: true });
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.tsx')) {
      const source = await readFile(child, 'utf8');
      const directText = source.match(/<Text[^>]*>\s*[A-Za-zÀ-ÿ][^<{]*<\/Text>/g) ?? [];
      for (const match of directText) violations.push(`${child.pathname}: ${match.trim()}`);
    }
  }
}

await walk(root);
if (violations.length) {
  console.error('Potential hard-coded UI strings found:\n' + violations.join('\n'));
  process.exit(1);
}
console.log('i18n audit passed: no direct literal text nodes found in src/**/*.tsx.');
