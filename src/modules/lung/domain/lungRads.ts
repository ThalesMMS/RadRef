import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';

export type LungRadsCategory = '0' | '1' | '2' | '3' | '4A' | '4B' | '4X';
export type LungRadsNoduleType =
  | 'none'
  | 'solid'
  | 'partSolid'
  | 'ggo'
  | 'juxtapleural'
  | 'airway'
  | 'atypicalCyst';
export type CtStatus = 'baseline' | 'followUp' | 'awaitingComparison' | 'incomplete';
export type NoduleStatus = 'baseline' | 'stable' | 'new' | 'growing' | 'slowGrowing' | 'resolved';
export type AirwayLocation = 'subsegmental' | 'segmentalOrProximal';
export type AtypicalCystMorphology = 'thickWalled' | 'multilocular';
export type AtypicalCystChange =
  | 'baselineOrNew'
  | 'stable'
  | 'growingCysticComponent'
  | 'growingWallOrNodularity'
  | 'growingMultilocular'
  | 'increasedLoculationOrOpacity';

export type LungRadsInput = Readonly<{
  noduleType: LungRadsNoduleType;
  ctStatus: CtStatus;
  noduleStatus: NoduleStatus;
  sizeMm?: number;
  volumeMm3?: number;
  useVolume: boolean;
  solidComponentMm?: number;
  solidComponentGrowth: boolean;
  benignCalcification: boolean;
  macroscopicFat: boolean;
  inflammatoryFindings: boolean;
  additionalSuspiciousFeatures: boolean;
  sModifier: boolean;
  multiple: boolean;
  benignJuxtapleuralMorphology: boolean;
  airwayLocation: AirwayLocation;
  benignAirwaySecretionFeatures: boolean;
  atypicalCystMorphology: AtypicalCystMorphology;
  atypicalCystChange: AtypicalCystChange;
  associatedNoduleCategory?: Exclude<LungRadsCategory, '0' | '1' | '4X'>;
}>;

export type LungRadsResult = Readonly<{
  category: LungRadsCategory;
  displayCategory: string;
  baseCategory?: LungRadsCategory;
  title: MessageRef;
  management: MessageRef;
  notes: readonly MessageRef[];
  warnings: readonly MessageRef[];
  severity: Severity;
  equivalentDiameterMm?: number;
  reclassified: boolean;
}>;

const categoryRank: Readonly<Record<LungRadsCategory, number>> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4A': 4,
  '4B': 5,
  '4X': 6,
};

export function equivalentDiameterFromVolume(volumeMm3: number): number {
  if (!Number.isFinite(volumeMm3) || volumeMm3 <= 0) return 0;
  const diameter = Math.cbrt((6 * volumeMm3) / Math.PI);
  return Math.round(diameter * 10) / 10;
}

export function volumeFromDiameter(diameterMm: number): number {
  if (!Number.isFinite(diameterMm) || diameterMm <= 0) return 0;
  return (Math.PI / 6) * Math.pow(diameterMm, 3);
}

export type GrowthAssessment = Readonly<{
  status?: 'growing' | 'stable';
  deltaMm?: number;
  summary: MessageRef;
}>;

export function assessLungRadsGrowth(currentMm?: number, priorMm?: number, intervalDays?: number): GrowthAssessment {
  if (currentMm === undefined || priorMm === undefined || intervalDays === undefined) {
    return { summary: msg('lung.lungRads.growth.enterValues') };
  }
  if (![currentMm, priorMm, intervalDays].every(Number.isFinite) || currentMm <= 0 || priorMm <= 0 || intervalDays <= 0) {
    return { summary: msg('lung.lungRads.growth.invalidValues') };
  }
  const delta = currentMm - priorMm;
  if (intervalDays > 365) {
    return {
      deltaMm: delta,
      summary: msg('lung.lungRads.growth.manualReview', { delta: delta.toFixed(1), days: intervalDays }),
    };
  }
  if (delta > 1.5) {
    return {
      status: 'growing',
      deltaMm: delta,
      summary: msg('lung.lungRads.growth.growing', { delta: delta.toFixed(1), days: intervalDays }),
    };
  }
  return {
    status: 'stable',
    deltaMm: delta,
    summary: msg('lung.lungRads.growth.stable', { delta: delta.toFixed(1), days: intervalDays }),
  };
}

function managementFor(category: LungRadsCategory, context?: 'inflammatory' | 'incomplete' | 'comparison'): MessageRef {
  if (category === '0') {
    if (context === 'inflammatory') return msg('lung.lungRads.management.0Inflammatory');
    if (context === 'comparison') return msg('lung.lungRads.management.0Comparison');
    return msg('lung.lungRads.management.0Incomplete');
  }
  return msg(`lung.lungRads.management.${category}`);
}

function severityFor(category: LungRadsCategory): Severity {
  if (category === '0' || category === '1') return 'neutral';
  if (category === '2') return 'low';
  if (category === '3') return 'moderate';
  if (category === '4A') return 'high';
  return 'critical';
}

function makeResult(
  input: LungRadsInput,
  category: LungRadsCategory,
  noteKeys: readonly string[],
  options: Readonly<{
    baseCategory?: LungRadsCategory;
    managementContext?: 'inflammatory' | 'incomplete' | 'comparison';
    equivalentDiameterMm?: number;
    warnings?: readonly string[];
  }> = {},
): LungRadsResult {
  let finalCategory = category;
  const notes = noteKeys.map((key) => msg(key));
  const warnings = (options.warnings ?? []).map((key) => msg(key));

  if (input.additionalSuspiciousFeatures && ['3', '4A', '4B'].includes(category)) {
    finalCategory = '4X';
    notes.push(msg('lung.lungRads.note.upgradedTo4X'));
  }
  if (input.multiple) notes.push(msg('lung.lungRads.note.multipleMostSuspicious'));
  if (input.sModifier) notes.push(msg('lung.lungRads.note.sModifier'));

  return {
    category: finalCategory,
    displayCategory: `${finalCategory}${input.sModifier ? 'S' : ''}`,
    ...(options.baseCategory === undefined ? {} : { baseCategory: options.baseCategory }),
    title: msg(`lung.lungRads.category.${finalCategory}`),
    management: managementFor(finalCategory, options.managementContext),
    notes,
    warnings,
    severity: severityFor(finalCategory),
    ...(options.equivalentDiameterMm === undefined ? {} : { equivalentDiameterMm: options.equivalentDiameterMm }),
    reclassified: options.baseCategory !== undefined,
  };
}

function maxCategory(a: LungRadsCategory, b: LungRadsCategory): LungRadsCategory {
  return categoryRank[a] >= categoryRank[b] ? a : b;
}

function getSize(input: LungRadsInput): Readonly<{ value?: number; equivalent?: number }> {
  if (input.useVolume) {
    if (input.volumeMm3 === undefined || !Number.isFinite(input.volumeMm3) || input.volumeMm3 <= 0) return {};
    const equivalent = equivalentDiameterFromVolume(input.volumeMm3);
    return { value: equivalent, equivalent };
  }
  if (input.sizeMm === undefined || !Number.isFinite(input.sizeMm) || input.sizeMm <= 0) return {};
  return { value: input.sizeMm };
}

export function calculateLungRads(input: LungRadsInput): LungRadsResult {
  const size = getSize(input);

  if (input.ctStatus === 'incomplete') {
    return makeResult(input, '0', ['lung.lungRads.note.incomplete'], {
      managementContext: 'incomplete',
      ...(size.equivalent === undefined ? {} : { equivalentDiameterMm: size.equivalent }),
    });
  }
  if (input.ctStatus === 'awaitingComparison') {
    return makeResult(input, '0', ['lung.lungRads.note.awaitingComparison'], {
      managementContext: 'comparison',
      ...(size.equivalent === undefined ? {} : { equivalentDiameterMm: size.equivalent }),
    });
  }
  if (input.noduleType === 'none') {
    return makeResult(input, '1', ['lung.lungRads.note.noNodule']);
  }
  if (input.inflammatoryFindings) {
    return makeResult(input, '0', ['lung.lungRads.note.inflammatory'], {
      managementContext: 'inflammatory',
      ...(size.equivalent === undefined ? {} : { equivalentDiameterMm: size.equivalent }),
    });
  }
  if (input.benignCalcification || input.macroscopicFat) {
    return makeResult(input, '1', ['lung.lungRads.note.definitelyBenign']);
  }
  if (input.noduleStatus === 'resolved') {
    return makeResult(
      input,
      input.noduleType === 'airway' ? '1' : '2',
      [input.noduleType === 'airway' ? 'lung.lungRads.note.airwayResolved' : 'lung.lungRads.note.resolved'],
    );
  }

  if (input.noduleType !== 'airway' && input.noduleType !== 'atypicalCyst' && size.value === undefined) {
    return makeResult(input, '0', ['validation.positiveNoduleSize'], {
      managementContext: 'incomplete',
      warnings: ['lung.lungRads.warning.measurementRequired'],
    });
  }

  const equivalentOptions = size.equivalent === undefined ? {} : { equivalentDiameterMm: size.equivalent };
  let base: LungRadsResult;
  switch (input.noduleType) {
    case 'solid':
      base = calculateSolid(input, size.value ?? 0, equivalentOptions);
      break;
    case 'partSolid':
      base = calculatePartSolid(input, size.value ?? 0, equivalentOptions);
      break;
    case 'ggo':
      base = calculateGgo(input, size.value ?? 0, equivalentOptions);
      break;
    case 'juxtapleural':
      base = calculateJuxtapleural(input, size.value ?? 0, equivalentOptions);
      break;
    case 'airway':
      base = calculateAirway(input);
      break;
    case 'atypicalCyst':
      base = calculateAtypicalCyst(input);
      break;
  }
  return base;
}

type SizeOptions = Readonly<{ equivalentDiameterMm?: number }>;

function calculateSolid(input: LungRadsInput, size: number, options: SizeOptions): LungRadsResult {
  if (input.noduleStatus === 'slowGrowing' && input.ctStatus === 'followUp') {
    return makeResult(input, '4B', ['lung.lungRads.note.slowGrowingSolid4B'], {
      ...options,
      warnings: ['lung.lungRads.warning.slowGrowthAssumption'],
    });
  }
  if (input.noduleStatus === 'growing') {
    return makeResult(input, size < 8 ? '4A' : '4B', [size < 8 ? 'lung.lungRads.note.growingSolidLt8' : 'lung.lungRads.note.growingSolidGe8'], options);
  }
  if (input.noduleStatus === 'new') {
    if (size < 4) return makeResult(input, '2', ['lung.lungRads.note.newSolidLt4'], options);
    if (size < 6) return makeResult(input, '3', ['lung.lungRads.note.newSolid4to6'], options);
    if (size < 8) return makeResult(input, '4A', ['lung.lungRads.note.newSolid6to8'], options);
    return makeResult(input, '4B', ['lung.lungRads.note.newSolidGe8'], options);
  }
  if (input.ctStatus === 'followUp' && input.noduleStatus === 'stable') {
    if (size >= 6 && size < 8) {
      return makeResult(input, '2', ['lung.lungRads.note.stepDown3to2'], { ...options, baseCategory: '3' });
    }
    if (size >= 8 && size < 15) {
      return makeResult(input, '3', ['lung.lungRads.note.stepDown4Ato3'], { ...options, baseCategory: '4A' });
    }
  }
  if (size < 6) return makeResult(input, '2', ['lung.lungRads.note.baselineSolidLt6'], options);
  if (size < 8) return makeResult(input, '3', ['lung.lungRads.note.baselineSolid6to8'], options);
  if (size < 15) return makeResult(input, '4A', ['lung.lungRads.note.baselineSolid8to15'], options);
  return makeResult(input, '4B', ['lung.lungRads.note.baselineSolidGe15'], options);
}

function calculatePartSolid(input: LungRadsInput, totalSize: number, options: SizeOptions): LungRadsResult {
  const solid = input.solidComponentMm ?? 0;
  if (!Number.isFinite(solid) || solid < 0 || solid > totalSize) {
    return makeResult(input, '0', ['validation.solidNotGreaterThanTotal'], {
      ...options,
      managementContext: 'incomplete',
    });
  }
  if (input.noduleStatus === 'slowGrowing' && input.ctStatus === 'followUp') {
    return makeResult(input, '4B', ['lung.lungRads.note.slowGrowingPartSolid4B'], {
      ...options,
      warnings: ['lung.lungRads.warning.slowGrowthAssumption'],
    });
  }
  if (input.noduleStatus === 'growing') {
    if (input.solidComponentGrowth) {
      return makeResult(input, solid < 4 ? '4A' : '4B', [solid < 4 ? 'lung.lungRads.note.growingSolidComponentLt4' : 'lung.lungRads.note.growingSolidComponentGe4'], options);
    }
    return makeResult(input, solid >= 8 ? '4B' : '4A', [solid >= 8 ? 'lung.lungRads.note.growingPartSolidSolidGe8' : 'lung.lungRads.note.growingPartSolidNoSolidGrowth'], options);
  }
  if (input.noduleStatus === 'new') {
    if (totalSize < 6) return makeResult(input, '3', ['lung.lungRads.note.newPartSolidLt6'], options);
    if (solid < 4) return makeResult(input, '4A', ['lung.lungRads.note.newPartSolidSolidLt4'], options);
    return makeResult(input, '4B', ['lung.lungRads.note.newPartSolidSolidGe4'], options);
  }
  if (input.ctStatus === 'followUp' && solid <= 0) {
    return makeResult(input, '2', ['lung.lungRads.note.solidComponentResolved'], options);
  }
  if (input.ctStatus === 'followUp' && input.noduleStatus === 'stable') {
    if (totalSize >= 6 && solid < 6) {
      return makeResult(input, '2', ['lung.lungRads.note.stepDownPartSolid3to2'], { ...options, baseCategory: '3' });
    }
    if (solid >= 6 && solid < 8) {
      return makeResult(input, '3', ['lung.lungRads.note.stepDownPartSolid4Ato3'], { ...options, baseCategory: '4A' });
    }
  }
  if (totalSize < 6) return makeResult(input, '2', ['lung.lungRads.note.baselinePartSolidLt6'], options);
  if (solid < 6) return makeResult(input, '3', ['lung.lungRads.note.baselinePartSolidSolidLt6'], options);
  if (solid < 8) return makeResult(input, '4A', ['lung.lungRads.note.baselinePartSolidSolid6to8'], options);
  return makeResult(input, '4B', ['lung.lungRads.note.baselinePartSolidSolidGe8'], options);
}

function calculateGgo(input: LungRadsInput, size: number, options: SizeOptions): LungRadsResult {
  if (size < 30) return makeResult(input, '2', ['lung.lungRads.note.ggoLt30'], options);
  if (input.noduleStatus === 'stable' || input.noduleStatus === 'slowGrowing') {
    return makeResult(input, '2', ['lung.lungRads.note.ggoGe30Stable'], options);
  }
  return makeResult(input, '3', ['lung.lungRads.note.ggoGe30BaselineOrNew'], options);
}

function calculateJuxtapleural(input: LungRadsInput, size: number, options: SizeOptions): LungRadsResult {
  if (size < 10 && input.benignJuxtapleuralMorphology) {
    return makeResult(input, '2', ['lung.lungRads.note.juxtapleuralBenign'], options);
  }
  const solidInput: LungRadsInput = { ...input, noduleType: 'solid' };
  return calculateSolid(solidInput, size, options);
}

function calculateAirway(input: LungRadsInput): LungRadsResult {
  if (input.benignAirwaySecretionFeatures) {
    return makeResult(input, '2', ['lung.lungRads.note.airwayBenignSecretions']);
  }
  if (input.airwayLocation === 'subsegmental') {
    return makeResult(input, '2', ['lung.lungRads.note.airwaySubsegmental']);
  }
  if (input.ctStatus === 'baseline' || input.noduleStatus === 'new') {
    return makeResult(input, '4A', ['lung.lungRads.note.airwaySegmentalBaseline']);
  }
  return makeResult(input, '4B', ['lung.lungRads.note.airwayPersistent']);
}

function calculateAtypicalCyst(input: LungRadsInput): LungRadsResult {
  let category: LungRadsCategory;
  let note: string;

  switch (input.atypicalCystChange) {
    case 'growingCysticComponent':
      category = '3';
      note = 'lung.lungRads.note.cystGrowingCysticComponent';
      break;
    case 'growingWallOrNodularity':
      category = '4B';
      note = 'lung.lungRads.note.cystGrowingWallOrNodularity';
      break;
    case 'growingMultilocular':
      category = '4B';
      note = 'lung.lungRads.note.cystGrowingMultilocular';
      break;
    case 'increasedLoculationOrOpacity':
      category = '4B';
      note = 'lung.lungRads.note.cystIncreasedLoculationOrOpacity';
      break;
    case 'stable':
      category = '3';
      note = 'lung.lungRads.note.cystStableStepDown';
      break;
    case 'baselineOrNew':
      category = '4A';
      note = input.atypicalCystMorphology === 'thickWalled'
        ? 'lung.lungRads.note.cystThickWalledBaseline'
        : 'lung.lungRads.note.cystMultilocularBaseline';
      break;
  }

  if (input.associatedNoduleCategory) {
    const combined = maxCategory(category, input.associatedNoduleCategory);
    return makeResult(input, combined, [note, 'lung.lungRads.note.cystAssociatedNodule']);
  }
  return makeResult(input, category, [note, 'lung.lungRads.note.cystNoThinWalledClassification']);
}
