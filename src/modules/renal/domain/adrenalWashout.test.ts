import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAdrenalWashout } from './adrenalWashout.ts';

test('unenhanced attenuation <= 10 HU is diagnostic of lipid-rich adenoma', () => {
  const result = calculateAdrenalWashout({ preContrast: 8 });
  assert.equal(result.status, 'lipidRichAdenoma');
  assert.equal(result.code, 'Adenoma');
  assert.equal(result.severity, 'low');
  assert.equal(result.metric, '8.0 HU');
});

test('unenhanced attenuation <= 10 HU with negative HU (e.g. -5 HU)', () => {
  const result = calculateAdrenalWashout({ preContrast: -5 });
  assert.equal(result.status, 'lipidRichAdenoma');
  assert.equal(result.severity, 'low');
});

test('missing early or delayed phase returns insufficient data', () => {
  const result = calculateAdrenalWashout({ preContrast: 25, earlyContrast: 80 });
  assert.equal(result.status, 'insufficientData');
  assert.equal(result.severity, 'neutral');
});

test('insufficient enhancement when early minus pre is less than 10 HU', () => {
  const result = calculateAdrenalWashout({
    preContrast: 20,
    earlyContrast: 26,
    delayedContrast: 22,
  });
  assert.equal(result.status, 'insufficientEnhancement');
  assert.equal(result.code, 'Δ < 10 HU');
  assert.equal(result.severity, 'neutral');
});

test('APW >= 60% indicates lipid-poor adenoma washout', () => {
  // Pre 35 HU, Early 100 HU, Delayed 50 HU -> APW = (100 - 50) / (100 - 35) = 50 / 65 = 76.9%
  const result = calculateAdrenalWashout({
    preContrast: 35,
    earlyContrast: 100,
    delayedContrast: 50,
  });
  assert.equal(result.status, 'adenoma');
  assert.equal(result.code, 'Adenoma (APW)');
  assert.equal(result.severity, 'low');
  assert.equal(result.apwPercent, 76.9);
});

test('APW < 60% indicates non-adenoma / indeterminate washout', () => {
  // Pre 35 HU, Early 100 HU, Delayed 80 HU -> APW = (100 - 80) / (100 - 35) = 20 / 65 = 30.8%
  const result = calculateAdrenalWashout({
    preContrast: 35,
    earlyContrast: 100,
    delayedContrast: 80,
  });
  assert.equal(result.status, 'nonAdenoma');
  assert.equal(result.code, 'Indeterminate');
  assert.equal(result.severity, 'moderate');
  assert.equal(result.apwPercent, 30.8);
});

test('RPW without pre-contrast >= 40% indicates adenoma washout', () => {
  // Early 100 HU, Delayed 55 HU -> RPW = (100 - 55) / 100 = 45%
  const result = calculateAdrenalWashout({
    earlyContrast: 100,
    delayedContrast: 55,
  });
  assert.equal(result.status, 'adenoma');
  assert.equal(result.code, 'Adenoma (RPW)');
  assert.equal(result.severity, 'low');
  assert.equal(result.rpwPercent, 45);
});

test('RPW without pre-contrast < 40% indicates non-adenoma washout', () => {
  // Early 100 HU, Delayed 75 HU -> RPW = (100 - 75) / 100 = 25%
  const result = calculateAdrenalWashout({
    earlyContrast: 100,
    delayedContrast: 75,
  });
  assert.equal(result.status, 'nonAdenoma');
  assert.equal(result.code, 'Indeterminate');
  assert.equal(result.severity, 'moderate');
  assert.equal(result.rpwPercent, 25);
});

test('large mass >= 40 mm triggers adrenal carcinoma warning', () => {
  const result = calculateAdrenalWashout({
    preContrast: 35,
    earlyContrast: 100,
    delayedContrast: 50,
    sizeMm: 45,
  });
  assert.equal(result.status, 'adenoma');
  assert.ok(result.warnings.length > 0);
  assert.equal(result.warnings[0]?.key, 'renal.adrenal.warning.largeMass');
});
