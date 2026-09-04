import { useMemo, useState } from 'react';
import {
  Banner,
  Disclaimer,
  InputRow,
  ReportActions,
  ResultCard,
  Screen,
  Section,
  ToolSwitcher,
} from '../../../components';
import { useI18n } from '../../../core/i18n';
import { parseLocalizedNumber } from '../../../core/numbers';
import { calculateAdrenalWashout } from '../domain';

export function AdrenalWashoutScreen() {
  const { t, tx } = useI18n();
  const [preContrast, setPreContrast] = useState('35');
  const [earlyContrast, setEarlyContrast] = useState('105');
  const [delayedContrast, setDelayedContrast] = useState('50');
  const [size, setSize] = useState('22');

  const result = useMemo(() => {
    const pre = parseLocalizedNumber(preContrast);
    const early = parseLocalizedNumber(earlyContrast);
    const delayed = parseLocalizedNumber(delayedContrast);
    const sizeMm = parseLocalizedNumber(size);

    return calculateAdrenalWashout({
      ...(pre === undefined ? {} : { preContrast: pre }),
      ...(early === undefined ? {} : { earlyContrast: early }),
      ...(delayed === undefined ? {} : { delayedContrast: delayed }),
      ...(sizeMm === undefined ? {} : { sizeMm }),
    });
  }, [delayedContrast, earlyContrast, preContrast, size]);

  const reset = () => {
    setPreContrast('35');
    setEarlyContrast('105');
    setDelayedContrast('50');
    setSize('22');
  };

  const metadata = [
    ...(result.apwPercent === undefined ? [] : [{
      labelKey: 'renal.adrenal.metadata.apw',
      value: `${result.apwPercent.toFixed(1)}%`,
    }]),
    ...(result.rpwPercent === undefined ? [] : [{
      labelKey: 'renal.adrenal.metadata.rpw',
      value: `${result.rpwPercent.toFixed(1)}%`,
    }]),
  ];

  const reportText = `${t('renal.tools.adrenalWashout.title')}\n`
    + `${tx(result.title)} (${result.metric})\n`
    + `${tx(result.primary)}\n`
    + (result.notes.length > 0 ? `\n${t('result.notes')}:\n${result.notes.map((n) => `• ${tx(n)}`).join('\n')}\n` : '')
    + (result.warnings.length > 0 ? `\n${t('result.warnings')}:\n${result.warnings.map((w) => `• ${tx(w)}`).join('\n')}\n` : '')
    + `\n${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="renal.tools.adrenalWashout.title"
      subtitleKey="renal.tools.adrenalWashout.meta"
      switcher={<ToolSwitcher moduleId="renal" current="/renal/adrenal-washout" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.code}
          title={result.title}
          primary={result.primary}
          severity={result.severity}
          notes={result.notes}
          warnings={result.warnings}
          metadata={metadata}
        />
      )}
    >
      <Banner titleKey="renal.adrenal.scopeTitle" textKey="renal.adrenal.scopeText" />
      <Section
        headerKey="renal.adrenal.section.attenuation"
        infoKey="renal.adrenal.section.attenuationInfo"
      >
        <InputRow
          labelKey="renal.adrenal.form.preContrast"
          infoKey="renal.adrenal.form.preContrastInfo"
          value={preContrast}
          onChangeText={setPreContrast}
          unitKey="units.hu"
        />
        <InputRow
          labelKey="renal.adrenal.form.earlyContrast"
          infoKey="renal.adrenal.form.earlyContrastInfo"
          value={earlyContrast}
          onChangeText={setEarlyContrast}
          unitKey="units.hu"
        />
        <InputRow
          labelKey="renal.adrenal.form.delayedContrast"
          infoKey="renal.adrenal.form.delayedContrastInfo"
          value={delayedContrast}
          onChangeText={setDelayedContrast}
          unitKey="units.hu"
        />
        <InputRow
          labelKey="renal.adrenal.form.size"
          infoKey="renal.adrenal.form.sizeInfo"
          value={size}
          onChangeText={setSize}
          unitKey="units.mm"
        />
      </Section>
      <ReportActions
        reportText={reportText}
        shareTitle={t('renal.tools.adrenalWashout.title')}
        accent="renal"
        onReset={reset}
      />
      <Banner textKey="renal.adrenal.protocolReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
