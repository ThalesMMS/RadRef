import { type ClinicalResult, msg } from '../../../core/domain.ts';

export type PediatricBone = 'humerus' | 'radius' | 'ulna' | 'femur' | 'tibia' | 'fibula';
export type PediatricSegment = 'proximal' | 'diaphyseal' | 'distal';
export type PediatricSubsegment = 'E' | 'M' | 'D';
export type PediatricSeverity = '1' | '2';
export type PediatricQualification = 'none' | 'I' | 'II' | 'III' | 'IV';

export type PediatricPattern =
  | 'E1'
  | 'E2'
  | 'E3'
  | 'E4'
  | 'E5'
  | 'E6'
  | 'E7'
  | 'E8'
  | 'E9'
  | 'M2'
  | 'M3'
  | 'M7'
  | 'M9'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6'
  | 'D7'
  | 'D9';

export type PediatricFractureInput = Readonly<{
  bone: PediatricBone;
  segment: PediatricSegment;
  subsegment: PediatricSubsegment;
  pattern: PediatricPattern;
  severity: PediatricSeverity;
  qualification: PediatricQualification;
}>;

export type PediatricFractureResult = ClinicalResult & Readonly<{
  locationCode?: string;
}>;

const bonePrefix: Readonly<Record<PediatricBone, string>> = {
  humerus: '1',
  radius: '2r',
  ulna: '2u',
  femur: '3',
  tibia: '4t',
  fibula: '4f',
};

const segmentNumber: Readonly<Record<PediatricSegment, string>> = {
  proximal: '1',
  diaphyseal: '2',
  distal: '3',
};

export const pediatricPatternKeys: Readonly<Record<PediatricPattern, string>> = {
  E1: 'fracture.pediatric.pattern.E1',
  E2: 'fracture.pediatric.pattern.E2',
  E3: 'fracture.pediatric.pattern.E3',
  E4: 'fracture.pediatric.pattern.E4',
  E5: 'fracture.pediatric.pattern.E5',
  E6: 'fracture.pediatric.pattern.E6',
  E7: 'fracture.pediatric.pattern.E7',
  E8: 'fracture.pediatric.pattern.E8',
  E9: 'fracture.pediatric.pattern.E9',
  M2: 'fracture.pediatric.pattern.M2',
  M3: 'fracture.pediatric.pattern.M3',
  M7: 'fracture.pediatric.pattern.M7',
  M9: 'fracture.pediatric.pattern.M9',
  D1: 'fracture.pediatric.pattern.D1',
  D2: 'fracture.pediatric.pattern.D2',
  D3: 'fracture.pediatric.pattern.D3',
  D4: 'fracture.pediatric.pattern.D4',
  D5: 'fracture.pediatric.pattern.D5',
  D6: 'fracture.pediatric.pattern.D6',
  D7: 'fracture.pediatric.pattern.D7',
  D9: 'fracture.pediatric.pattern.D9',
};

export function allowedSubsegments(segment: PediatricSegment): readonly PediatricSubsegment[] {
  return segment === 'diaphyseal' ? ['D'] : ['E', 'M'];
}

export function allowedPediatricPatterns(subsegment: PediatricSubsegment): readonly PediatricPattern[] {
  if (subsegment === 'E') return ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'];
  if (subsegment === 'M') return ['M2', 'M3', 'M7', 'M9'];
  return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D9'];
}

function locationCode(bone: PediatricBone, segment: PediatricSegment): string {
  const segmentCode = segmentNumber[segment];
  if (bone === 'radius' || bone === 'ulna') return `2${segmentCode}${bonePrefix[bone].slice(1)}`;
  if (bone === 'tibia' || bone === 'fibula') return `4${segmentCode}${bonePrefix[bone].slice(1)}`;
  return `${bonePrefix[bone]}${segmentCode}`;
}

function incomplete(messageKey: string): PediatricFractureResult {
  return {
    code: '—',
    title: msg('result.incomplete'),
    recommendation: msg(messageKey),
    notes: [msg('fracture.pediatric.note.pccfScope')],
    severity: 'neutral',
  };
}

export function classifyPediatricFracture(input: PediatricFractureInput): PediatricFractureResult {
  if (!allowedSubsegments(input.segment).includes(input.subsegment)) {
    return incomplete('fracture.pediatric.validation.subsegment');
  }
  if (!allowedPediatricPatterns(input.subsegment).includes(input.pattern)) {
    return incomplete('fracture.pediatric.validation.pattern');
  }

  const location = locationCode(input.bone, input.segment);
  const patternNumber = input.pattern.slice(1);
  const qualification = input.qualification === 'none' ? '' : `(${input.qualification})`;
  const code = `${location}-${input.subsegment}/${patternNumber}.${input.severity}${qualification}`;

  const severity: ClinicalResult['severity'] = input.severity === '2' ? 'moderate' : 'low';
  const warnings = input.qualification === 'none'
    ? [msg('fracture.pediatric.note.qualificationsOptional')]
    : undefined;

  return {
    code,
    locationCode: location,
    title: msg('fracture.pediatric.result.title'),
    recommendation: msg('fracture.pediatric.result.code', { code }),
    notes: [
      msg(pediatricPatternKeys[input.pattern]),
      msg(`fracture.pediatric.severity.${input.severity}`),
      msg('fracture.pediatric.note.ageAndGrowth'),
    ],
    ...(warnings ? { warnings } : {}),
    severity,
  };
}
