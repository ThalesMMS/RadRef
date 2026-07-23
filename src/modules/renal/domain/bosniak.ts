import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';
import { calculateBosniakManagement, type ManagementResult } from './management.ts';

export type BosniakCategory = 'notApplicable' | 'incomplete' | 'I' | 'II' | 'IIF' | 'III' | 'IV';
export type ImagingModality = 'ct' | 'mri' | 'ultrasound';
export type ImagingAcquisition =
  | 'ctRenalMassProtocol'
  | 'ctNoncontrast'
  | 'ctPortalVenous'
  | 'ctOther'
  | 'mriRenalMassProtocol'
  | 'mriNoncontrast'
  | 'mriOther'
  | 'ultrasound';
export type SpecialContentPattern =
  | 'none'
  | 'simpleFluid'
  | 'ctMinus9To20'
  | 'ctAtLeast70'
  | 'ctOver20Nonenhancing'
  | 'ctPortal21To30'
  | 'ctTooSmallLowAttenuation'
  | 'mriT2CSFLike'
  | 'mriT1MarkedHomogeneous'
  | 'mriT1Heterogeneous';
export type CalcificationPattern = 'none' | 'present' | 'abundantThickOrNodular';
export type ProtrusionMargin = 'none' | 'obtuse' | 'acute';

export type BosniakInput = Readonly<{
  acquisition: ImagingAcquisition;
  cysticMassConfirmed: boolean;
  enhancingTissuePercent?: number;
  suspectedInfectiousInflammatoryOrVascular: boolean;
  hereditaryRenalCancerSyndrome: boolean;
  lesionSizeMm?: number;
  wellDefined: boolean;
  homogeneous: boolean;
  specialContentPattern: SpecialContentPattern;
  wallThicknessMm: number;
  wallSmooth: boolean;
  wallEnhances: boolean;
  septaCount: number;
  maxSeptalThicknessMm: number;
  septaSmooth: boolean;
  septaEnhance: boolean;
  calcification: CalcificationPattern;
  protrusionMargin: ProtrusionMargin;
  protrusionSizeMm: number;
  protrusionEnhances: boolean;
  symptomatic: boolean;
  significantComorbidityOrLimitedLifeExpectancy: boolean;
  targetableSolidComponent: boolean;
}>;

export type BosniakResult = Readonly<{
  category: BosniakCategory;
  categoryLabel: string;
  title: MessageRef;
  riskSummary: MessageRef;
  rationale: readonly MessageRef[];
  warnings: readonly MessageRef[];
  reportSuggestion: MessageRef;
  management: ManagementResult;
  severity: Severity;
}>;

export function acquisitionModality(acquisition: ImagingAcquisition): ImagingModality {
  if (acquisition.startsWith('ct')) return 'ct';
  if (acquisition.startsWith('mri')) return 'mri';
  return 'ultrasound';
}

function isCompleteProtocol(acquisition: ImagingAcquisition): boolean {
  return acquisition === 'ctRenalMassProtocol' || acquisition === 'mriRenalMassProtocol';
}

function isExplicitlyNoncontrast(acquisition: ImagingAcquisition): boolean {
  return acquisition === 'ctNoncontrast' || acquisition === 'mriNoncontrast';
}

function compatible(pattern: SpecialContentPattern, acquisition: ImagingAcquisition): boolean {
  const modality = acquisitionModality(acquisition);
  switch (pattern) {
    case 'none':
    case 'simpleFluid':
      return modality !== 'ultrasound';
    case 'ctMinus9To20':
    case 'ctAtLeast70':
      return acquisition === 'ctNoncontrast';
    case 'ctOver20Nonenhancing':
      return acquisition === 'ctRenalMassProtocol';
    case 'ctPortal21To30':
      return acquisition === 'ctPortalVenous';
    case 'ctTooSmallLowAttenuation':
      return modality === 'ct';
    case 'mriT2CSFLike':
    case 'mriT1MarkedHomogeneous':
    case 'mriT1Heterogeneous':
      return modality === 'mri';
  }
}

function categoryLabel(category: BosniakCategory): string {
  if (category === 'notApplicable') return 'N/A';
  if (category === 'incomplete') return '—';
  return category;
}

function severityFor(category: BosniakCategory): Severity {
  if (category === 'notApplicable' || category === 'incomplete') return 'neutral';
  if (category === 'I' || category === 'II') return 'low';
  if (category === 'IIF') return 'moderate';
  if (category === 'III') return 'high';
  return 'critical';
}

function buildResult(
  category: BosniakCategory,
  input: BosniakInput,
  rationaleKeys: readonly string[],
  warningKeys: readonly string[] = [],
  reportKey?: string,
): BosniakResult {
  return {
    category,
    categoryLabel: categoryLabel(category),
    title: msg(`renal.bosniak.title.${category}`),
    riskSummary: msg(`renal.bosniak.risk.${category}`),
    rationale: rationaleKeys.map((key) => msg(key)),
    warnings: warningKeys.map((key) => msg(key)),
    reportSuggestion: msg(reportKey ?? `renal.bosniak.report.${category}`),
    management: calculateBosniakManagement({
      category,
      ...(input.lesionSizeMm === undefined ? {} : { lesionSizeMm: input.lesionSizeMm }),
      symptomatic: input.symptomatic,
      significantComorbidityOrLimitedLifeExpectancy: input.significantComorbidityOrLimitedLifeExpectancy,
      targetableSolidComponent: input.targetableSolidComponent,
    }),
    severity: severityFor(category),
  };
}

function hasProtrusion(input: BosniakInput): boolean {
  return input.protrusionMargin !== 'none' && input.protrusionSizeMm > 0;
}

function hasAnyEnhancingFeature(input: BosniakInput): boolean {
  return input.wallEnhances ||
    (input.septaCount > 0 && input.septaEnhance) ||
    (hasProtrusion(input) && input.protrusionEnhances);
}

function measurementError(input: BosniakInput): string | undefined {
  if (input.lesionSizeMm !== undefined && (!Number.isFinite(input.lesionSizeMm) || input.lesionSizeMm <= 0)) {
    return 'validation.positiveLesionSize';
  }
  if (!Number.isFinite(input.wallThicknessMm) || input.wallThicknessMm < 0) {
    return 'validation.nonNegativeWallThickness';
  }
  if (!Number.isInteger(input.septaCount) || input.septaCount < 0) {
    return 'validation.nonNegativeSeptaCount';
  }
  if (!Number.isFinite(input.maxSeptalThicknessMm) || input.maxSeptalThicknessMm < 0) {
    return 'validation.nonNegativeSeptalThickness';
  }
  if (!Number.isFinite(input.protrusionSizeMm) || input.protrusionSizeMm < 0) {
    return 'validation.nonNegativeProtrusionSize';
  }
  return undefined;
}

function isSpecialClassII(pattern: SpecialContentPattern): boolean {
  return [
    'ctMinus9To20',
    'ctAtLeast70',
    'ctOver20Nonenhancing',
    'ctPortal21To30',
    'ctTooSmallLowAttenuation',
    'mriT2CSFLike',
    'mriT1MarkedHomogeneous',
  ].includes(pattern);
}

function permittedClassIISepta(input: BosniakInput): boolean {
  if (!input.septaSmooth || input.maxSeptalThicknessMm > 2) return false;
  if (input.septaEnhance) return input.septaCount >= 1 && input.septaCount <= 3;
  return input.septaCount >= 1;
}

function isClassI(input: BosniakInput): boolean {
  return isCompleteProtocol(input.acquisition) &&
    input.specialContentPattern === 'simpleFluid' &&
    input.wellDefined &&
    input.homogeneous &&
    input.wallSmooth &&
    input.wallThicknessMm <= 2 &&
    input.septaCount === 0 &&
    input.calcification === 'none' &&
    input.protrusionMargin === 'none';
}

function isClassII(input: BosniakInput): boolean {
  if (!input.wellDefined || !input.wallSmooth || input.wallThicknessMm > 2 || input.protrusionEnhances) return false;
  if (isSpecialClassII(input.specialContentPattern)) {
    return input.homogeneous && input.septaCount === 0 && !hasProtrusion(input);
  }
  if (!isCompleteProtocol(input.acquisition)) return false;
  if (input.calcification !== 'none') {
    return input.septaCount === 0 || permittedClassIISepta(input);
  }
  if (input.specialContentPattern === 'simpleFluid') {
    return input.septaCount > 0 && permittedClassIISepta(input);
  }
  return input.septaCount > 0 && permittedClassIISepta(input);
}

function classIIReasons(input: BosniakInput): string[] {
  const keys: string[] = [];
  const specialKey = `renal.bosniak.reason.special.${input.specialContentPattern}`;
  if (input.specialContentPattern !== 'none' && input.specialContentPattern !== 'mriT1Heterogeneous') {
    keys.push(specialKey);
  }
  if (input.septaCount > 0) {
    keys.push(input.septaEnhance
      ? 'renal.bosniak.reason.classIIEnhancingSepta'
      : 'renal.bosniak.reason.classIINonenhancingSepta');
  }
  if (input.calcification !== 'none') keys.push('renal.bosniak.reason.classIICalcification');
  if (keys.length === 0) keys.push('renal.bosniak.reason.classIIDefault');
  return keys;
}

export function calculateBosniak(input: BosniakInput): BosniakResult {
  const warnings: string[] = [];

  if (input.acquisition === 'ultrasound') {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.ultrasoundIncomplete'],
      ['renal.bosniak.warning.ultrasoundContrastStudy'],
      'renal.bosniak.report.ultrasoundIncomplete',
    );
  }
  if (input.hereditaryRenalCancerSyndrome) {
    return buildResult(
      'notApplicable',
      input,
      ['renal.bosniak.reason.hereditarySyndrome'],
      ['renal.bosniak.warning.hereditaryProtocol'],
      'renal.bosniak.report.hereditary',
    );
  }
  if (input.suspectedInfectiousInflammatoryOrVascular) {
    return buildResult(
      'notApplicable',
      input,
      ['renal.bosniak.reason.alternativeEtiology'],
      [],
      'renal.bosniak.report.alternativeEtiology',
    );
  }
  const validation = measurementError(input);
  if (validation) {
    return buildResult('incomplete', input, [validation], [], 'renal.bosniak.report.invalidMeasurements');
  }
  if (!input.cysticMassConfirmed) {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.confirmCystic'],
      ['renal.bosniak.warning.solidWithNecrosis'],
      'renal.bosniak.report.confirmCystic',
    );
  }
  if (input.enhancingTissuePercent !== undefined) {
    const percent = input.enhancingTissuePercent;
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return buildResult('incomplete', input, ['renal.bosniak.reason.invalidEnhancingPercent'], [], 'renal.bosniak.report.invalidEnhancingPercent');
    }
    if (percent >= 25) {
      return buildResult(
        'notApplicable',
        input,
        ['renal.bosniak.reason.enhancingPercentGe25'],
        ['renal.bosniak.warning.solidMassAlgorithm'],
        'renal.bosniak.report.predominantlySolid',
      );
    }
  } else {
    warnings.push('renal.bosniak.warning.enhancingPercentMissing');
  }
  if (!compatible(input.specialContentPattern, input.acquisition)) {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.incompatiblePattern'],
      warnings,
      'renal.bosniak.report.incompatiblePattern',
    );
  }
  if (isExplicitlyNoncontrast(input.acquisition) && hasAnyEnhancingFeature(input)) {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.enhancementOnNoncontrast'],
      [...warnings, 'renal.bosniak.warning.completeContrastStudy'],
      'renal.bosniak.report.enhancementOnNoncontrast',
    );
  }

  if (input.protrusionEnhances && hasProtrusion(input)) {
    if (input.protrusionMargin === 'acute') {
      return buildResult('IV', input, ['renal.bosniak.reason.classIVAcuteProtrusion'], warnings);
    }
    if (input.protrusionMargin === 'obtuse' && input.protrusionSizeMm >= 4) {
      return buildResult('IV', input, ['renal.bosniak.reason.classIVObtuseNodule'], warnings);
    }
  }

  const classIII: string[] = [];
  if (input.wallEnhances && input.wallThicknessMm >= 4) classIII.push('renal.bosniak.reason.classIIIThickWall');
  if (input.wallEnhances && !input.wallSmooth) classIII.push('renal.bosniak.reason.classIIIWallIrregular');
  if (input.septaCount > 0 && input.septaEnhance && input.maxSeptalThicknessMm >= 4) classIII.push('renal.bosniak.reason.classIIIThickSeptum');
  if (input.septaCount > 0 && input.septaEnhance && !input.septaSmooth) classIII.push('renal.bosniak.reason.classIIISeptumIrregular');
  if (input.protrusionEnhances && input.protrusionMargin === 'obtuse' && input.protrusionSizeMm > 0 && input.protrusionSizeMm < 4) {
    classIII.push('renal.bosniak.reason.classIIIObtuseProtrusion');
  }
  if (classIII.length > 0) return buildResult('III', input, classIII, warnings);

  if (acquisitionModality(input.acquisition) === 'ct' && input.calcification === 'abundantThickOrNodular') {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.calcificationObscures'],
      [...warnings, 'renal.bosniak.warning.mriSubtraction'],
      'renal.bosniak.report.calcifiedIncomplete',
    );
  }
  if (acquisitionModality(input.acquisition) === 'ct' && !input.homogeneous && !hasAnyEnhancingFeature(input)) {
    return buildResult(
      'incomplete',
      input,
      ['renal.bosniak.reason.heterogeneousCtNoEnhancement'],
      [...warnings, 'renal.bosniak.warning.mriHiddenEnhancement'],
      'renal.bosniak.report.heterogeneousCt',
    );
  }
  if (input.specialContentPattern === 'mriT1Heterogeneous') {
    return buildResult('IIF', input, ['renal.bosniak.reason.classIIFHeterogeneousT1'], warnings);
  }

  const classIIF: string[] = [];
  if (input.wallSmooth && input.wallEnhances && input.wallThicknessMm > 2 && input.wallThicknessMm < 4) {
    classIIF.push('renal.bosniak.reason.classIIFMinimalWall');
  }
  if (input.septaCount > 0 && input.septaSmooth && input.septaEnhance && input.maxSeptalThicknessMm > 2 && input.maxSeptalThicknessMm < 4) {
    classIIF.push('renal.bosniak.reason.classIIFMinimalSeptum');
  }
  if (input.septaCount >= 4 && input.septaSmooth && input.septaEnhance && input.maxSeptalThicknessMm <= 2) {
    classIIF.push('renal.bosniak.reason.classIIFManySepta');
  }
  if (classIIF.length > 0) return buildResult('IIF', input, classIIF, warnings);

  if (isClassI(input)) {
    return buildResult('I', input, ['renal.bosniak.reason.classISimple'], warnings);
  }
  if (isClassII(input)) {
    const reasons = classIIReasons(input);
    if (input.protrusionMargin !== 'none' && !input.protrusionEnhances) {
      warnings.push('renal.bosniak.warning.nonenhancingProtrusion');
      reasons.push('renal.bosniak.reason.nonenhancingProtrusion');
    }
    if (input.specialContentPattern === 'ctOver20Nonenhancing' && (input.lesionSizeMm ?? 0) > 30) {
      warnings.push('renal.bosniak.warning.hyperattenuatingGt30');
    }
    return buildResult('II', input, reasons, warnings);
  }

  if (input.wallThicknessMm > 2 && !input.wallEnhances) warnings.push('renal.bosniak.warning.nonenhancingWall');
  if (input.septaCount > 0 && input.maxSeptalThicknessMm > 2 && !input.septaEnhance) warnings.push('renal.bosniak.warning.nonenhancingSepta');
  return buildResult(
    'incomplete',
    input,
    ['renal.bosniak.reason.noSafeClass'],
    [...warnings, 'renal.bosniak.warning.reviewProtocol'],
    'renal.bosniak.report.indeterminate',
  );
}
