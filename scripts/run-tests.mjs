import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.test.ts')) files.push(path);
  }
}
await walk('src');
files.sort();
const args = ['--no-warnings', '--experimental-strip-types', '--test'];
if (process.argv.includes('--watch')) args.push('--watch');
args.push(...files);
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
