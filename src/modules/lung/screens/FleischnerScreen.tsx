import { useMemo, useState } from 'react';
import {
  ActionButton,
  AppScreen,
  ChoiceChips,
  Disclaimer,
  InfoBanner,
  NumberField,
  ResultCard,
  SectionCard,
  ToggleRow,
  type ChoiceOption,
} from '../../../components';
import { parseLocalizedNumber } from '../../../core/numbers';
import { useI18n } from '../../../core/i18n';
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
    <AppScreen titleKey="lung.tools.fleischner.title" subtitleKey="lung.tools.fleischner.meta">
      <Disclaimer />
      <InfoBanner titleKey="lung.fleischner.scopeTitle" textKey="lung.fleischner.scopeText" />
      <SectionCard titleKey="common.inputs" descriptionKey="lung.fleischner.inputDescription">
        <ChoiceChips labelKey="lung.form.noduleType" options={noduleTypes} value={noduleType} onChange={setNoduleType} columns={3} />
        <NumberField labelKey="lung.form.totalDiameter" value={size} onChangeText={setSize} unitKey="units.mm" helperKey="lung.form.diameterHelper" />
        {noduleType === 'partSolid' ? (
          <NumberField labelKey="lung.form.solidComponent" value={solidComponent} onChangeText={setSolidComponent} unitKey="units.mm" />
        ) : null}
        <ChoiceChips labelKey="lung.form.clinicalRisk" options={riskOptions} value={risk} onChange={setRisk} columns={1} />
        <ToggleRow labelKey="lung.form.multipleNodules" descriptionKey="lung.form.multipleNodulesDescription" value={multiple} onValueChange={setMultiple} />
      </SectionCard>
      <ResultCard
        badge={result.code}
        title={result.title}
        primary={result.recommendation}
        severity={result.severity}
        notes={result.notes}
        metadata={metadata}
      />
      <ActionButton labelKey="common.resetForm" onPress={reset} tone="lung" />
      <InfoBanner textKey="lung.fleischner.measurementReminder" tone="warning" />
    </AppScreen>
  );
}
