import { msg, type MessageRef, type Severity } from '../../../core/domain.ts';

export type AdrenalWashoutStatus =
  | 'lipidRichAdenoma'
  | 'adenoma'
  | 'nonAdenoma'
  | 'insufficientEnhancement'
  | 'insufficientData';

export type AdrenalWashoutInput = Readonly<{
  preContrast?: number;
  earlyContrast?: number;
  delayedContrast?: number;
  sizeMm?: number;
}>;

export type AdrenalWashoutResult = Readonly<{
  status: AdrenalWashoutStatus;
  code: string;
  title: MessageRef;
  primary: MessageRef;
  apwPercent?: number;
  rpwPercent?: number;
  metric: string;
  severity: Severity;
  notes: readonly MessageRef[];
  warnings: readonly MessageRef[];
}>;

export function calculateAdrenalWashout(input: AdrenalWashoutInput): AdrenalWashoutResult {
  const { preContrast, earlyContrast, delayedContrast, sizeMm } = input;
  const notes: MessageRef[] = [];
  const warnings: MessageRef[] = [];

  if (sizeMm !== undefined && Number.isFinite(sizeMm) && sizeMm >= 40) {
    warnings.push(msg('renal.adrenal.warning.largeMass'));
  }

  // Check unenhanced baseline first: <= 10 HU is diagnostic of lipid-rich adenoma
  const hasPre = preContrast !== undefined && Number.isFinite(preContrast);
  const isLipidRich = hasPre && preContrast <= 10;

  const hasEarly = earlyContrast !== undefined && Number.isFinite(earlyContrast);
  const hasDelayed = delayedContrast !== undefined && Number.isFinite(delayedContrast);

  if (isLipidRich && (!hasEarly || !hasDelayed)) {
    return {
      status: 'lipidRichAdenoma',
      code: 'Adenoma',
      title: msg('renal.adrenal.status.lipidRich'),
      primary: msg('renal.adrenal.lipidRichPrimary'),
      metric: `${preContrast.toFixed(1)} HU`,
      severity: 'low',
      notes: [
        msg('renal.adrenal.note.lipidRichThreshold'),
        msg('renal.adrenal.note.pheochromocytoma'),
      ],
      warnings,
    };
  }

  if (!hasEarly || !hasDelayed) {
    return {
      status: 'insufficientData',
      code: '—',
      title: msg('renal.adrenal.status.insufficientData'),
      primary: msg('renal.adrenal.insufficientDataPrimary'),
      metric: '—',
      severity: 'neutral',
      notes: [msg('renal.adrenal.note.protocolRequirements')],
      warnings,
    };
  }

  // If pre-contrast is available, check early enhancement delta
  if (hasPre) {
    const deltaEarly = earlyContrast - preContrast;
    if (deltaEarly < 10) {
      return {
        status: 'insufficientEnhancement',
        code: 'Δ < 10 HU',
        title: msg('renal.adrenal.status.insufficientEnhancement'),
        primary: msg('renal.adrenal.insufficientEnhancementPrimary'),
        metric: `Δ ${deltaEarly.toFixed(1)} HU`,
        severity: 'neutral',
        notes: [
          msg('renal.adrenal.note.insufficientEnhancement'),
          msg('renal.adrenal.note.pheochromocytoma'),
        ],
        warnings,
      };
    }

    // Calculate Absolute Percentage Washout (APW)
    const apw = ((earlyContrast - delayedContrast) / deltaEarly) * 100;
    const apwRounded = Math.round(apw * 10) / 10;
    const metric = `APW ${apwRounded >= 0 ? '+' : ''}${apwRounded.toFixed(1)}%`;

    if (isLipidRich) {
      notes.push(msg('renal.adrenal.note.lipidRichBaseline'));
    }
    notes.push(msg('renal.adrenal.note.pheochromocytoma'));

    if (apw >= 60) {
      return {
        status: 'adenoma',
        code: 'Adenoma (APW)',
        title: msg('renal.adrenal.status.adenoma'),
        primary: msg('renal.adrenal.apwAdenomaPrimary'),
        apwPercent: apwRounded,
        metric,
        severity: 'low',
        notes,
        warnings,
      };
    }

    return {
      status: 'nonAdenoma',
      code: 'Indeterminate',
      title: msg('renal.adrenal.status.nonAdenoma'),
      primary: msg('renal.adrenal.apwNonAdenomaPrimary'),
      apwPercent: apwRounded,
      metric,
      severity: 'moderate',
      notes,
      warnings,
    };
  }

  // Pre-contrast not available: calculate Relative Percentage Washout (RPW)
  if (earlyContrast <= 0) {
    return {
      status: 'insufficientData',
      code: '—',
      title: msg('renal.adrenal.status.insufficientData'),
      primary: msg('renal.adrenal.earlyPositiveRequired'),
      metric: '—',
      severity: 'neutral',
      notes: [msg('renal.adrenal.note.protocolRequirements')],
      warnings,
    };
  }

  const rpw = ((earlyContrast - delayedContrast) / earlyContrast) * 100;
  const rpwRounded = Math.round(rpw * 10) / 10;
  const metric = `RPW ${rpwRounded >= 0 ? '+' : ''}${rpwRounded.toFixed(1)}%`;

  notes.push(msg('renal.adrenal.note.rpwCaveat'));
  notes.push(msg('renal.adrenal.note.pheochromocytoma'));

  if (rpw >= 40) {
    return {
      status: 'adenoma',
      code: 'Adenoma (RPW)',
      title: msg('renal.adrenal.status.adenoma'),
      primary: msg('renal.adrenal.rpwAdenomaPrimary'),
      rpwPercent: rpwRounded,
      metric,
      severity: 'low',
      notes,
      warnings,
    };
  }

  return {
    status: 'nonAdenoma',
    code: 'Indeterminate',
    title: msg('renal.adrenal.status.nonAdenoma'),
    primary: msg('renal.adrenal.rpwNonAdenomaPrimary'),
    rpwPercent: rpwRounded,
    metric,
    severity: 'moderate',
    notes,
    warnings,
  };
}
