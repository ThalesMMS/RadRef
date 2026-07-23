import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBrock, type BrockInput } from './brock.ts';

const base: BrockInput = {
  ageYears: 65,
  sex: 'male',
  familyHistoryLungCancer: false,
  emphysema: false,
  diameterMm: 10,
  noduleType: 'solid',
  upperLobe: false,
  noduleCount: 1,
  spiculation: false,
};

function calc(overrides: Partial<BrockInput>) {
  return calculateBrock({ ...base, ...overrides });
}

function close(actual: number | undefined, expected: number) {
  assert.notEqual(actual, undefined);
  assert.ok(Math.abs((actual ?? 0) - expected) < 0.0001, `${actual} vs ${expected}`);
}

test('Brock regression vectors match the Swift source', () => {
  close(calc({ ageYears: 55, diameterMm: 4, noduleCount: 4 }).probabilityPercent, 0.092011);
  close(calc({ ageYears: 68, sex: 'female', diameterMm: 10, upperLobe: true, noduleCount: 2, familyHistoryLungCancer: true }).probabilityPercent, 14.588653);
  close(calc({ ageYears: 80, sex: 'female', diameterMm: 30, noduleType: 'partSolid', upperLobe: true, noduleCount: 1, spiculation: true, familyHistoryLungCancer: true, emphysema: true }).probabilityPercent, 91.535942);
});

test('Brock morphology coefficients remain stable', () => {
  close(calc({ noduleType: 'nonSolid' }).probabilityPercent, 3.065470);
  close(calc({ noduleType: 'solid' }).probabilityPercent, 3.468206);
  close(calc({ noduleType: 'partSolid' }).probabilityPercent, 4.977268);
});

test('Brock published formula example remains stable', () => {
  close(calc({ ageYears: 70, sex: 'female', diameterMm: 4, upperLobe: true }).probabilityPercent, 0.634830);
});

test('Brock rejects inputs outside its implemented range', () => {
  assert.equal(calc({ ageYears: 17 }).valid, false);
  assert.equal(calc({ diameterMm: 2.9 }).valid, false);
  assert.equal(calc({ diameterMm: 30.1 }).valid, false);
  assert.equal(calc({ noduleCount: 0 }).valid, false);
});

test('Brock operational risk strata', () => {
  assert.equal(calc({ ageYears: 55, diameterMm: 4, noduleCount: 4 }).stratum, 'low');
  assert.equal(calc({ ageYears: 68, sex: 'female', upperLobe: true, noduleCount: 2, familyHistoryLungCancer: true }).stratum, 'intermediate');
  assert.equal(calc({ ageYears: 80, sex: 'female', diameterMm: 30, noduleType: 'partSolid', upperLobe: true, spiculation: true, familyHistoryLungCancer: true, emphysema: true }).stratum, 'high');
});

test('more nodules lowers risk in the published Brock coefficient', () => {
  const one = calc({ noduleCount: 1 }).probabilityPercent ?? 0;
  const five = calc({ noduleCount: 5 }).probabilityPercent ?? 0;
  const ten = calc({ noduleCount: 10 }).probabilityPercent ?? 0;
  assert.ok(one > five && five > ten);
});
