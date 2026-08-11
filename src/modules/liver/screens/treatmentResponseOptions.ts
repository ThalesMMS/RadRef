import type { ChoiceOption } from '../../../components';
import type {
  CouinaudSegment,
  HccRiskBasis,
  MasslikeEnhancementAssessment,
  PretreatmentCategory,
  RadiationEnhancementChange,
  TreatmentModality,
  TreatmentType,
} from '../domain';

export const riskOptions: readonly ChoiceOption<HccRiskBasis>[] = [
  { value: 'cirrhosis', labelKey: 'liver.liRads.risk.cirrhosis' },
  { value: 'chronicHbv', labelKey: 'liver.liRads.risk.chronicHbv' },
  { value: 'currentOrPriorHcc', labelKey: 'liver.liRads.risk.currentOrPriorHcc' },
  { value: 'none', labelKey: 'liver.liRads.risk.none' },
];

export const modalityOptions: readonly ChoiceOption<TreatmentModality>[] = [
  { value: 'ct', labelKey: 'liver.tra.modality.ct' },
  { value: 'mri', labelKey: 'liver.tra.modality.mri' },
];

export const treatmentOptions: readonly ChoiceOption<TreatmentType>[] = [
  { value: 'rfa', labelKey: 'liver.tra.treatment.rfa' },
  { value: 'mwa', labelKey: 'liver.tra.treatment.mwa' },
  { value: 'cryoablation', labelKey: 'liver.tra.treatment.cryoablation' },
  { value: 'pea', labelKey: 'liver.tra.treatment.pea' },
  { value: 'tae', labelKey: 'liver.tra.treatment.tae' },
  { value: 'ctace', labelKey: 'liver.tra.treatment.ctace' },
  { value: 'debtace', labelKey: 'liver.tra.treatment.debtace' },
  { value: 'surgicalMargin', labelKey: 'liver.tra.treatment.surgicalMargin' },
  { value: 'sbrt', labelKey: 'liver.tra.treatment.sbrt' },
  { value: 'tare', labelKey: 'liver.tra.treatment.tare' },
  { value: 'systemicOnly', labelKey: 'liver.tra.treatment.systemicOnly' },
  { value: 'unknown', labelKey: 'liver.tra.treatment.unknown' },
];

export const enhancementOptions: readonly ChoiceOption<MasslikeEnhancementAssessment>[] = [
  { value: 'notAssessable', labelKey: 'liver.tra.enhancement.notAssessable' },
  { value: 'absent', labelKey: 'liver.tra.enhancement.absent' },
  { value: 'uncertain', labelKey: 'liver.tra.enhancement.uncertain' },
  { value: 'present', labelKey: 'liver.tra.enhancement.present' },
];

export const radiationChangeOptions: readonly ChoiceOption<RadiationEnhancementChange>[] = [
  { value: 'stableOrDecreased', labelKey: 'liver.tra.radiationChange.stableOrDecreased' },
  { value: 'newOrIncreased', labelKey: 'liver.tra.radiationChange.newOrIncreased' },
  { value: 'uncertain', labelKey: 'liver.tra.radiationChange.uncertain' },
];

export const pretreatmentOptions: readonly ChoiceOption<PretreatmentCategory>[] = [
  { value: 'unknown', labelKey: 'liver.tra.pretreatment.unknown' },
  { value: 'LR-3', labelKey: 'liver.tra.pretreatment.LR-3' },
  { value: 'LR-4', labelKey: 'liver.tra.pretreatment.LR-4' },
  { value: 'LR-5', labelKey: 'liver.tra.pretreatment.LR-5' },
  { value: 'LR-M', labelKey: 'liver.tra.pretreatment.LR-M' },
  { value: 'LR-TIV', labelKey: 'liver.tra.pretreatment.LR-TIV' },
  { value: 'biopsyHcc', labelKey: 'liver.tra.pretreatment.biopsyHcc' },
  { value: 'biopsyNonHccMalignancy', labelKey: 'liver.tra.pretreatment.biopsyNonHccMalignancy' },
];

export const segmentOptions: readonly ChoiceOption<CouinaudSegment>[] = [
  { value: 'unknown', labelKey: 'liver.tra.segment.unknown' },
  { value: 'I', labelKey: 'liver.tra.segment.I' },
  { value: 'II', labelKey: 'liver.tra.segment.II' },
  { value: 'III', labelKey: 'liver.tra.segment.III' },
  { value: 'IVa', labelKey: 'liver.tra.segment.IVa' },
  { value: 'IVb', labelKey: 'liver.tra.segment.IVb' },
  { value: 'V', labelKey: 'liver.tra.segment.V' },
  { value: 'VI', labelKey: 'liver.tra.segment.VI' },
  { value: 'VII', labelKey: 'liver.tra.segment.VII' },
  { value: 'VIII', labelKey: 'liver.tra.segment.VIII' },
];

export function optionLabelKey<T extends string>(
  options: readonly ChoiceOption<T>[],
  value: T,
): string {
  return options.find((option) => option.value === value)?.labelKey ?? 'common.notSelected';
}

