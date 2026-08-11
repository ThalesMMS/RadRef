import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';

export type LiRadsCategory =
  | 'notApplicable'
  | 'LR-NC'
  | 'LR-TIV'
  | 'LR-1'
  | 'LR-2'
  | 'LR-3'
  | 'LR-4'
  | 'LR-5'
  | 'LR-M';

export type HccRiskBasis = 'cirrhosis' | 'chronicHbv' | 'currentOrPriorHcc' | 'none';
export type LiRadsAphe = 'none' | 'nonrim';
export type AncillaryDirection = 'none' | 'malignancy' | 'benignity' | 'both';

export type LiRadsInput = Readonly<{
  ageYears: number;
  riskBasis: HccRiskBasis;
  excludedCirrhosisEtiology: boolean;
  adequateExam: boolean;
  pathProven: boolean;
  treatedObservation: boolean;
  definitelyBenign: boolean;
  probablyBenign: boolean;
  tumorInVein: boolean;
  lrMFeatures: boolean;
  sizeMm?: number;
  aphe: LiRadsAphe;
  enhancingCapsule: boolean;
  nonperipheralWashout: boolean;
  thresholdGrowth: boolean;
  ancillaryDirection: AncillaryDirection;
}>;

export type LiRadsResult = Readonly<{
  category: LiRadsCategory;
  displayCategory: string;
  baseCategory?: LiRadsCategory;
  title: MessageRef;
  recommendation: MessageRef;
  notes: readonly MessageRef[];
  warnings: readonly MessageRef[];
  severity: Severity;
  majorFeatureCount?: number;
  adjustedByAncillaryFeatures: boolean;
}>;

export type ThresholdGrowthAssessment = Readonly<{
  meetsThreshold?: boolean;
  percentChange?: number;
  summary: MessageRef;
}>;

const categoryRank: Readonly<Record<'LR-1' | 'LR-2' | 'LR-3' | 'LR-4' | 'LR-5', number>> = {
  'LR-1': 1,
  'LR-2': 2,
  'LR-3': 3,
  'LR-4': 4,
  'LR-5': 5,
};

const rankCategory: Readonly<Record<number, 'LR-1' | 'LR-2' | 'LR-3' | 'LR-4' | 'LR-5'>> = {
  1: 'LR-1',
  2: 'LR-2',
  3: 'LR-3',
  4: 'LR-4',
  5: 'LR-5',
};

function titleFor(category: LiRadsCategory): MessageRef {
  switch (category) {
    case 'notApplicable': return msg('liver.liRads.result.title.notApplicable');
    case 'LR-NC': return msg('liver.liRads.result.title.LR-NC');
    case 'LR-TIV': return msg('liver.liRads.result.title.LR-TIV');
    case 'LR-1': return msg('liver.liRads.result.title.LR-1');
    case 'LR-2': return msg('liver.liRads.result.title.LR-2');
    case 'LR-3': return msg('liver.liRads.result.title.LR-3');
    case 'LR-4': return msg('liver.liRads.result.title.LR-4');
    case 'LR-5': return msg('liver.liRads.result.title.LR-5');
    case 'LR-M': return msg('liver.liRads.result.title.LR-M');
  }
}

function recommendationFor(category: LiRadsCategory): MessageRef {
  switch (category) {
    case 'notApplicable': return msg('liver.liRads.result.recommendation.notApplicable');
    case 'LR-NC': return msg('liver.liRads.result.recommendation.LR-NC');
    case 'LR-TIV': return msg('liver.liRads.result.recommendation.LR-TIV');
    case 'LR-1': return msg('liver.liRads.result.recommendation.LR-1');
    case 'LR-2': return msg('liver.liRads.result.recommendation.LR-2');
    case 'LR-3': return msg('liver.liRads.result.recommendation.LR-3');
    case 'LR-4': return msg('liver.liRads.result.recommendation.LR-4');
    case 'LR-5': return msg('liver.liRads.result.recommendation.LR-5');
    case 'LR-M': return msg('liver.liRads.result.recommendation.LR-M');
  }
}

function severityFor(category: LiRadsCategory): Severity {
  if (category === 'notApplicable' || category === 'LR-NC' || category === 'LR-1') return 'neutral';
  if (category === 'LR-2') return 'low';
  if (category === 'LR-3') return 'moderate';
  if (category === 'LR-4') return 'high';
  return 'critical';
}

function makeResult(
  category: LiRadsCategory,
  notes: readonly MessageRef[] = [],
  warnings: readonly MessageRef[] = [],
  options: Readonly<{
    baseCategory?: LiRadsCategory;
    majorFeatureCount?: number;
    adjustedByAncillaryFeatures?: boolean;
  }> = {},
): LiRadsResult {
  return {
    category,
    displayCategory: category === 'notApplicable' ? 'N/A' : category,
    ...(options.baseCategory === undefined ? {} : { baseCategory: options.baseCategory }),
    title: titleFor(category),
    recommendation: recommendationFor(category),
    notes,
    warnings,
    severity: severityFor(category),
    ...(options.majorFeatureCount === undefined ? {} : { majorFeatureCount: options.majorFeatureCount }),
    adjustedByAncillaryFeatures: options.adjustedByAncillaryFeatures ?? false,
  };
}

export function assessThresholdGrowth(
  currentSizeMm?: number,
  priorSizeMm?: number,
  intervalMonths?: number,
): ThresholdGrowthAssessment {
  if (currentSizeMm === undefined || priorSizeMm === undefined || intervalMonths === undefined) {
    return { summary: msg('liver.liRads.growth.enterValues') };
  }
  if (
    ![currentSizeMm, priorSizeMm, intervalMonths].every(Number.isFinite)
    || currentSizeMm <= 0
    || priorSizeMm <= 0
    || intervalMonths <= 0
  ) {
    return { summary: msg('liver.liRads.growth.invalidValues') };
  }
  const percentChange = ((currentSizeMm - priorSizeMm) / priorSizeMm) * 100;
  const meetsThreshold = intervalMonths <= 6 && percentChange >= 50;
  return {
    meetsThreshold,
    percentChange,
    summary: msg(
      meetsThreshold ? 'liver.liRads.growth.meetsThreshold' : 'liver.liRads.growth.doesNotMeetThreshold',
      { percent: percentChange.toFixed(1), months: intervalMonths.toFixed(1) },
    ),
  };
}

function baseCategoryFromDiagnosticTable(input: LiRadsInput, sizeMm: number): Readonly<{
  category: 'LR-3' | 'LR-4' | 'LR-5';
  majorFeatureCount: number;
}> {
  const majorFeatureCount = [
    input.enhancingCapsule,
    input.nonperipheralWashout,
    input.thresholdGrowth,
  ].filter(Boolean).length;

  if (input.aphe === 'none') {
    if (sizeMm < 20) {
      return { category: majorFeatureCount >= 2 ? 'LR-4' : 'LR-3', majorFeatureCount };
    }
    return { category: majorFeatureCount >= 1 ? 'LR-4' : 'LR-3', majorFeatureCount };
  }

  if (sizeMm < 10) {
    return { category: majorFeatureCount >= 1 ? 'LR-4' : 'LR-3', majorFeatureCount };
  }

  if (sizeMm < 20) {
    if (majorFeatureCount === 0) return { category: 'LR-3', majorFeatureCount };
    if (majorFeatureCount >= 2) return { category: 'LR-5', majorFeatureCount };
    // v2018 diagonal cell: one additional major feature is LR-4 only for capsule;
    // washout or threshold growth is sufficient for LR-5.
    return {
      category: input.nonperipheralWashout || input.thresholdGrowth ? 'LR-5' : 'LR-4',
      majorFeatureCount,
    };
  }

  return { category: majorFeatureCount >= 1 ? 'LR-5' : 'LR-4', majorFeatureCount };
}

function adjustWithAncillaryFeatures(
  category: 'LR-1' | 'LR-2' | 'LR-3' | 'LR-4' | 'LR-5',
  direction: AncillaryDirection,
): Readonly<{ category: 'LR-1' | 'LR-2' | 'LR-3' | 'LR-4' | 'LR-5'; adjusted: boolean }> {
  if (direction === 'none' || direction === 'both') return { category, adjusted: false };
  const rank = categoryRank[category];
  const targetRank = direction === 'malignancy'
    ? Math.min(4, rank + 1)
    : Math.max(1, rank - 1);
  const adjustedCategory = rankCategory[targetRank] ?? category;
  return { category: adjustedCategory, adjusted: adjustedCategory !== category };
}

export function calculateLiRads(input: LiRadsInput): LiRadsResult {
  if (!Number.isFinite(input.ageYears) || input.ageYears < 18) {
    return makeResult(
      'notApplicable',
      [msg('liver.liRads.note.adultOnly')],
      [msg('liver.liRads.warning.notApplicable')],
    );
  }
  if (input.riskBasis === 'none') {
    return makeResult(
      'notApplicable',
      [msg('liver.liRads.note.highRiskPopulationRequired')],
      [msg('liver.liRads.warning.notApplicable')],
    );
  }
  if (input.excludedCirrhosisEtiology) {
    return makeResult(
      'notApplicable',
      [msg('liver.liRads.note.excludedCirrhosisEtiology')],
      [msg('liver.liRads.warning.notApplicable')],
    );
  }
  if (input.pathProven) {
    return makeResult(
      'notApplicable',
      [msg('liver.liRads.note.pathProven')],
      [msg('liver.liRads.warning.notApplicable')],
    );
  }
  if (input.treatedObservation) {
    return makeResult(
      'notApplicable',
      [msg('liver.liRads.note.treatedObservation')],
      [msg('liver.liRads.warning.useTreatmentResponse')],
    );
  }
  if (!input.adequateExam) {
    return makeResult('LR-NC', [msg('liver.liRads.note.notCategorizable')]);
  }
  if (input.tumorInVein) {
    return makeResult('LR-TIV', [msg('liver.liRads.note.tumorInVein')]);
  }

  if (input.definitelyBenign) {
    const adjusted = adjustWithAncillaryFeatures('LR-1', input.ancillaryDirection);
    return makeResult(
      adjusted.category,
      [msg('liver.liRads.note.definitelyBenign'), ...(adjusted.adjusted ? [msg('liver.liRads.note.ancillaryAdjusted')] : [])],
      [],
      adjusted.adjusted ? { baseCategory: 'LR-1', adjustedByAncillaryFeatures: true } : {},
    );
  }
  if (input.probablyBenign) {
    const adjusted = adjustWithAncillaryFeatures('LR-2', input.ancillaryDirection);
    return makeResult(
      adjusted.category,
      [msg('liver.liRads.note.probablyBenign'), ...(adjusted.adjusted ? [msg('liver.liRads.note.ancillaryAdjusted')] : [])],
      [],
      adjusted.adjusted ? { baseCategory: 'LR-2', adjustedByAncillaryFeatures: true } : {},
    );
  }
  if (input.lrMFeatures) {
    return makeResult('LR-M', [msg('liver.liRads.note.lrMFeatures')]);
  }

  if (input.sizeMm === undefined || !Number.isFinite(input.sizeMm) || input.sizeMm <= 0) {
    return makeResult(
      'notApplicable',
      [],
      [msg('liver.liRads.warning.validSizeRequired')],
    );
  }

  const base = baseCategoryFromDiagnosticTable(input, input.sizeMm);
  const adjusted = adjustWithAncillaryFeatures(base.category, input.ancillaryDirection);
  const notes: MessageRef[] = [
    msg('liver.liRads.note.majorFeatureCount', { count: base.majorFeatureCount }),
  ];
  if (input.ancillaryDirection === 'both') notes.push(msg('liver.liRads.note.ancillaryConflictNoAdjustment'));
  if (adjusted.adjusted) notes.push(msg('liver.liRads.note.ancillaryAdjusted'));
  if (input.ancillaryDirection === 'malignancy' && base.category === 'LR-4') {
    notes.push(msg('liver.liRads.note.ancillaryCannotUpgradeToLr5'));
  }

  return makeResult(
    adjusted.category,
    notes,
    [],
    {
      majorFeatureCount: base.majorFeatureCount,
      ...(adjusted.adjusted ? { baseCategory: base.category, adjustedByAncillaryFeatures: true } : {}),
    },
  );
}
