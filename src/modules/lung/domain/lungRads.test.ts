import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assessLungRadsGrowth,
  calculateLungRads,
  equivalentDiameterFromVolume,
  volumeFromDiameter,
  type LungRadsInput,
} from './lungRads.ts';

const base: LungRadsInput = {
  noduleType: 'solid',
  ctStatus: 'baseline',
  noduleStatus: 'baseline',
  sizeMm: 5,
  useVolume: false,
  solidComponentGrowth: false,
  benignCalcification: false,
  macroscopicFat: false,
  inflammatoryFindings: false,
  additionalSuspiciousFeatures: false,
  sModifier: false,
  multiple: false,
  benignJuxtapleuralMorphology: true,
  airwayLocation: 'subsegmental',
  benignAirwaySecretionFeatures: false,
  atypicalCystMorphology: 'thickWalled',
  atypicalCystChange: 'baselineOrNew',
};

function calc(overrides: Partial<LungRadsInput>) {
  return calculateLungRads({ ...base, ...overrides });
}

test('Lung-RADS category 0 and category 1 overrides', () => {
  assert.equal(calc({ ctStatus: 'incomplete' }).category, '0');
  assert.equal(calc({ ctStatus: 'awaitingComparison' }).category, '0');
  assert.equal(calc({ noduleType: 'none' }).category, '1');
  assert.equal(calc({ benignCalcification: true }).category, '1');
  assert.equal(calc({ macroscopicFat: true }).category, '1');
  assert.equal(calc({ inflammatoryFindings: true }).category, '0');
});

test('baseline solid thresholds', () => {
  assert.equal(calc({ sizeMm: 5.9 }).category, '2');
  assert.equal(calc({ sizeMm: 6 }).category, '3');
  assert.equal(calc({ sizeMm: 7.9 }).category, '3');
  assert.equal(calc({ sizeMm: 8 }).category, '4A');
  assert.equal(calc({ sizeMm: 14.9 }).category, '4A');
  assert.equal(calc({ sizeMm: 15 }).category, '4B');
});

test('new solid thresholds', () => {
  assert.equal(calc({ noduleStatus: 'new', sizeMm: 3.9 }).category, '2');
  assert.equal(calc({ noduleStatus: 'new', sizeMm: 4 }).category, '3');
  assert.equal(calc({ noduleStatus: 'new', sizeMm: 6 }).category, '4A');
  assert.equal(calc({ noduleStatus: 'new', sizeMm: 8 }).category, '4B');
});

test('growing and stepped solid rules', () => {
  assert.equal(calc({ ctStatus: 'followUp', noduleStatus: 'growing', sizeMm: 7.9 }).category, '4A');
  assert.equal(calc({ ctStatus: 'followUp', noduleStatus: 'growing', sizeMm: 8 }).category, '4B');
  const stableThree = calc({ ctStatus: 'followUp', noduleStatus: 'stable', sizeMm: 6 });
  assert.equal(stableThree.category, '2');
  assert.equal(stableThree.baseCategory, '3');
  const stableFourA = calc({ ctStatus: 'followUp', noduleStatus: 'stable', sizeMm: 8 });
  assert.equal(stableFourA.category, '3');
  assert.equal(stableFourA.baseCategory, '4A');
});

test('part-solid baseline, new and growth thresholds', () => {
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 5.9, solidComponentMm: 2 }).category, '2');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 6, solidComponentMm: 5.9 }).category, '3');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 10, solidComponentMm: 6 }).category, '4A');
  assert.equal(calc({ noduleType: 'partSolid', sizeMm: 10, solidComponentMm: 8 }).category, '4B');
  assert.equal(calc({ noduleType: 'partSolid', noduleStatus: 'new', sizeMm: 5.9, solidComponentMm: 2 }).category, '3');
  assert.equal(calc({ noduleType: 'partSolid', noduleStatus: 'new', sizeMm: 8, solidComponentMm: 3.9 }).category, '4A');
  assert.equal(calc({ noduleType: 'partSolid', noduleStatus: 'new', sizeMm: 8, solidComponentMm: 4 }).category, '4B');
  assert.equal(calc({ noduleType: 'partSolid', ctStatus: 'followUp', noduleStatus: 'growing', sizeMm: 8, solidComponentMm: 3.9, solidComponentGrowth: true }).category, '4A');
  assert.equal(calc({ noduleType: 'partSolid', ctStatus: 'followUp', noduleStatus: 'growing', sizeMm: 8, solidComponentMm: 4, solidComponentGrowth: true }).category, '4B');
});

test('ground-glass thresholds', () => {
  assert.equal(calc({ noduleType: 'ggo', sizeMm: 29.9 }).category, '2');
  assert.equal(calc({ noduleType: 'ggo', sizeMm: 30 }).category, '3');
  assert.equal(calc({ noduleType: 'ggo', ctStatus: 'followUp', noduleStatus: 'stable', sizeMm: 30 }).category, '2');
  assert.equal(calc({ noduleType: 'ggo', ctStatus: 'followUp', noduleStatus: 'slowGrowing', sizeMm: 30 }).category, '2');
});

test('juxtapleural benign morphology requires size below 10 mm', () => {
  assert.equal(calc({ noduleType: 'juxtapleural', sizeMm: 9.9, benignJuxtapleuralMorphology: true }).category, '2');
  assert.equal(calc({ noduleType: 'juxtapleural', sizeMm: 10, benignJuxtapleuralMorphology: true }).category, '4A');
  assert.equal(calc({ noduleType: 'juxtapleural', sizeMm: 8, benignJuxtapleuralMorphology: false }).category, '4A');
});

test('airway rules distinguish benign secretion, location and persistence', () => {
  assert.equal(calc({ noduleType: 'airway', benignAirwaySecretionFeatures: true }).category, '2');
  assert.equal(calc({ noduleType: 'airway', airwayLocation: 'subsegmental' }).category, '2');
  assert.equal(calc({ noduleType: 'airway', airwayLocation: 'segmentalOrProximal' }).category, '4A');
  assert.equal(calc({ noduleType: 'airway', airwayLocation: 'segmentalOrProximal', ctStatus: 'followUp', noduleStatus: 'stable' }).category, '4B');
  assert.equal(calc({ noduleType: 'airway', airwayLocation: 'segmentalOrProximal', ctStatus: 'followUp', noduleStatus: 'resolved' }).category, '1');
});

test('atypical pulmonary cyst logic matches Lung-RADS v2022 features', () => {
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'growingCysticComponent' }).category, '3');
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'baselineOrNew' }).category, '4A');
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'stable' }).category, '3');
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'growingWallOrNodularity' }).category, '4B');
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'growingMultilocular' }).category, '4B');
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'increasedLoculationOrOpacity' }).category, '4B');
});

test('associated cyst nodule uses the most concerning category', () => {
  assert.equal(calc({ noduleType: 'atypicalCyst', atypicalCystChange: 'growingCysticComponent', associatedNoduleCategory: '4B' }).category, '4B');
});

test('4X upgrade and S modifier are separate', () => {
  const fourX = calc({ sizeMm: 8, additionalSuspiciousFeatures: true });
  assert.equal(fourX.category, '4X');
  const withS = calc({ sizeMm: 6, sModifier: true });
  assert.equal(withS.category, '3');
  assert.equal(withS.displayCategory, '3S');
});

test('volume conversion is reversible and used for classification', () => {
  const volume = volumeFromDiameter(8);
  assert.ok(Math.abs(equivalentDiameterFromVolume(volume) - 8) < 0.1);
  const result = calc({ useVolume: true, sizeMm: undefined, volumeMm3: volume });
  assert.equal(result.category, '4A');
  assert.equal(result.equivalentDiameterMm, 8);
});

test('growth assessment uses >1.5 mm within 12 months', () => {
  assert.equal(assessLungRadsGrowth(8.6, 7, 365).status, 'growing');
  assert.equal(assessLungRadsGrowth(8.5, 7, 365).status, 'stable');
  assert.equal(assessLungRadsGrowth(9, 7, 366).status, undefined);
});
