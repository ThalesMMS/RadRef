import { moduleById, switchableTools, toolByRoute } from '../../core/moduleRegistry.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  examKey, examRoute, measurementKey, normalizeUltrasoundSearch, searchUltrasoundMeasurements,
  ultrasoundExams, ultrasoundMeasurements, ultrasoundSources, ultrasoundReviewedOn,
  ultrasoundExamById, ultrasoundSourceById,
} from './catalog.ts';
import { ultrasoundEn, ultrasoundPt, ultrasoundMeasurementFields } from './i18n.ts';

const unique = (items: readonly string[]) => new Set(items).size === items.length;
const entry = (id: string) => {
  const item = ultrasoundMeasurements.find((candidate) => candidate.id === id);
  assert.ok(item, `missing measurement ${id}`);
  return item;
};

test('ultrasound has 11 distinct exam sections and unique measurement/source ids', () => {
  assert.equal(ultrasoundExams.length, 11);
  assert.ok(unique(ultrasoundExams.map((exam) => exam.id)));
  assert.ok(unique(ultrasoundMeasurements.map((item) => item.id)));
  assert.ok(unique(ultrasoundSources.map((source) => source.id)));
  for (const exam of ultrasoundExams) {
    assert.ok(ultrasoundMeasurements.filter((item) => item.examId === exam.id).length >= 2);
    assert.equal(ultrasoundExamById(exam.id), exam);
  }
});

test('every measurement has populated bilingual values, population, method and cautions', () => {
  for (const item of ultrasoundMeasurements) {
    assert.ok(ultrasoundExams.some((exam) => exam.id === item.examId));
    for (const field of ultrasoundMeasurementFields) {
      for (const language of ['en', 'pt'] as const) assert.ok(item[field][language].trim(), `${item.id}.${field}.${language}`);
    }
    assert.ok(item.sourceIds.length > 0);
    assert.ok(unique(item.sourceIds));
    for (const id of item.sourceIds) assert.equal(ultrasoundSourceById(id).id, id);
  }
});

test('source links are HTTPS, versioned and referenced by at least one entry', () => {
  assert.match(ultrasoundReviewedOn, /^\d{4}-\d{2}-\d{2}$/);
  for (const source of ultrasoundSources) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.match(source.year, /20\d{2}/);
    assert.ok(source.title.length > 10);
    assert.ok(ultrasoundMeasurements.some((item) => item.sourceIds.includes(source.id)));
  }
});

test('every exam has a concrete Expo Router wrapper bound to the correct exam', () => {
  for (const exam of ultrasoundExams) {
    const path = join(process.cwd(), 'app', `${examRoute(exam.id)}.tsx`);
    assert.ok(existsSync(path), path);
    assert.ok(readFileSync(path, 'utf8').includes(`examId="${exam.id}"`));
  }
  assert.ok(existsSync('app/ultrasound/index.tsx'));
  assert.ok(existsSync('app/ultrasound/references.tsx'));
});

test('English and Portuguese have exact key and interpolation parity', () => {
  assert.deepEqual(Object.keys(ultrasoundEn).sort(), Object.keys(ultrasoundPt).sort());
  for (const key of Object.keys(ultrasoundEn)) {
    const en = ultrasoundEn[key];
    const pt = ultrasoundPt[key];
    assert.ok(en?.trim(), key);
    assert.ok(pt?.trim(), key);
    assert.deepEqual((en ?? '').match(/{{[^}]+}}/g), (pt ?? '').match(/{{[^}]+}}/g), key);
  }
});

test('all computed catalog translation keys are present in both dictionaries', () => {
  for (const dictionary of [ultrasoundEn, ultrasoundPt]) {
    for (const exam of ultrasoundExams) {
      assert.ok(dictionary[examKey(exam.id, 'title')]);
      assert.ok(dictionary[examKey(exam.id, 'description')]);
    }
    for (const item of ultrasoundMeasurements) {
      for (const field of ultrasoundMeasurementFields) assert.ok(dictionary[measurementKey(item.id, field)]);
      assert.ok(dictionary[`ultrasound.kind.${item.kind}`]);
    }
  }
});

test('search normalizes accents, case, Unicode decomposition and whitespace', () => {
  assert.equal(normalizeUltrasoundSearch('  PRÓSTATA  \n  FÉRTIL  '), 'prostata fertil');
  assert.equal(normalizeUltrasoundSearch('Pro\u0301stata'), 'prostata');
  assert.deepEqual(searchUltrasoundMeasurements('prostata', 'pt'), searchUltrasoundMeasurements('  PRÓSTATA ', 'pt'));
  assert.ok(searchUltrasoundMeasurements('pancreatico', 'pt').some((item) => item.id === 'pancreatic-duct'));
});

test('empty and whitespace-only searches return all entries without modifying order', () => {
  assert.deepEqual(searchUltrasoundMeasurements('', 'en'), ultrasoundMeasurements);
  assert.deepEqual(searchUltrasoundMeasurements('  \n ', 'pt'), ultrasoundMeasurements);
  assert.notEqual(searchUltrasoundMeasurements('', 'en'), ultrasoundMeasurements);
});

test('exam filtering applies before search and never leaks another exam', () => {
  for (const exam of ultrasoundExams) {
    const results = searchUltrasoundMeasurements('', 'pt', exam.id);
    assert.ok(results.length >= 2);
    assert.ok(results.every((item) => item.examId === exam.id));
  }
  assert.deepEqual(searchUltrasoundMeasurements('prostate', 'en', 'thyroid'), []);
});

test('search matches the selected language and all query words', () => {
  assert.ok(searchUltrasoundMeasurements('cortical renal', 'pt').some((item) => item.id === 'renal-cortex'));
  assert.ok(searchUltrasoundMeasurements('median nerve', 'en').some((item) => item.id === 'median-nerve'));
  assert.deepEqual(searchUltrasoundMeasurements('median nonexistentword', 'en'), []);
  assert.deepEqual(searchUltrasoundMeasurements('zzzznotameasurement', 'pt'), []);
});

test('diagnostic thresholds are not labeled as ordinary normal reference ranges', () => {
  for (const id of ['scrotal-vein', 'scrotal-reflux', 'pyloric-muscle', 'ovarian-volume', 'axillary-cortex', 'carotid-reference', 'aortic-diameter']) {
    assert.equal(entry(id).kind, 'criterion');
  }
  assert.equal(entry('median-nerve').kind, 'mean');
  assert.equal(entry('testis-volume').kind, 'formula');
});

test('ACOG 2026 safety context accompanies the historical 4-mm threshold', () => {
  const item = entry('endometrium');
  assert.equal(item.kind, 'context');
  assert.ok(item.sourceIds.includes('acog2026'));
  assert.match(item.value.en, /does not exclude/);
  assert.match(item.value.pt, /não exclui/);
  assert.match(item.caution.en, /2026.*tissue sampling/);
});

test('carotid low velocities require a composite no-plaque interpretation', () => {
  const item = entry('carotid-reference');
  assert.match(item.value.en, /<180.*<40.*<2.*no plaque/);
  assert.match(item.caution.en, /near-occlusion/);
  assert.match(item.caution.en, /not for stents/);
});

test('formula, pediatric and fetal contexts do not imply implemented calculators', () => {
  assert.match(entry('testis-volume').value.en, /0\.71.*cm → mL/);
  assert.match(entry('testis-volume').caution.en, /0\.52/);
  assert.equal(entry('pediatric-renal-length').kind, 'context');
  assert.match(entry('pediatric-renal-length').caution.en, /No adult/);
  assert.match(entry('fetal-biometry').caution.en, /does not implement/);
});

test('the registry exposes each exam to navigation, global discovery and favorites', () => {
  const module = moduleById('ultrasound');
  assert.equal(module.route, '/ultrasound');
  assert.equal(switchableTools('ultrasound').length, ultrasoundExams.length);
  for (const exam of ultrasoundExams) {
    const found = toolByRoute(examRoute(exam.id));
    assert.equal(found?.module.id, 'ultrasound');
    assert.equal(found?.tool.titleKey, examKey(exam.id, 'title'));
    assert.ok(ultrasoundEn[found!.tool.descriptionKey]);
  }
  assert.equal(toolByRoute('/ultrasound/references')?.tool.kind, 'reference');
});

test('literal ultrasound UI keys resolve and new screens contain no untranslated text nodes', () => {
  const source = readFileSync('src/modules/ultrasound/screens.tsx', 'utf8');
  const keys = [...source.matchAll(/(?:titleKey|subtitleKey|headerKey|textKey)="([^"]+)"|\bt\('([^']+)'/g)];
  for (const match of keys) {
    const key = match[1] ?? match[2];
    assert.ok(key);
    assert.ok(ultrasoundEn[key], key);
    assert.ok(ultrasoundPt[key], key);
  }
  assert.deepEqual(source.match(/<Text[^>]*>\s*[A-Za-zÀ-ÿ][^<{]*<\/Text>/g) ?? [], []);
});
