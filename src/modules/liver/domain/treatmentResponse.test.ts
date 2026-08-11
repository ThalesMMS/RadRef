import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTreatmentResponse,
  treatmentResponseAlgorithmFor,
  type TreatmentResponseInput,
} from './treatmentResponse.ts';

const base: TreatmentResponseInput = {
  ageYears: 60,
  riskBasis: 'cirrhosis',
  presumedOrProvenHcc: true,
  modality: 'mri',
  multiphaseExam: true,
  treatmentType: 'ctace',
  withinTreatmentZone: true,
  concurrentSystemicTherapy: false,
  masslikeEnhancement: 'absent',
  radiationEnhancementChange: 'stableOrDecreased',
  useAncillaryFeatures: false,
  diffusionRestriction: false,
  mildModerateT2Hyperintensity: false,
  ancillaryNewOrIncreased: false,
  lesionNumber: 1,
  segment: 'VIII',
  pretreatmentCategory: 'LR-5',
  pretreatmentSizeMm: 25,
};

test('maps locoregional treatments to the correct v2024 algorithm', () => {
  assert.equal(treatmentResponseAlgorithmFor('rfa'), 'nonradiation');
  assert.equal(treatmentResponseAlgorithmFor('surgicalMargin'), 'nonradiation');
  assert.equal(treatmentResponseAlgorithmFor('sbrt'), 'radiation');
  assert.equal(treatmentResponseAlgorithmFor('tare'), 'radiation');
  assert.equal(treatmentResponseAlgorithmFor('systemicOnly'), undefined);
});

test('rejects patients outside the treatment-response application population', () => {
  assert.equal(calculateTreatmentResponse({ ...base, ageYears: 17 }).category, 'notApplicable');
  assert.equal(calculateTreatmentResponse({ ...base, riskBasis: 'none' }).category, 'notApplicable');
  assert.equal(calculateTreatmentResponse({ ...base, presumedOrProvenHcc: false }).category, 'notApplicable');
  assert.equal(calculateTreatmentResponse({ ...base, multiphaseExam: false }).category, 'notApplicable');
});

test('uses a localization key only for the not-applicable display category', () => {
  assert.equal(
    calculateTreatmentResponse({ ...base, ageYears: 17 }).displayCategory,
    'liver.tra.result.title.notApplicable',
  );
  const applicable = calculateTreatmentResponse(base);
  assert.equal(applicable.displayCategory, applicable.category);
});

test('routes untreated observations outside the treatment zone back to diagnosis', () => {
  const result = calculateTreatmentResponse({ ...base, withinTreatmentZone: false });
  assert.equal(result.category, 'notApplicable');
  assert.equal(result.warnings[0]?.key, 'liver.tra.warning.useDiagnosticAlgorithm');
});

test('does not apply TRA to systemic therapy alone or an unknown treatment', () => {
  assert.equal(calculateTreatmentResponse({ ...base, treatmentType: 'systemicOnly' }).category, 'notApplicable');
  assert.equal(calculateTreatmentResponse({ ...base, treatmentType: 'unknown' }).category, 'notApplicable');
});

test('nonradiation TRA assigns nonevaluable when enhancement cannot be assessed', () => {
  const result = calculateTreatmentResponse({ ...base, masslikeEnhancement: 'notAssessable' });
  assert.equal(result.category, 'LR-TR Nonevaluable');
  assert.equal(result.algorithm, 'nonradiation');
});

test('nonradiation TRA assigns nonviable when masslike enhancement is absent', () => {
  const result = calculateTreatmentResponse({ ...base, masslikeEnhancement: 'absent' });
  assert.equal(result.category, 'LR-TR Nonviable');
});

test('nonradiation TRA assigns viable for any masslike enhancement', () => {
  const result = calculateTreatmentResponse({
    ...base,
    masslikeEnhancement: 'present',
    enhancingComponentSizeMm: 12,
  });
  assert.equal(result.category, 'LR-TR Viable');
  assert.equal(result.warnings.length, 0);
});

test('nonradiation uncertainty is equivocal without ancillary upgrade', () => {
  const result = calculateTreatmentResponse({
    ...base,
    masslikeEnhancement: 'uncertain',
    enhancingComponentSizeMm: 8,
  });
  assert.equal(result.category, 'LR-TR Equivocal');
});

test('MRI ancillary features may upgrade nonradiation equivocal to viable', () => {
  const result = calculateTreatmentResponse({
    ...base,
    masslikeEnhancement: 'uncertain',
    useAncillaryFeatures: true,
    diffusionRestriction: true,
    enhancingComponentSizeMm: 8,
  });
  assert.equal(result.category, 'LR-TR Viable');
  assert.equal(result.adjustedByAncillaryFeatures, true);
});

test('CT ancillary features do not upgrade and generate an MRI-only warning', () => {
  const result = calculateTreatmentResponse({
    ...base,
    modality: 'ct',
    masslikeEnhancement: 'uncertain',
    useAncillaryFeatures: true,
    diffusionRestriction: true,
    enhancingComponentSizeMm: 8,
  });
  assert.equal(result.category, 'LR-TR Equivocal');
  assert.ok(result.warnings.some((warning) => warning.key === 'liver.tra.warning.ancillaryMriOnly'));
});

test('radiation TRA assigns nonviable when no masslike enhancement is present', () => {
  const result = calculateTreatmentResponse({ ...base, treatmentType: 'tare', masslikeEnhancement: 'absent' });
  assert.equal(result.category, 'LR-TR Nonviable');
  assert.equal(result.algorithm, 'radiation');
});

test('radiation TRA assigns nonprogressing for stable or decreasing enhancement', () => {
  const result = calculateTreatmentResponse({
    ...base,
    treatmentType: 'sbrt',
    masslikeEnhancement: 'present',
    radiationEnhancementChange: 'stableOrDecreased',
    enhancingComponentSizeMm: 15,
  });
  assert.equal(result.category, 'LR-TR Nonprogressing');
});

test('radiation TRA assigns viable for new or increasing enhancement', () => {
  const result = calculateTreatmentResponse({
    ...base,
    treatmentType: 'tare',
    masslikeEnhancement: 'present',
    radiationEnhancementChange: 'newOrIncreased',
    enhancingComponentSizeMm: 15,
  });
  assert.equal(result.category, 'LR-TR Viable');
});

test('radiation uncertainty follows the lower-certainty nonprogressing tiebreaker', () => {
  const result = calculateTreatmentResponse({
    ...base,
    treatmentType: 'sbrt',
    masslikeEnhancement: 'present',
    radiationEnhancementChange: 'uncertain',
    enhancingComponentSizeMm: 15,
  });
  assert.equal(result.category, 'LR-TR Nonprogressing');
});

test('new or increased MRI ancillary features may upgrade radiation nonprogressing to viable', () => {
  const result = calculateTreatmentResponse({
    ...base,
    treatmentType: 'tare',
    masslikeEnhancement: 'present',
    radiationEnhancementChange: 'stableOrDecreased',
    useAncillaryFeatures: true,
    mildModerateT2Hyperintensity: true,
    ancillaryNewOrIncreased: true,
    enhancingComponentSizeMm: 15,
  });
  assert.equal(result.category, 'LR-TR Viable');
  assert.equal(result.adjustedByAncillaryFeatures, true);
});

test('radiation ancillary features without temporal increase do not upgrade', () => {
  const result = calculateTreatmentResponse({
    ...base,
    treatmentType: 'tare',
    masslikeEnhancement: 'present',
    radiationEnhancementChange: 'stableOrDecreased',
    useAncillaryFeatures: true,
    diffusionRestriction: true,
    ancillaryNewOrIncreased: false,
    enhancingComponentSizeMm: 15,
  });
  assert.equal(result.category, 'LR-TR Nonprogressing');
  assert.ok(result.notes.some((note) => note.key === 'liver.tra.note.ancillaryTemporalRequirement'));
});

test('equivocal, nonprogressing and viable results request enhancing-component measurement', () => {
  for (const input of [
    { ...base, masslikeEnhancement: 'uncertain' as const },
    {
      ...base,
      treatmentType: 'sbrt' as const,
      masslikeEnhancement: 'present' as const,
      radiationEnhancementChange: 'stableOrDecreased' as const,
    },
    { ...base, masslikeEnhancement: 'present' as const },
  ]) {
    const result = calculateTreatmentResponse(input);
    assert.equal(result.requiresEnhancingComponentMeasurement, true);
    assert.ok(result.warnings.some((warning) => warning.key === 'liver.tra.warning.measureEnhancingComponent'));
  }
});

test('concurrent systemic therapy adds a caution note without blocking categorization', () => {
  const result = calculateTreatmentResponse({ ...base, concurrentSystemicTherapy: true });
  assert.equal(result.category, 'LR-TR Nonviable');
  assert.ok(result.notes.some((note) => note.key === 'liver.tra.note.concurrentSystemicTherapy'));
});
