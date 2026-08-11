import test from 'node:test';
import assert from 'node:assert/strict';
import { assessThresholdGrowth, calculateLiRads, type LiRadsInput } from './liRads.ts';

const base: LiRadsInput = {
  ageYears: 60,
  riskBasis: 'cirrhosis',
  excludedCirrhosisEtiology: false,
  adequateExam: true,
  pathProven: false,
  treatedObservation: false,
  definitelyBenign: false,
  probablyBenign: false,
  tumorInVein: false,
  lrMFeatures: false,
  sizeMm: 15,
  aphe: 'nonrim',
  enhancingCapsule: false,
  nonperipheralWashout: false,
  thresholdGrowth: false,
  ancillaryDirection: 'none',
};

test('LI-RADS is not applied outside the adult high-risk population', () => {
  assert.equal(calculateLiRads({ ...base, ageYears: 17 }).category, 'notApplicable');
  assert.equal(calculateLiRads({ ...base, riskBasis: 'none' }).category, 'notApplicable');
  assert.equal(calculateLiRads({ ...base, excludedCirrhosisEtiology: true }).category, 'notApplicable');
});

test('image degradation or omission takes LR-NC before diagnostic table classification', () => {
  assert.equal(calculateLiRads({ ...base, adequateExam: false, tumorInVein: true }).category, 'LR-NC');
});

test('definite tumor in vein takes LR-TIV', () => {
  assert.equal(calculateLiRads({ ...base, tumorInVein: true }).category, 'LR-TIV');
});

test('LR-M features take LR-M before the major-feature table', () => {
  assert.equal(calculateLiRads({ ...base, lrMFeatures: true }).category, 'LR-M');
});

test('nonrim APHE 10-19 mm with washout is LR-5 in v2018', () => {
  assert.equal(calculateLiRads({ ...base, nonperipheralWashout: true }).category, 'LR-5');
});

test('nonrim APHE 10-19 mm with capsule alone is LR-4 diagonal cell', () => {
  assert.equal(calculateLiRads({ ...base, enhancingCapsule: true }).category, 'LR-4');
});

test('no APHE 20 mm or larger with one additional major feature is LR-4', () => {
  const result = calculateLiRads({ ...base, sizeMm: 25, aphe: 'none', enhancingCapsule: true });
  assert.equal(result.category, 'LR-4');
});

test('ancillary features can upgrade by one category but never to LR-5', () => {
  const lr3 = calculateLiRads({ ...base, ancillaryDirection: 'malignancy' });
  assert.equal(lr3.baseCategory, 'LR-3');
  assert.equal(lr3.category, 'LR-4');

  const lr4 = calculateLiRads({ ...base, sizeMm: 25, nonperipheralWashout: false, ancillaryDirection: 'malignancy' });
  assert.equal(lr4.category, 'LR-4');
});

test('threshold growth requires at least 50 percent growth within 6 months', () => {
  assert.equal(assessThresholdGrowth(15, 10, 6).meetsThreshold, true);
  assert.equal(assessThresholdGrowth(15, 10, 6.1).meetsThreshold, false);
  assert.equal(assessThresholdGrowth(14.9, 10, 6).meetsThreshold, false);
});
