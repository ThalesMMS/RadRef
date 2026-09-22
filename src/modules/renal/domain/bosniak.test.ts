import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adaptContentPattern,
  calculateBosniak,
  contentPatternsForAcquisition,
  type BosniakInput,
  type ImagingAcquisition,
} from './bosniak.ts';

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
  const enhancementOnNoncontrast = calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'ctMinus9To20', wallEnhances: true });
  assert.equal(enhancementOnNoncontrast.category, 'incomplete');
  assert.equal(enhancementOnNoncontrast.rationale[0]?.key, 'renal.bosniak.reason.enhancementOnNoncontrast');
});

test('content patterns offered per acquisition', () => {
  const acquisitions: readonly ImagingAcquisition[] = [
    'ctRenalMassProtocol',
    'ctNoncontrast',
    'ctPortalVenous',
    'ctOther',
    'mriRenalMassProtocol',
    'mriNoncontrast',
    'mriOther',
  ];
  for (const acquisition of acquisitions) {
    for (const specialContentPattern of contentPatternsForAcquisition(acquisition)) {
      const result = calc({ acquisition, specialContentPattern });
      assert.notEqual(result.reportSuggestion.key, 'renal.bosniak.report.incompatiblePattern', `${acquisition}/${specialContentPattern}`);
    }
  }
  assert.deepEqual(contentPatternsForAcquisition('mriRenalMassProtocol'), ['none', 'simpleFluid', 'mriT1MarkedHomogeneous', 'mriT1Heterogeneous']);
  assert.deepEqual(contentPatternsForAcquisition('ultrasound'), []);
  // The simple-fluid finding has one entry per acquisition.
  assert.equal(calc({ acquisition: 'mriRenalMassProtocol', specialContentPattern: 'mriT2CSFLike' }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'simpleFluid' }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'simpleFluid' }).category, 'incomplete');
});

test('content pattern follows acquisition changes', () => {
  assert.equal(adaptContentPattern('simpleFluid', 'mriRenalMassProtocol'), 'simpleFluid');
  assert.equal(adaptContentPattern('simpleFluid', 'mriNoncontrast'), 'mriT2CSFLike');
  assert.equal(adaptContentPattern('simpleFluid', 'ctNoncontrast'), 'ctMinus9To20');
  assert.equal(adaptContentPattern('mriT2CSFLike', 'mriRenalMassProtocol'), 'simpleFluid');
  assert.equal(adaptContentPattern('ctMinus9To20', 'ctRenalMassProtocol'), 'simpleFluid');
  assert.equal(adaptContentPattern('mriT1MarkedHomogeneous', 'mriRenalMassProtocol'), 'mriT1MarkedHomogeneous');
  assert.equal(adaptContentPattern('ctAtLeast70', 'mriRenalMassProtocol'), 'none');
  assert.equal(adaptContentPattern('mriT1Heterogeneous', 'ctRenalMassProtocol'), 'none');
  assert.equal(adaptContentPattern('mriT1Heterogeneous', 'ultrasound'), 'mriT1Heterogeneous');
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
  assert.equal(calc({
    acquisition: 'mriRenalMassProtocol',
    specialContentPattern: 'mriT1Heterogeneous',
    homogeneous: false,
    protrusionMargin: 'obtuse',
    protrusionSizeMm: 5,
    protrusionEnhances: true,
  }).category, 'IV');
  assert.equal(calc({ wallThicknessMm: 2.1, wallEnhances: true }).category, 'IIF');
  assert.equal(calc({ wallThicknessMm: 3.9, wallEnhances: true }).category, 'IIF');
  assert.equal(calc({ septaCount: 1, maxSeptalThicknessMm: 3, septaEnhance: true }).category, 'IIF');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'IIF');
});

test('Bosniak I simple cyst', () => {
  assert.equal(calc({}).category, 'I');
  assert.equal(calc({ wallEnhances: true }).category, 'I');
  assert.equal(calc({ acquisition: 'mriRenalMassProtocol' }).category, 'I');
  assert.equal(calc({ acquisition: 'ctPortalVenous' }).category, 'I');
  assert.equal(calc({ acquisition: 'ctPortalVenous', septaCount: 1, maxSeptalThicknessMm: 1 }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'ctOther' }).category, 'incomplete');
});

test('heterogeneous masses on noncontrast MRI need a renal mass protocol', () => {
  const heterogeneousT1 = calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'mriT1Heterogeneous', homogeneous: false });
  assert.equal(heterogeneousT1.category, 'incomplete');
  assert.equal(heterogeneousT1.rationale[0]?.key, 'renal.bosniak.reason.heterogeneousNoncontrastMri');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'none', homogeneous: false }).category, 'incomplete');
  assert.equal(calc({ acquisition: 'mriOther', specialContentPattern: 'mriT1Heterogeneous', homogeneous: false }).category, 'IIF');
});

test('Bosniak II special homogeneous patterns', () => {
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'ctMinus9To20' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctNoncontrast', specialContentPattern: 'ctAtLeast70' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctRenalMassProtocol', specialContentPattern: 'ctOver20Nonenhancing' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctPortalVenous', specialContentPattern: 'ctPortal21To30' }).category, 'II');
  assert.equal(calc({ acquisition: 'ctOther', specialContentPattern: 'ctTooSmallLowAttenuation' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'mriT2CSFLike' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriOther', specialContentPattern: 'mriT2CSFLike' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriNoncontrast', specialContentPattern: 'mriT1MarkedHomogeneous' }).category, 'II');
  assert.equal(calc({ acquisition: 'mriRenalMassProtocol', specialContentPattern: 'mriT1MarkedHomogeneous' }).category, 'II');
});

test('Bosniak II septa and calcification rules', () => {
  assert.equal(calc({ septaCount: 3, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'II');
  const fewNonenhancingCt = calc({ septaCount: 3, maxSeptalThicknessMm: 2, septaEnhance: false });
  assert.equal(fewNonenhancingCt.category, 'II');
  assert.ok(fewNonenhancingCt.rationale.some((reason) => reason.key === 'renal.bosniak.reason.classIIFewNonenhancingSeptaCt'));
  assert.equal(calc({ acquisition: 'mriRenalMassProtocol', septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: false }).category, 'II');
  assert.equal(calc({ calcification: 'present' }).category, 'II');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: true }).category, 'IIF');
});

test('many nonenhancing septa at CT need MRI before a class', () => {
  const manyNonenhancingCt = calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: false });
  assert.equal(manyNonenhancingCt.category, 'incomplete');
  assert.equal(manyNonenhancingCt.rationale[0]?.key, 'renal.bosniak.reason.manyNonenhancingSeptaCt');
  assert.equal(manyNonenhancingCt.reportSuggestion.key, 'renal.bosniak.report.heterogeneousCt');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: false, calcification: 'present' }).category, 'incomplete');
  assert.equal(calc({ septaCount: 4, maxSeptalThicknessMm: 2, septaEnhance: false, wallThicknessMm: 3, wallEnhances: true }).category, 'IIF');
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
