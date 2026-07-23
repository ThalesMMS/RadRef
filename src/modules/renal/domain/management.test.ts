import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBosniakManagement } from './management.ts';

test('Bosniak I and II require no routine imaging follow-up', () => {
  assert.equal(calculateBosniakManagement({ category: 'I', symptomatic: false, significantComorbidityOrLimitedLifeExpectancy: false, targetableSolidComponent: false }).primary.key, 'renal.management.classIOrII.primary');
  assert.equal(calculateBosniakManagement({ category: 'II', symptomatic: true, significantComorbidityOrLimitedLifeExpectancy: false, targetableSolidComponent: false }).primary.key, 'renal.management.classIOrII.symptomaticPrimary');
});

test('Bosniak IIF uses CUA 2023 five-year surveillance framework', () => {
  const result = calculateBosniakManagement({ category: 'IIF', symptomatic: false, significantComorbidityOrLimitedLifeExpectancy: false, targetableSolidComponent: false });
  assert.equal(result.primary.key, 'renal.management.classIIF.primary');
  assert.equal(result.followUp?.key, 'renal.management.classIIF.followUp');
});

test('Bosniak III/IV management size thresholds', () => {
  const common = { category: 'III' as const, symptomatic: false, significantComorbidityOrLimitedLifeExpectancy: false, targetableSolidComponent: false };
  assert.equal(calculateBosniakManagement({ ...common }).primary.key, 'renal.management.classIIIIV.sizeRequired');
  assert.equal(calculateBosniakManagement({ ...common, lesionSizeMm: 20 }).primary.key, 'renal.management.classIIIIV.le20Primary');
  assert.equal(calculateBosniakManagement({ ...common, lesionSizeMm: 20.1 }).primary.key, 'renal.management.classIIIIV.20to40Primary');
  assert.equal(calculateBosniakManagement({ ...common, lesionSizeMm: 40 }).primary.key, 'renal.management.classIIIIV.20to40Primary');
  assert.equal(calculateBosniakManagement({ ...common, lesionSizeMm: 40.1 }).primary.key, 'renal.management.classIIIIV.gt40Primary');
});

test('major comorbidity overrides size toward observation', () => {
  const result = calculateBosniakManagement({ category: 'IV', lesionSizeMm: 60, symptomatic: false, significantComorbidityOrLimitedLifeExpectancy: true, targetableSolidComponent: true });
  assert.equal(result.primary.key, 'renal.management.classIIIIV.comorbidityPrimary');
});

test('class IV targetable component adds biopsy note', () => {
  const result = calculateBosniakManagement({ category: 'IV', lesionSizeMm: 30, symptomatic: false, significantComorbidityOrLimitedLifeExpectancy: false, targetableSolidComponent: true });
  assert.ok(result.notes.some((note) => note.key === 'renal.management.classIV.biopsyTarget'));
});
