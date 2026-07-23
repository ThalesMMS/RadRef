import { msg, type MessageRef } from '../../../core/domain.ts';
import type { BosniakCategory } from './bosniak.ts';

export type ManagementInput = Readonly<{
  category: BosniakCategory;
  lesionSizeMm?: number;
  symptomatic: boolean;
  significantComorbidityOrLimitedLifeExpectancy: boolean;
  targetableSolidComponent: boolean;
}>;

export type ManagementResult = Readonly<{
  primary: MessageRef;
  followUp?: MessageRef;
  notes: readonly MessageRef[];
  evidence: MessageRef;
}>;

export function calculateBosniakManagement(input: ManagementInput): ManagementResult {
  if (input.category === 'notApplicable') {
    return {
      primary: msg('renal.management.notApplicable.primary'),
      notes: [msg('renal.management.notApplicable.note')],
      evidence: msg('renal.management.notApplicable.evidence'),
    };
  }
  if (input.category === 'incomplete') {
    return {
      primary: msg('renal.management.incomplete.primary'),
      notes: [
        msg('renal.management.incomplete.noteProtocol'),
        msg('renal.management.incomplete.noteSubtraction'),
      ],
      evidence: msg('renal.management.incomplete.evidence'),
    };
  }
  if (input.category === 'I' || input.category === 'II') {
    if (input.symptomatic) {
      return {
        primary: msg('renal.management.classIOrII.symptomaticPrimary'),
        notes: [
          msg('renal.management.classIOrII.symptomNote'),
          msg('renal.management.classIOrII.growthNote'),
        ],
        evidence: msg('renal.management.classIOrII.evidence'),
      };
    }
    return {
      primary: msg('renal.management.classIOrII.primary'),
      notes: [msg('renal.management.classIOrII.note')],
      evidence: msg('renal.management.classIOrII.evidence'),
    };
  }
  if (input.category === 'IIF') {
    return {
      primary: msg('renal.management.classIIF.primary'),
      followUp: msg('renal.management.classIIF.followUp'),
      notes: [
        msg('renal.management.classIIF.complexityNote'),
        msg('renal.management.classIIF.evidenceNote'),
      ],
      evidence: msg('renal.management.classIIF.evidence'),
    };
  }

  if (input.significantComorbidityOrLimitedLifeExpectancy) {
    return {
      primary: msg('renal.management.classIIIIV.comorbidityPrimary'),
      followUp: msg('renal.management.classIIIIV.comorbidityFollowUp'),
      notes: [msg('renal.management.classIIIIV.comorbidityNote')],
      evidence: msg('renal.management.classIIIIV.evidenceConditional'),
    };
  }

  const size = input.lesionSizeMm;
  if (size === undefined || !Number.isFinite(size) || size <= 0) {
    return {
      primary: msg('renal.management.classIIIIV.sizeRequired'),
      notes: [msg('renal.management.classIIIIV.urologyNote')],
      evidence: msg('renal.management.classIIIIV.sizeEvidence'),
    };
  }

  const notes: MessageRef[] = [
    msg('renal.management.classIIIIV.lowCertainty'),
    msg('renal.management.classIIIIV.partialNephrectomy'),
  ];
  if (input.category === 'IV' && input.targetableSolidComponent) {
    notes.push(msg('renal.management.classIV.biopsyTarget'));
  } else if (input.category === 'III') {
    notes.push(msg('renal.management.classIII.biopsyLowYield'));
  }

  if (size <= 20) {
    return {
      primary: msg('renal.management.classIIIIV.le20Primary'),
      followUp: msg('renal.management.classIIIIV.surveillanceSchedule'),
      notes: [...notes, msg('renal.management.classIIIIV.definitiveOption')],
      evidence: msg('renal.management.classIIIIV.evidenceConditional'),
    };
  }
  if (size <= 40) {
    return {
      primary: msg('renal.management.classIIIIV.20to40Primary'),
      followUp: msg('renal.management.classIIIIV.surveillanceSchedule'),
      notes: [...notes, msg('renal.management.classIIIIV.sharedDecision')],
      evidence: msg('renal.management.classIIIIV.evidenceVeryLow'),
    };
  }
  return {
    primary: msg('renal.management.classIIIIV.gt40Primary'),
    notes: [...notes, msg('renal.management.classIIIIV.selectedSurveillance')],
    evidence: msg('renal.management.classIIIIV.evidenceConditional'),
  };
}
