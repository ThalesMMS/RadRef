import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEnhancement } from './enhancement.ts';

test('visual enhancement is sufficient', () => {
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: true }).status, 'confirmed');
});

test('CT quantitative enhancement thresholds', () => {
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: false, preContrast: 10, postContrast: 29.9 }).status, 'indeterminate');
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: false, preContrast: 10, postContrast: 30 }).status, 'confirmed');
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: false, preContrast: 10, postContrast: 19.9 }).status, 'notConfirmed');
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: false, preContrast: 10, postContrast: 20 }).status, 'indeterminate');
});

test('MRI quantitative enhancement threshold', () => {
  assert.equal(calculateEnhancement({ modality: 'mri', visuallyUnequivocal: false, preContrast: 100, postContrast: 114.9 }).status, 'notConfirmed');
  assert.equal(calculateEnhancement({ modality: 'mri', visuallyUnequivocal: false, preContrast: 100, postContrast: 115 }).status, 'confirmed');
  assert.equal(calculateEnhancement({ modality: 'mri', visuallyUnequivocal: false, preContrast: 0, postContrast: 20 }).status, 'insufficient');
});

test('missing quantitative values are insufficient', () => {
  assert.equal(calculateEnhancement({ modality: 'ct', visuallyUnequivocal: false }).status, 'insufficient');
});
