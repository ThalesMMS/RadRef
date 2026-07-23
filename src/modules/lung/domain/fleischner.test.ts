import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFleischner, type FleischnerInput } from './fleischner.ts';

const base: FleischnerInput = {
  noduleType: 'solid',
  sizeMm: 5,
  risk: 'low',
  multiple: false,
};

function calc(overrides: Partial<FleischnerInput>) {
  return calculateFleischner({ ...base, ...overrides });
}

test('single solid thresholds and risk branches', () => {
  assert.equal(calc({ sizeMm: 5, risk: 'low' }).recommendation.key, 'lung.fleischner.rec.singleSolidLt6Low');
  assert.equal(calc({ sizeMm: 5, risk: 'high' }).recommendation.key, 'lung.fleischner.rec.singleSolidLt6High');
  assert.equal(calc({ sizeMm: 6, risk: 'low' }).recommendation.key, 'lung.fleischner.rec.singleSolid6to8Low');
  assert.equal(calc({ sizeMm: 8, risk: 'high' }).recommendation.key, 'lung.fleischner.rec.singleSolid6to8High');
  assert.equal(calc({ sizeMm: 9 }).recommendation.key, 'lung.fleischner.rec.singleSolidGt8');
});

test('rounding changes the Fleischner size band at half millimeter', () => {
  assert.equal(calc({ sizeMm: 5.4 }).sizeBand, 'lt6');
  assert.equal(calc({ sizeMm: 5.5 }).sizeBand, '6to8');
  assert.equal(calc({ sizeMm: 8.4 }).sizeBand, '6to8');
  assert.equal(calc({ sizeMm: 8.5 }).sizeBand, 'gt8');
});

test('single ground-glass rules', () => {
  assert.equal(calc({ noduleType: 'ggo', sizeMm: 5 }).recommendation.key, 'lung.fleischner.rec.singleGgoLt6');
  assert.equal(calc({ noduleType: 'ggo', sizeMm: 6 }).recommendation.key, 'lung.fleischner.rec.singleGgoGe6');
});

test('single part-solid rules use solid component thresholds', () => {
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 5, solidComponentMm: 2 }).recommendation.key, 'lung.fleischner.rec.singlePartSolidLt6');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 10, solidComponentMm: 5 }).recommendation.key, 'lung.fleischner.rec.singlePartSolidSolidLt6');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 10, solidComponentMm: 6 }).recommendation.key, 'lung.fleischner.rec.singlePartSolidSolid6to8');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 12, solidComponentMm: 9 }).recommendation.key, 'lung.fleischner.rec.singlePartSolidSolidGt8');
});

test('multiple nodule rules are preserved', () => {
  assert.equal(calc({ multiple: true, sizeMm: 5, risk: 'low' }).recommendation.key, 'lung.fleischner.rec.multipleSolidLt6Low');
  assert.equal(calc({ multiple: true, sizeMm: 6, risk: 'high' }).recommendation.key, 'lung.fleischner.rec.multipleSolidGe6High');
  assert.equal(calc({ multiple: true, noduleType: 'ggo', sizeMm: 5 }).recommendation.key, 'lung.fleischner.rec.multipleGgoLt6');
  assert.equal(calc({ multiple: true, noduleType: 'partSolid', sizeMm: 8, solidComponentMm: 3 }).recommendation.key, 'lung.fleischner.rec.multiplePartSolid');
});

test('invalid measurements are blocked', () => {
  assert.equal(calc({ sizeMm: 0 }).recommendation.key, 'validation.positiveNoduleSize');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 8, solidComponentMm: -1 }).recommendation.key, 'validation.nonNegativeSolidComponent');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 8, solidComponentMm: 9 }).recommendation.key, 'validation.solidNotGreaterThanTotal');
});
