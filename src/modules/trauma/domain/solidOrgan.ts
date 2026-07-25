import { type ClinicalResult, msg } from '../../../core/domain.ts';
import { severityForAastGrade, type AastGrade } from './aastScales.ts';

export type SolidOrgan = 'spleen' | 'liver' | 'kidney';

export type SolidOrganCriterion = Readonly<{
  id: string;
  organ: SolidOrgan;
  grade: Exclude<AastGrade, 'VI'>;
  labelKey: string;
}>;

function criterion(
  organ: SolidOrgan,
  grade: Exclude<AastGrade, 'VI'>,
  id: string,
): SolidOrganCriterion {
  return {
    id: `${organ}-${id}`,
    organ,
    grade,
    labelKey: `trauma.solidOrgan.${organ}.${id}`,
  };
}

export const solidOrganCriteria: readonly SolidOrganCriterion[] = [
  criterion('spleen', 'I', 'g1Hematoma'),
  criterion('spleen', 'I', 'g1Laceration'),
  criterion('spleen', 'II', 'g2Hematoma'),
  criterion('spleen', 'II', 'g2Laceration'),
  criterion('spleen', 'III', 'g3Hematoma'),
  criterion('spleen', 'III', 'g3Laceration'),
  criterion('spleen', 'IV', 'g4VascularContained'),
  criterion('spleen', 'IV', 'g4Devascularization'),
  criterion('spleen', 'V', 'g5BleedingBeyond'),
  criterion('spleen', 'V', 'g5ShatteredOrHilar'),

  criterion('liver', 'I', 'g1Hematoma'),
  criterion('liver', 'I', 'g1Laceration'),
  criterion('liver', 'II', 'g2Hematoma'),
  criterion('liver', 'II', 'g2Laceration'),
  criterion('liver', 'III', 'g3Hematoma'),
  criterion('liver', 'III', 'g3Laceration'),
  criterion('liver', 'III', 'g3VascularContained'),
  criterion('liver', 'IV', 'g4Disruption'),
  criterion('liver', 'IV', 'g4BleedingBeyond'),
  criterion('liver', 'V', 'g5Disruption'),
  criterion('liver', 'V', 'g5Juxtahepatic'),

  criterion('kidney', 'I', 'g1Contusion'),
  criterion('kidney', 'II', 'g2Hematoma'),
  criterion('kidney', 'II', 'g2Laceration'),
  criterion('kidney', 'III', 'g3Laceration'),
  criterion('kidney', 'III', 'g3VascularContained'),
  criterion('kidney', 'IV', 'g4CollectingSystem'),
  criterion('kidney', 'IV', 'g4PelvisUpj'),
  criterion('kidney', 'IV', 'g4SegmentalVessel'),
  criterion('kidney', 'IV', 'g4BleedingBeyond'),
  criterion('kidney', 'IV', 'g4Infarction'),
  criterion('kidney', 'V', 'g5MainVessel'),
  criterion('kidney', 'V', 'g5Devascularized'),
  criterion('kidney', 'V', 'g5Shattered'),
];

export function criteriaForSolidOrgan(organ: SolidOrgan): readonly SolidOrganCriterion[] {
  return solidOrganCriteria.filter((candidate) => candidate.organ === organ);
}

export function classifySolidOrganCriterion(
  organ: SolidOrgan,
  criterionId: string,
): ClinicalResult {
  const selected = solidOrganCriteria.find(
    (candidate) => candidate.organ === organ && candidate.id === criterionId,
  );
  if (!selected) {
    return {
      code: '—',
      title: msg('result.incomplete'),
      recommendation: msg('trauma.solidOrgan.validation.criterion'),
      notes: [msg('trauma.solidOrgan.note.highestCriterion')],
      severity: 'neutral',
    };
  }

  const grade = selected.grade;
  return {
    code: grade,
    title: msg(`trauma.solidOrgan.result.title.${organ}`),
    recommendation: msg('trauma.solidOrgan.result.grade', { grade }),
    notes: [
      msg(selected.labelKey),
      msg('trauma.solidOrgan.note.highestCriterion'),
      msg(organ === 'kidney' ? 'trauma.solidOrgan.note.excretoryPhase' : 'trauma.solidOrgan.note.dualPhase'),
      msg('trauma.solidOrgan.note.notManagement'),
    ],
    severity: severityForAastGrade(grade),
  };
}
