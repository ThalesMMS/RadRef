import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';

export type BrockSex = 'male' | 'female';
export type BrockNoduleType = 'solid' | 'partSolid' | 'nonSolid';

export type BrockInput = Readonly<{
  ageYears?: number;
  sex: BrockSex;
  familyHistoryLungCancer: boolean;
  emphysema: boolean;
  diameterMm?: number;
  noduleType: BrockNoduleType;
  upperLobe: boolean;
  noduleCount?: number;
  spiculation: boolean;
}>;

export type BrockResult = Readonly<{
  valid: boolean;
  probabilityPercent?: number;
  stratum?: 'low' | 'intermediate' | 'high';
  severity: Severity;
  title: MessageRef;
  interpretation: MessageRef;
  notes: readonly MessageRef[];
}>;

export function calculateBrock(input: BrockInput): BrockResult {
  const age = input.ageYears;
  const size = input.diameterMm;
  const count = input.noduleCount;

  if (age === undefined || !Number.isFinite(age) || age < 18) {
    return invalid('validation.ageAtLeast18');
  }
  if (size === undefined || !Number.isFinite(size) || size < 3 || size > 30) {
    return invalid('validation.brockSizeRange');
  }
  if (count === undefined || !Number.isInteger(count) || count < 1) {
    return invalid('validation.noduleCountPositiveInteger');
  }

  let logOdds = -6.7892;
  logOdds += 0.0287 * (age - 62);
  if (input.sex === 'female') logOdds += 0.6011;
  if (input.familyHistoryLungCancer) logOdds += 0.2961;
  if (input.emphysema) logOdds += 0.2953;
  logOdds += -5.3854 * (Math.pow(size / 10, -0.5) - 1.58113883);
  if (input.noduleType === 'nonSolid') logOdds += -0.1276;
  if (input.noduleType === 'partSolid') logOdds += 0.377;
  if (input.upperLobe) logOdds += 0.6581;
  logOdds += -0.0824 * (count - 4);
  if (input.spiculation) logOdds += 0.7729;

  const probability = (Math.exp(logOdds) / (1 + Math.exp(logOdds))) * 100;
  const stratum = probability < 5 ? 'low' : probability < 65 ? 'intermediate' : 'high';
  const severity: Severity = stratum === 'low' ? 'low' : stratum === 'intermediate' ? 'moderate' : 'high';

  return {
    valid: true,
    probabilityPercent: probability,
    stratum,
    severity,
    title: msg('lung.brock.resultTitle'),
    interpretation: msg(`lung.brock.stratum.${stratum}`),
    notes: [
      msg('lung.brock.note.operationalThresholds'),
      msg('lung.brock.note.applicability'),
      msg('lung.brock.note.notManagement'),
    ],
  };
}

function invalid(key: string): BrockResult {
  return {
    valid: false,
    severity: 'neutral',
    title: msg('result.incomplete'),
    interpretation: msg(key),
    notes: [msg('lung.brock.note.applicability')],
  };
}
