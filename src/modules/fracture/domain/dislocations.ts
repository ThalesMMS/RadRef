import { type ClinicalResult, msg } from '../../../core/domain.ts';

export type DislocationJoint =
  | '10A'
  | '10B'
  | '10C'
  | '10D'
  | '20A'
  | '20B'
  | '20C'
  | '30'
  | '40A'
  | '40B'
  | '40C'
  | '70A'
  | '70B'
  | '70C'
  | '70D'
  | '70E'
  | '80A'
  | '80B'
  | '80C'
  | '80D'
  | '80E';

export type DislocationDirection = '5a' | '5b' | '5c' | '5d' | '5e' | '5f';

export type DislocationInput = Readonly<{
  joint: DislocationJoint;
  direction: DislocationDirection;
}>;

export const dislocationJointKeys: Readonly<Record<DislocationJoint, string>> = {
  '10A': 'fracture.dislocation.joint.10A',
  '10B': 'fracture.dislocation.joint.10B',
  '10C': 'fracture.dislocation.joint.10C',
  '10D': 'fracture.dislocation.joint.10D',
  '20A': 'fracture.dislocation.joint.20A',
  '20B': 'fracture.dislocation.joint.20B',
  '20C': 'fracture.dislocation.joint.20C',
  '30': 'fracture.dislocation.joint.30',
  '40A': 'fracture.dislocation.joint.40A',
  '40B': 'fracture.dislocation.joint.40B',
  '40C': 'fracture.dislocation.joint.40C',
  '70A': 'fracture.dislocation.joint.70A',
  '70B': 'fracture.dislocation.joint.70B',
  '70C': 'fracture.dislocation.joint.70C',
  '70D': 'fracture.dislocation.joint.70D',
  '70E': 'fracture.dislocation.joint.70E',
  '80A': 'fracture.dislocation.joint.80A',
  '80B': 'fracture.dislocation.joint.80B',
  '80C': 'fracture.dislocation.joint.80C',
  '80D': 'fracture.dislocation.joint.80D',
  '80E': 'fracture.dislocation.joint.80E',
};

export const dislocationDirectionKeys: Readonly<Record<DislocationDirection, string>> = {
  '5a': 'fracture.dislocation.direction.5a',
  '5b': 'fracture.dislocation.direction.5b',
  '5c': 'fracture.dislocation.direction.5c',
  '5d': 'fracture.dislocation.direction.5d',
  '5e': 'fracture.dislocation.direction.5e',
  '5f': 'fracture.dislocation.direction.5f',
};

export function classifyDislocation(input: DislocationInput): ClinicalResult {
  const code = `${input.joint}[${input.direction}]`;
  return {
    code,
    title: msg('fracture.dislocation.result.title'),
    recommendation: msg('fracture.dislocation.result.code', { code }),
    notes: [
      msg(dislocationJointKeys[input.joint]),
      msg(dislocationDirectionKeys[input.direction]),
      msg('fracture.dislocation.note.distalBoneConvention'),
      msg('fracture.dislocation.note.fractureDislocation'),
    ],
    severity: 'moderate',
  };
}
