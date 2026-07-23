import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const en = JSON.parse(readFileSync(join(root, 'src/core/i18n/locales/en.json'), 'utf8')) as Record<string, string>;
const pt = JSON.parse(readFileSync(join(root, 'src/core/i18n/locales/pt.json'), 'utf8')) as Record<string, string>;

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function sourceKeys(): Set<string> {
  const keys = new Set<string>();
  const files = walk(join(root, 'src')).filter((path) => path.endsWith('.ts') || path.endsWith('.tsx'));
  const patterns = [
    /\b(?:t|msg|invalid)\('([^']+)'/g,
    /\b(?:t|msg|invalid)\("([^"]+)"/g,
    /(?:titleKey|subtitleKey|descriptionKey|labelKey|helperKey|placeholderKey|textKey|metaKey)="([^"]+)"/g,
    /(?:titleKey|subtitleKey|descriptionKey|labelKey|helperKey|placeholderKey|textKey|metaKey):\s*'([^']+)'/g,
  ];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        const key = match[1];
        if (key) keys.add(key);
      }
    }
  }
  return keys;
}

const dynamicKeys = [
  ...['0', '1', '2', '3', '4A', '4B', '4X'].map((value) => `lung.lungRads.category.${value}`),
  ...['1', '2', '3', '4A', '4B', '4X'].map((value) => `lung.lungRads.management.${value}`),
  ...['low', 'intermediate', 'high'].map((value) => `lung.brock.stratum.${value}`),
  ...['notApplicable', 'incomplete', 'I', 'II', 'IIF', 'III', 'IV'].flatMap((value) => [
    `renal.bosniak.title.${value}`,
    `renal.bosniak.risk.${value}`,
    `renal.bosniak.report.${value}`,
  ]),
  ...[
    'none',
    'simpleFluid',
    'ctMinus9To20',
    'ctAtLeast70',
    'ctOver20Nonenhancing',
    'ctPortal21To30',
    'ctTooSmallLowAttenuation',
    'mriT2CSFLike',
    'mriT1MarkedHomogeneous',
    'mriT1Heterogeneous',
  ].map((value) => `renal.bosniak.reason.special.${value}`),
  'language.pt.short',
  'language.pt.full',
  'language.en.short',
  'language.en.full',
];

test('English and Portuguese dictionaries have exact key parity', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(pt).sort());
  assert.ok(Object.keys(en).length >= 590);
  for (const [key, value] of Object.entries(en)) assert.ok(value.trim(), `empty EN value: ${key}`);
  for (const [key, value] of Object.entries(pt)) assert.ok(value.trim(), `empty PT value: ${key}`);
});

test('all statically and dynamically referenced translation keys exist', () => {
  const required = new Set([...sourceKeys(), ...dynamicKeys]);
  const missing = [...required].filter((key) => !(key in en) || !(key in pt)).sort();
  assert.deepEqual(missing, []);
});
