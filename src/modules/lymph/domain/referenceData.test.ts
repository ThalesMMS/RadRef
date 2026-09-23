import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { moduleById, switchableTools, toolByRoute } from '../../../core/moduleRegistry.ts';
import { lymphEn, lymphPt } from '../i18n.ts';
import { chainsForRegion, lymphChains, lymphRegions, lymphSources, normalizeLymphSearch, sourcesFor } from './referenceData.ts';

const en: Readonly<Record<string, string>> = lymphEn;
const pt: Readonly<Record<string, string>> = lymphPt;
function byId(id: string) {
  const item = lymphChains.find((candidate) => candidate.id === id);
  assert.ok(item, `missing chain: ${id}`);
  return item;
}

test('three regions contain 29 distinct, source-linked entries', () => {
  assert.deepEqual(lymphRegions, ['cervical', 'thoracic', 'abdominal']);
  assert.equal(lymphChains.length, 29);
  assert.equal(new Set(lymphChains.map((item) => item.id)).size, lymphChains.length);
  assert.deepEqual(lymphRegions.map((region) => chainsForRegion(region).length), [10, 11, 8]);
  for (const item of lymphChains) {
    assert.ok(item.sourceIds.length > 0);
    assert.equal(sourcesFor(item.sourceIds).length, item.sourceIds.length);
    assert.ok(en[item.labelKey] && en[item.noteKey]);
    if (item.measurement.kind === 'typicalCT') {
      const { minMm, meanMm, maxMm } = item.measurement;
      assert.ok([minMm, meanMm, maxMm].every((value) => Number.isFinite(value) && value > 0));
      assert.ok(minMm <= meanMm && meanMm <= maxMm);
    } else if (item.measurement.kind !== 'qualitative') {
      assert.ok(Number.isFinite(item.measurement.shortAxisMm));
      assert.ok(item.measurement.shortAxisMm > 0);
    }
  }
});

test('Dorfman location-specific CT upper references retain all seven published values', () => {
  const expected = { retrocrural: 6, paracardiac: 8, gastrohepatic: 8, portaHepatis: 7,
    portacaval: 10, upperParaaortic: 9, lowerParaaortic: 11 };
  for (const [id, shortAxisMm] of Object.entries(expected)) {
    assert.deepEqual(byId(id).measurement, { kind: 'upperCT', shortAxisMm });
    assert.deepEqual(byId(id).sourceIds, ['dorfman1991']);
  }
});

test('the 11 mm cervical exception is limited to jugulodigastric nodes', () => {
  for (const id of ['submental', 'submandibular', 'upperJugularOther', 'middleJugular',
    'lowerJugular', 'posteriorTriangle', 'central']) {
    assert.deepEqual(byId(id).measurement, { kind: 'suspicion', shortAxisMm: 10 });
  }
  assert.deepEqual(byId('jugulodigastric').measurement, { kind: 'suspicion', shortAxisMm: 11 });
  assert.notEqual(byId('jugulodigastric').noteKey, byId('upperJugularOther').noteKey);
});

test('Tang lateral retropharyngeal MRI criterion is 5 mm, not a general normal limit', () => {
  const item = byId('retropharyngealLateral');
  assert.deepEqual(item.measurement, { kind: 'suspicion', shortAxisMm: 5 });
  assert.deepEqual(item.sourceIds, ['tang2014']);
  assert.match(en[item.noteKey] ?? '', /MRI in nasopharyngeal carcinoma/);
});

test('median retropharyngeal criterion is qualitative, never a fabricated zero-mm limit', () => {
  const item = byId('retropharyngealMedial');
  assert.deepEqual(item.measurement, { kind: 'qualitative' });
  assert.deepEqual(item.sourceIds, ['tang2014']);
});

test('mediastinal CT reference is distinct from response-assessment cutoffs', () => {
  const items = chainsForRegion('thoracic').filter((item) => item.sourceIds.includes('glazer1985'));
  assert.equal(items.length, 8);
  for (const item of items) {
    assert.deepEqual(item.measurement, { kind: 'upperCT', shortAxisMm: 10 });
    assert.equal(item.noteKey, 'lymph.note.mediastinal');
  }
});

test('hilar values preserve anatomical provenance instead of being relabelled CT limits', () => {
  for (const [id, shortAxisMm] of Object.entries({
    hilarRightAulIil: 12, hilarRightSilLeftAulIil: 10, hilarOther: 8,
  })) {
    const item = byId(id);
    assert.deepEqual(item.measurement, { kind: 'upperAnatomy', shortAxisMm });
    assert.deepEqual(item.sourceIds, ['kiyono1989']);
    assert.equal(item.noteKey, 'lymph.note.hilar');
  }
});

test('mesenteric usual size is not promoted to a universal upper limit', () => {
  const item = byId('mesenteric');
  assert.deepEqual(item.measurement, { kind: 'typicalCT', meanMm: 4.8, minMm: 3, maxMm: 9 });
  assert.deepEqual(item.sourceIds, ['lucey2005']);
  assert.match(en[item.noteKey] ?? '', /not a universal upper limit/);
  assert.equal(en['lymph.measure.typicalCT'], 'Mean {{mean}} mm (observed range {{min}}–{{max}} mm)');
  assert.equal(pt['lymph.measure.typicalCT'], 'Média de {{mean}} mm (intervalo observado de {{min}}–{{max}} mm)');
  assert.equal(item.measurement.meanMm.toLocaleString('en-US'), '4.8');
  assert.equal(item.measurement.meanMm.toLocaleString('pt-BR'), '4,8');
});

test('all eight publications have unique IDs and HTTPS DOI links', () => {
  assert.equal(lymphSources.length, 8);
  assert.equal(new Set(lymphSources.map((source) => source.id)).size, lymphSources.length);
  assert.equal(new Set(lymphSources.map((source) => source.url)).size, lymphSources.length);
  for (const source of lymphSources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'doi.org');
    assert.ok(url.pathname.startsWith('/10.'));
    assert.ok(en[source.titleKey] && en[source.subtitleKey]);
  }
  assert.deepEqual(sourcesFor([]), []);
  assert.deepEqual(sourcesFor(['dorfman1991', 'dorfman1991']).map((item) => item.id), ['dorfman1991']);
});

test('English and Portuguese have exact key and interpolation-token parity', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(pt).sort());
  for (const key of Object.keys(en)) {
    assert.ok(en[key]?.trim(), key);
    assert.ok(pt[key]?.trim(), key);
    const tokens = (value: string) => [...value.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();
    assert.deepEqual(tokens(en[key]!), tokens(pt[key]!), key);
  }
});

test('every dynamically generated measurement, region and chain key is translated', () => {
  const keys = lymphChains.flatMap((item) => [item.labelKey, item.noteKey,
    `lymph.kind.${item.measurement.kind}`, `lymph.measure.${item.measurement.kind}`]);
  keys.push(...lymphRegions.flatMap((region) => [
    `lymph.tools.${region}.title`, `lymph.tools.${region}.description`,
  ]));
  for (const key of keys) assert.ok(en[key] && pt[key], key);
});

test('registry exposes three switchable pages and a separate bibliography', () => {
  const module = moduleById('lymph');
  assert.equal(module.route, '/lymph');
  assert.equal(module.tools.length, 4);
  assert.deepEqual(switchableTools('lymph').map((tool) => tool.route),
    ['/lymph/cervical', '/lymph/thoracic', '/lymph/abdominal']);
  assert.equal(module.tools.find((tool) => tool.id === 'lymphReferences')?.kind, 'reference');
  for (const tool of module.tools) {
    assert.equal(toolByRoute(tool.route)?.module.id, 'lymph');
    assert.ok(en[tool.descriptionKey] && pt[tool.descriptionKey]);
    if (tool.kind !== 'reference') assert.ok(en[tool.titleKey] && pt[tool.titleKey]);
  }
  for (const key of [module.titleKey, module.descriptionKey, module.shortLabelKey, module.guidelineKey]) {
    assert.ok(en[key] && pt[key], key);
  }
});

test('all five Expo Router entry points export the intended screen', () => {
  const routes = { index: 'LymphHomeScreen', cervical: 'CervicalNodesScreen',
    thoracic: 'ThoracicNodesScreen', abdominal: 'AbdominalNodesScreen', references: 'LymphReferencesScreen' };
  for (const [route, screen] of Object.entries(routes)) {
    const path = join(process.cwd(), 'app', 'lymph', `${route}.tsx`);
    assert.ok(existsSync(path), path);
    assert.ok(readFileSync(path, 'utf8').includes(`${screen} as default`));
  }
});

test('chain search ignores case, surrounding whitespace and Portuguese accents', () => {
  assert.equal(normalizeLymphSearch('  RETROFARÍNGEOS  '), 'retrofaringeos');
  assert.equal(normalizeLymphSearch('Para-aórticos'), 'para-aorticos');
  assert.equal(normalizeLymphSearch('Subcarinal'), 'subcarinal');
  assert.equal(normalizeLymphSearch(''), '');
});
