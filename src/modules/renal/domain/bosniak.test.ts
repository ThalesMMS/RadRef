import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBosniak, type BosniakInput } from './bosniak.ts';

const base: BosniakInput = {
  acquisition: 'ctRenalMassProtocol',
  cysticMassConfirmed: true,
  enhancingTissuePercent: 0,
  suspectedInfectiousInflammatoryOrVascular: false,
  hereditaryRenalCancerSyndrome: false,
  wellDefined: true,
  homogeneous: true,
  specialContentPattern: 'simpleFluid',
  wallThicknessMm: 1,
  wallSmooth: true,
  wallEnhances: false,
  septaCount: 0,
  maxSeptalThicknessMm: 1,
  septaSmooth: true,
  septaEnhance: false,
  calcification: 'none',
  protrusionMargin: 'none',
  protrusionSizeMm: 0,
  protrusionEnhances: false,
  symptomatic: false,
  significantComorbidityOrLimitedLifeExpectancy: false,
  targetableSolidComponent: false,
};

function calc(overrides: Partial<BosniakInput>) {
  return calculateBosniak({ ...base, ...overrides });
}

test('applicability guardrails', () => {
  assert.equal(calc({ acquisition: 'ultrasound' }).category, 'incomplete');
  assert.equal(calc({ hereditaryRenalCancerSyndrome: true }).category, 'notApplicable');
  assert.equal(calc({ suspectedInfectiousInflammatoryOrVascular: true }).category, 'notApplicable');
  assert.equal(calc({ cysticMassConfirmed: false }).category, 'incomplete');
  assert.equal(calc({ enhancingTissuePercent: 25 }).category, 'notApplicable');
  assert.equal(calc({ enhancingTissuePercent: 24.9 }).category, 'I');
});

test('measurement validation and acquisition-content compatibility', () => {
  assert.equal(calc({ lesionSizeMm: -1 }).category, 'incomplete');
  assert.equal(calc({ wallThicknessMm: -1 }).category, 'incomplete');
  assert.equal(calc({ septaCount: -1 }).category, 'incomplete');
  assert.equal(calc({ maxSeptalThicknessMm: -1 }).category, 'incomplete');
  assert.equal(calc({ protrusionSizeMm: -1 }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'mriT2CSFLike' }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'ctNoncontrast', wallEnhances: true }).category, 'incomplete');
});

test('Bosniak IV protrusion criteria', () => {
  assert.equal(calc({ protrusionMargin: 'acute', protrusionSizeMm: 1, protrusionEnhances: true }).category, 'IV');
  assert.equal(calc({ protrusionMargin: 'obtuse', protrusionSizeMm: 4, protrusionEnhances: true }).category, 'IV');
  assert.equal(calc({ protrusionMargin: 'obtuse', protrusionSizeMm: 3.9, protrusionEnhances: true }).category, 'III');
});

test('Bosniak III wall and septal criteria', () => {
  assert.equal(calc({ wallThicknessMm: 4, wallEnhances: true }).category, 'III');
  assert.equal(calc({ wallThicknessMm: 2, wallSmooth: false, wallEnhances: true }).category, 'III');
  assert.equal(calc({ septaCount: 1, maxSeptalThicknessMm: 4, septaEnhance: true }).category, 'III');
  assert.equal(calc({ septaCount: 1, septaSmooth: false, septaEnhance: true }).category, 'III');
});

test('calcification and heterogeneous CT safety guards', () => {
  assert.equal(calc({ calcification: 'abundantThickOrNodular' }).category, 'incomplete');
  assert.equal(calc({ homogeneous: false }).category, 'incomplete');
  assert.equal(calc({ homogeneous: false, wallThicknessMm: 4, wallEnhances: true }).category, 'III');
});

test('Bosniak IIF criteria', () => {
  assert.equal(calc({ acquisition: 'mriRenalMassProtocol', specialContentPattern: 'mriT1Heterogeneous', homogeneous: false }).category, 'IIF');
  assert.equal(calc({ wallThicknessMm: 2.1, wallEnhances: true }).category, 'IIF');
  assert.equal(calc({ wallThicknessMm: 3.9, wallEnhances: true }).category, 'IIF');
  assert.equal(calc({ septaCount: 1, maxSeptalThicknessMm: 3, septaEnhance: true }).category, 'IIF');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'IIF');
});

test('Bosniak I simple cyst', () => {
  assert.equal(calc({}).category, 'I');
  assert.equal(calc({ wallEnhances: true }).category, 'I');
  assert.equal(calc({ acquisition: 'ctOther' }).category, 'incomplete');
});

test('Bosniak II special homogeneous patterns', () => {
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'ctMinus9To20' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'ctAtLeast70' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctRenalMassProtocol', specialContentPattern: 'ctOver20Nonenhancing' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctPortalVenous', specialContentPattern: 'ctPortal21To30' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctOther', specialContentPattern: 'ctTooSmallLowAttenuation' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'mriT2CSFLike' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'mriT1MarkedHomogeneous' }).category, 'II');
});

test('Bosniak II septa and calcification rules', () => {
  assert.equal(calc({ septaCount: 3, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'II');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: false }).category, 'II');
  assert.equal(calc({ calcification: 'present' }).category, 'II');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'IIF');
});

test('nonstandard nonenhancing thick structures remain incomplete', () => {
  assert.equal(calc({ wallThicknessMm: 3, wallEnhances: false }).category, 'incomplete');
  assert.equal(calc({ septaCount: 1, maxSeptalThicknessMm: 3, septaEnhance: false }).category, 'incomplete');
});

test('classification and management remain separate', () => {
  const result = calc({ wallThicknessMm: 4, wallEnhances: true, lesionSizeMm: 20 });
  assert.equal(result.category, 'III');
  assert.equal(result.management.primary.key, 'renal.management.classIIIIV.le20Primary');
});
