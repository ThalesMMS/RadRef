import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';
import type { HccRiskBasis } from './liRads.ts';

export type TreatmentResponseCategory =
  | 'notApplicable'
  | 'LR-TR Nonevaluable'
  | 'LR-TR Nonviable'
  | 'LR-TR Equivocal'
  | 'LR-TR Nonprogressing'
  | 'LR-TR Viable';

export type TreatmentResponseAlgorithm = 'nonradiation' | 'radiation';
export type TreatmentModality = 'ct' | 'mri';
export type TreatmentType =
  | 'rfa'
  | 'mwa'
  | 'cryoablation'
  | 'pea'
  | 'tae'
  | 'ctace'
  | 'debtace'
  | 'surgicalMargin'
  | 'sbrt'
  | 'tare'
  | 'systemicOnly'
  | 'unknown';
export type MasslikeEnhancementAssessment = 'notAssessable' | 'absent' | 'uncertain' | 'present';
export type RadiationEnhancementChange = 'stableOrDecreased' | 'newOrIncreased' | 'uncertain';
export type PretreatmentCategory =
  | 'unknown'
  | 'LR-3'
  | 'LR-4'
  | 'LR-5'
  | 'LR-M'
  | 'LR-TIV'
  | 'biopsyHcc'
  | 'biopsyNonHccMalignancy';
export type CouinaudSegment = 'unknown' | 'I' | 'II' | 'III' | 'IVa' | 'IVb' | 'V' | 'VI' | 'VII' | 'VIII';

export type TreatmentResponseInput = Readonly<{
  ageYears: number;
  riskBasis: HccRiskBasis;
  presumedOrProvenHcc: boolean;
  modality: TreatmentModality;
  multiphaseExam: boolean;
  treatmentType: TreatmentType;
  withinTreatmentZone: boolean;
  concurrentSystemicTherapy: boolean;
  masslikeEnhancement: MasslikeEnhancementAssessment;
  radiationEnhancementChange: RadiationEnhancementChange;
  useAncillaryFeatures: boolean;
  diffusionRestriction: boolean;
  mildModerateT2Hyperintensity: boolean;
  ancillaryNewOrIncreased: boolean;
  lesionNumber?: number;
  segment: CouinaudSegment;
  pretreatmentCategory: PretreatmentCategory;
  pretreatmentSizeMm?: number;
  enhancingComponentSizeMm?: number;
}>;

export type TreatmentResponseResult = Readonly<{
  category: TreatmentResponseCategory;
  displayCategory: string;
  algorithm?: TreatmentResponseAlgorithm;
  title: MessageRef;
  management: MessageRef;
  reportSuggestion: MessageRef;
  notes: readonly MessageRef[];
  warnings: readonly MessageRef[];
  severity: Severity;
  adjustedByAncillaryFeatures: boolean;
  requiresEnhancingComponentMeasurement: boolean;
}>;

const nonradiationTreatments: readonly TreatmentType[] = [
  'rfa',
  'mwa',
  'cryoablation',
  'pea',
  'tae',
  'ctace',
  'debtace',
  'surgicalMargin',
];

const radiationTreatments: readonly TreatmentType[] = ['sbrt', 'tare'];

export function treatmentResponseAlgorithmFor(
  treatmentType: TreatmentType,
): TreatmentResponseAlgorithm | undefined {
  if (nonradiationTreatments.includes(treatmentType)) return 'nonradiation';
  if (radiationTreatments.includes(treatmentType)) return 'radiation';
  return undefined;
}

function categoryKey(category: TreatmentResponseCategory): string {
  switch (category) {
    case 'notApplicable': return 'notApplicable';
    case 'LR-TR Nonevaluable': return 'nonevaluable';
    case 'LR-TR Nonviable': return 'nonviable';
    case 'LR-TR Equivocal': return 'equivocal';
    case 'LR-TR Nonprogressing': return 'nonprogressing';
    case 'LR-TR Viable': return 'viable';
  }
}

function severityFor(category: TreatmentResponseCategory): Severity {
  if (category === 'notApplicable' || category === 'LR-TR Nonevaluable') return 'neutral';
  if (category === 'LR-TR Nonviable') return 'low';
  if (category === 'LR-TR Equivocal' || category === 'LR-TR Nonprogressing') return 'moderate';
  return 'critical';
}

function positiveMeasurement(value?: number): number | undefined {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : undefined;
}

function makeResult(
  category: TreatmentResponseCategory,
  input: TreatmentResponseInput,
  notes: readonly MessageRef[] = [],
  warnings: readonly MessageRef[] = [],
  options: Readonly<{
    algorithm?: TreatmentResponseAlgorithm;
    adjustedByAncillaryFeatures?: boolean;
  }> = {},
): TreatmentResponseResult {
  const key = categoryKey(category);
  const measurement = positiveMeasurement(input.enhancingComponentSizeMm);
  const requiresMeasurement = category === 'LR-TR Viable'
    || category === 'LR-TR Equivocal'
    || category === 'LR-TR Nonprogressing';
  const measurementWarnings = requiresMeasurement && measurement === undefined
    ? [msg('liver.tra.warning.measureEnhancingComponent')]
    : [];

  return {
    category,
    displayCategory: category === 'notApplicable' ? 'N/A' : category,
    ...(options.algorithm === undefined ? {} : { algorithm: options.algorithm }),
    title: msg(`liver.tra.result.title.${key}`),
    management: msg(`liver.tra.result.management.${key}`),
    reportSuggestion: msg(`liver.tra.result.report.${key}`, {
      measurement: measurement === undefined ? '—' : measurement.toFixed(1),
    }),
    notes,
    warnings: [...warnings, ...measurementWarnings],
    severity: severityFor(category),
    adjustedByAncillaryFeatures: options.adjustedByAncillaryFeatures ?? false,
    requiresEnhancingComponentMeasurement: requiresMeasurement,
  };
}

function applicabilityFailure(input: TreatmentResponseInput): TreatmentResponseResult | undefined {
  if (!Number.isFinite(input.ageYears) || input.ageYears < 18) {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.adultOnly')],
      [msg('liver.tra.warning.notApplicable')],
    );
  }
  if (input.riskBasis === 'none') {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.highRiskPopulationRequired')],
      [msg('liver.tra.warning.notApplicable')],
    );
  }
  if (!input.presumedOrProvenHcc) {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.hccTargetRequired')],
      [msg('liver.tra.warning.notApplicable')],
    );
  }
  if (!input.multiphaseExam) {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.multiphaseRequired')],
      [msg('liver.tra.warning.useMultiphase')],
    );
  }
  if (!input.withinTreatmentZone) {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.outsideTreatmentZone')],
      [msg('liver.tra.warning.useDiagnosticAlgorithm')],
    );
  }
  if (input.treatmentType === 'systemicOnly') {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.systemicOnly')],
      [msg('liver.tra.warning.notApplicable')],
    );
  }
  if (input.treatmentType === 'unknown') {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.unknownTreatment')],
      [msg('liver.tra.warning.selectTreatment')],
    );
  }
  return undefined;
}

function commonNotes(
  input: TreatmentResponseInput,
  algorithm: TreatmentResponseAlgorithm,
): MessageRef[] {
  const notes: MessageRef[] = [
    msg(algorithm === 'radiation' ? 'liver.tra.note.radiationAlgorithm' : 'liver.tra.note.nonradiationAlgorithm'),
  ];
  if (input.treatmentType === 'surgicalMargin') notes.push(msg('liver.tra.note.surgicalMargin'));
  if (input.concurrentSystemicTherapy) notes.push(msg('liver.tra.note.concurrentSystemicTherapy'));
  return notes;
}

function ancillaryFeatureSelected(input: TreatmentResponseInput): boolean {
  return input.diffusionRestriction || input.mildModerateT2Hyperintensity;
}

function ancillaryWarnings(input: TreatmentResponseInput): MessageRef[] {
  if (!input.useAncillaryFeatures || !ancillaryFeatureSelected(input)) return [];
  if (input.modality === 'ct') return [msg('liver.tra.warning.ancillaryMriOnly')];
  return [];
}

function calculateNonradiation(
  input: TreatmentResponseInput,
  algorithm: TreatmentResponseAlgorithm,
): TreatmentResponseResult {
  const notes = commonNotes(input, algorithm);
  const warnings = ancillaryWarnings(input);

  if (input.masslikeEnhancement === 'notAssessable') {
    return makeResult(
      'LR-TR Nonevaluable',
      input,
      [...notes, msg('liver.tra.note.enhancementNotAssessable')],
      warnings,
      { algorithm },
    );
  }
  if (input.masslikeEnhancement === 'absent') {
    return makeResult(
      'LR-TR Nonviable',
      input,
      [...notes, msg('liver.tra.note.noMasslikeEnhancement')],
      warnings,
      { algorithm },
    );
  }
  if (input.masslikeEnhancement === 'present') {
    return makeResult(
      'LR-TR Viable',
      input,
      [...notes, msg('liver.tra.note.masslikeEnhancementPresent')],
      warnings,
      { algorithm },
    );
  }

  const canUpgrade = input.modality === 'mri'
    && input.useAncillaryFeatures
    && ancillaryFeatureSelected(input);
  if (canUpgrade) {
    return makeResult(
      'LR-TR Viable',
      input,
      [
        ...notes,
        msg('liver.tra.note.uncertainMasslikeEnhancement'),
        msg('liver.tra.note.ancillaryUpgradeEquivocal'),
      ],
      warnings,
      { algorithm, adjustedByAncillaryFeatures: true },
    );
  }
  return makeResult(
    'LR-TR Equivocal',
    input,
    [...notes, msg('liver.tra.note.uncertainMasslikeEnhancement')],
    warnings,
    { algorithm },
  );
}

function calculateRadiation(
  input: TreatmentResponseInput,
  algorithm: TreatmentResponseAlgorithm,
): TreatmentResponseResult {
  const notes = commonNotes(input, algorithm);
  const warnings = ancillaryWarnings(input);

  if (input.masslikeEnhancement === 'notAssessable') {
    return makeResult(
      'LR-TR Nonevaluable',
      input,
      [...notes, msg('liver.tra.note.enhancementNotAssessable')],
      warnings,
      { algorithm },
    );
  }
  if (input.masslikeEnhancement === 'absent') {
    return makeResult(
      'LR-TR Nonviable',
      input,
      [...notes, msg('liver.tra.note.noMasslikeEnhancement')],
      warnings,
      { algorithm },
    );
  }

  if (input.masslikeEnhancement === 'uncertain') {
    return makeResult(
      'LR-TR Nonprogressing',
      input,
      [...notes, msg('liver.tra.note.radiationTieBreakNonprogressing')],
      warnings,
      { algorithm },
    );
  }

  if (input.radiationEnhancementChange === 'newOrIncreased') {
    return makeResult(
      'LR-TR Viable',
      input,
      [...notes, msg('liver.tra.note.enhancementNewOrIncreased')],
      warnings,
      { algorithm },
    );
  }

  const canUpgrade = input.radiationEnhancementChange === 'stableOrDecreased'
    && input.modality === 'mri'
    && input.useAncillaryFeatures
    && ancillaryFeatureSelected(input)
    && input.ancillaryNewOrIncreased;
  if (canUpgrade) {
    return makeResult(
      'LR-TR Viable',
      input,
      [
        ...notes,
        msg('liver.tra.note.enhancementStableOrDecreased'),
        msg('liver.tra.note.ancillaryUpgradeNonprogressing'),
      ],
      warnings,
      { algorithm, adjustedByAncillaryFeatures: true },
    );
  }

  if (input.radiationEnhancementChange === 'uncertain') {
    notes.push(msg('liver.tra.note.radiationTieBreakNonprogressing'));
  } else {
    notes.push(msg('liver.tra.note.enhancementStableOrDecreased'));
  }
  if (
    input.modality === 'mri'
    && input.useAncillaryFeatures
    && ancillaryFeatureSelected(input)
    && !input.ancillaryNewOrIncreased
  ) {
    notes.push(msg('liver.tra.note.ancillaryTemporalRequirement'));
  }

  return makeResult('LR-TR Nonprogressing', input, notes, warnings, { algorithm });
}

export function calculateTreatmentResponse(input: TreatmentResponseInput): TreatmentResponseResult {
  const failure = applicabilityFailure(input);
  if (failure) return failure;

  const algorithm = treatmentResponseAlgorithmFor(input.treatmentType);
  if (algorithm === undefined) {
    return makeResult(
      'notApplicable',
      input,
      [msg('liver.tra.note.unknownTreatment')],
      [msg('liver.tra.warning.selectTreatment')],
    );
  }

  return algorithm === 'radiation'
    ? calculateRadiation(input, algorithm)
    : calculateNonradiation(input, algorithm);
}
