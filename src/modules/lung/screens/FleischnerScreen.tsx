import { useMemo, useState } from 'react';
import {
  Banner,
  Button,
  ChoiceRow,
  Disclaimer,
  InputRow,
  ResultCard,
  Screen,
  Section,
  SwitchRow,
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
  const { t } = useI18n();
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

  return (
    <Screen titleKey="lung.tools.fleischner.title" subtitleKey="lung.tools.fleischner.meta">
      <Banner titleKey="lung.fleischner.scopeTitle" textKey="lung.fleischner.scopeText" />
      <Section headerKey="common.inputs" footerKey="lung.fleischner.inputDescription">
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
          helperKey="lung.form.diameterHelper"
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
          variant="list"
        />
        <SwitchRow
          labelKey="lung.form.multipleNodules"
          descriptionKey="lung.form.multipleNodulesDescription"
          value={multiple}
          onValueChange={setMultiple}
        />
      </Section>
      <ResultCard
        badge={result.code}
        title={result.title}
        primary={result.recommendation}
        severity={result.severity}
        notes={result.notes}
        metadata={metadata}
      />
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="lung" />
      <Banner textKey="lung.fleischner.measurementReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
