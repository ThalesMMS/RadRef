import { useMemo, useState } from 'react';
import {
  Banner,
  ChoiceRow,
  Disclaimer,
  InputRow,
  ReportActions,
  ResultCard,
  Screen,
  Section,
  SwitchRow,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import { useI18n } from '../../../core/i18n';
import { parseLocalizedNumber } from '../../../core/numbers';
import {
  calculateFleischner,
  type FleischnerNoduleType,
  type PatientRisk,
} from '../domain';

const noduleTypes: readonly ChoiceOption<FleischnerNoduleType>[] = [
  { value: 'solid', labelKey: 'lung.form.noduleType.solid' },
  { value: 'ggo', labelKey: 'lung.form.noduleType.ggo' },
  { value: 'partSolid', labelKey: 'lung.form.noduleType.partSolid' },
];

const riskOptions: readonly ChoiceOption<PatientRisk>[] = [
  { value: 'low', labelKey: 'lung.form.risk.low', descriptionKey: 'lung.form.risk.lowDescription' },
  { value: 'high', labelKey: 'lung.form.risk.high', descriptionKey: 'lung.form.risk.highDescription' },
];

export function FleischnerScreen() {
  const { t, tx } = useI18n();
  const [noduleType, setNoduleType] = useState<FleischnerNoduleType>('solid');
  const [size, setSize] = useState('6');
  const [solidComponent, setSolidComponent] = useState('0');
  const [risk, setRisk] = useState<PatientRisk>('low');
  const [multiple, setMultiple] = useState(false);

  const reset = () => {
    setNoduleType('solid');
    setSize('6');
    setSolidComponent('0');
    setRisk('low');
    setMultiple(false);
  };

  const result = useMemo(() => {
    const sizeMm = parseLocalizedNumber(size);
    const solidComponentMm = parseLocalizedNumber(solidComponent);
    return calculateFleischner({
      noduleType,
      ...(sizeMm === undefined ? {} : { sizeMm }),
      ...(noduleType === 'partSolid' && solidComponentMm !== undefined ? { solidComponentMm } : {}),
      risk,
      multiple,
    });
  }, [multiple, noduleType, risk, size, solidComponent]);

  const metadata = [
    ...(result.roundedSizeMm === undefined ? [] : [{
      labelKey: 'lung.fleischner.roundedSize',
      value: t('units.mmValue', { value: result.roundedSizeMm }),
    }]),
    ...(result.roundedSolidComponentMm === undefined ? [] : [{
      labelKey: 'lung.fleischner.roundedSolidComponent',
      value: t('units.mmValue', { value: result.roundedSolidComponentMm }),
    }]),
  ];

  const reportText = `${t('lung.tools.fleischner.title')}\n`
    + `${tx(result.title)} (${result.code})\n`
    + `${tx(result.recommendation)}\n`
    + (result.notes.length > 0 ? `\n${t('result.notes')}:\n${result.notes.map((n) => `• ${tx(n)}`).join('\n')}\n` : '')
    + `\n${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="lung.tools.fleischner.title"
      subtitleKey="lung.tools.fleischner.meta"
      switcher={<ToolSwitcher moduleId="lung" current="/lung/fleischner" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.code}
          title={result.title}
          primary={result.recommendation}
          severity={result.severity}
          notes={result.notes}
          metadata={metadata}
        />
      )}
    >
      <Banner titleKey="lung.fleischner.scopeTitle" textKey="lung.fleischner.scopeText" />
      <Section headerKey="common.inputs" infoKey="lung.fleischner.inputDescription">
        <ChoiceRow
          labelKey="lung.form.noduleType"
          options={noduleTypes}
          value={noduleType}
          onChange={setNoduleType}
          variant="chips"
        />
        <InputRow
          labelKey="lung.form.totalDiameter"
          value={size}
          onChangeText={setSize}
          unitKey="units.mm"
          infoKey="lung.form.diameterHelper"
        />
        {noduleType === 'partSolid' ? (
          <InputRow
            labelKey="lung.form.solidComponent"
            value={solidComponent}
            onChangeText={setSolidComponent}
            unitKey="units.mm"
          />
        ) : null}
        <ChoiceRow
          labelKey="lung.form.clinicalRisk"
          options={riskOptions}
          value={risk}
          onChange={setRisk}
          variant="menu"
        />
        <SwitchRow
          labelKey="lung.form.multipleNodules"
          infoKey="lung.form.multipleNodulesDescription"
          value={multiple}
          onValueChange={setMultiple}
        />
      </Section>
      <ReportActions reportText={reportText} shareTitle={t('lung.tools.fleischner.title')} accent="lung" onReset={reset} />
      <Banner textKey="lung.fleischner.measurementReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
