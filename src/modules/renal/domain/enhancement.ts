import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';

export type EnhancementModality = 'ct' | 'mri';
export type EnhancementStatus = 'confirmed' | 'indeterminate' | 'notConfirmed' | 'insufficient';

export type EnhancementInput = Readonly<{
  modality: EnhancementModality;
  visuallyUnequivocal: boolean;
  preContrast?: number;
  postContrast?: number;
}>;

export type EnhancementResult = Readonly<{
  status: EnhancementStatus;
  title: MessageRef;
  metric: string;
  interpretation: MessageRef;
  severity: Severity;
}>;

export function calculateEnhancement(input: EnhancementInput): EnhancementResult {
  if (input.visuallyUnequivocal) {
    return {
      status: 'confirmed',
      title: msg('renal.enhancement.status.confirmed'),
      metric: '—',
      interpretation: msg('renal.enhancement.visualConfirmed'),
      severity: 'high',
    };
  }
  const pre = input.preContrast;
  const post = input.postContrast;
  if (pre === undefined || post === undefined || !Number.isFinite(pre) || !Number.isFinite(post)) {
    return {
      status: 'insufficient',
      title: msg('renal.enhancement.status.insufficient'),
      metric: '—',
      interpretation: msg('renal.enhancement.insufficient'),
      severity: 'neutral',
    };
  }
  if (input.modality === 'ct') {
    const delta = post - pre;
    const metric = `Δ ${delta.toFixed(1)} HU`;
    if (delta >= 20) {
      return {
        status: 'confirmed',
        title: msg('renal.enhancement.status.confirmed'),
        metric,
        interpretation: msg('renal.enhancement.ctConfirmed'),
        severity: 'high',
      };
    }
    if (delta >= 10) {
      return {
        status: 'indeterminate',
        title: msg('renal.enhancement.status.indeterminate'),
        metric,
        interpretation: msg('renal.enhancement.ctIndeterminate'),
        severity: 'moderate',
      };
    }
    return {
      status: 'notConfirmed',
      title: msg('renal.enhancement.status.notConfirmed'),
      metric,
      interpretation: msg('renal.enhancement.ctNotConfirmed'),
      severity: 'low',
    };
  }

  if (pre <= 0) {
    return {
      status: 'insufficient',
      title: msg('renal.enhancement.status.insufficient'),
      metric: '—',
      interpretation: msg('renal.enhancement.mriPositivePreRequired'),
      severity: 'neutral',
    };
  }
  const percent = ((post - pre) / pre) * 100;
  const metric = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  if (percent >= 15) {
    return {
      status: 'confirmed',
      title: msg('renal.enhancement.status.confirmed'),
      metric,
      interpretation: msg('renal.enhancement.mriConfirmed'),
      severity: 'high',
    };
  }
  return {
    status: 'notConfirmed',
    title: msg('renal.enhancement.status.notConfirmed'),
    metric,
    interpretation: msg('renal.enhancement.mriNotConfirmed'),
    severity: 'low',
  };
}
