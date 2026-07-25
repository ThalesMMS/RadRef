import { type ClinicalResult, msg } from '../../../core/domain.ts';

export type UcpfJoint = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
export type UcpfType = 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C' | 'D' | 'E' | 'F';

export type PeriprostheticInput = Readonly<{
  joint: UcpfJoint;
  type: UcpfType;
}>;

export type PeriprostheticResult = ClinicalResult & Readonly<{
  modifier: string;
}>;

export const ucpfTypeKeys: Readonly<Record<UcpfType, string>> = {
  A1: 'fracture.periprosthetic.type.A1',
  A2: 'fracture.periprosthetic.type.A2',
  B1: 'fracture.periprosthetic.type.B1',
  B2: 'fracture.periprosthetic.type.B2',
  B3: 'fracture.periprosthetic.type.B3',
  C: 'fracture.periprosthetic.type.C',
  D: 'fracture.periprosthetic.type.D',
  E: 'fracture.periprosthetic.type.E',
  F: 'fracture.periprosthetic.type.F',
};

export function classifyPeriprostheticFracture(input: PeriprostheticInput): PeriprostheticResult {
  const modifier = `[${input.joint}${input.type}]`;
  const severity: ClinicalResult['severity'] = input.type === 'B3'
    ? 'high'
    : input.type === 'B2' || input.type === 'D' || input.type === 'E'
      ? 'moderate'
      : 'low';

  return {
    code: modifier,
    modifier,
    title: msg('fracture.periprosthetic.result.title'),
    recommendation: msg('fracture.periprosthetic.result.modifier', { modifier }),
    notes: [
      msg(ucpfTypeKeys[input.type]),
      msg(`fracture.periprosthetic.joint.${input.joint}`),
      msg('fracture.periprosthetic.note.appendAfterAoCode'),
      msg('fracture.periprosthetic.note.assessStabilityAndBone'),
    ],
    severity,
  };
}
