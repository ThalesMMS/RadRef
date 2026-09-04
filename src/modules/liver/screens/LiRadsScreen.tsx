import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Banner,
  Button,
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
import { font, spacing, useTheme } from '../../../theme';
import {
  assessThresholdGrowth,
  calculateLiRads,
  type AncillaryDirection,
  type HccRiskBasis,
  type LiRadsAphe,
} from '../domain';

const riskOptions: readonly ChoiceOption<HccRiskBasis>[] = [
  { value: 'cirrhosis', labelKey: 'liver.liRads.risk.cirrhosis' },
  { value: 'chronicHbv', labelKey: 'liver.liRads.risk.chronicHbv' },
  { value: 'currentOrPriorHcc', labelKey: 'liver.liRads.risk.currentOrPriorHcc' },
  { value: 'none', labelKey: 'liver.liRads.risk.none' },
];

const apheOptions: readonly ChoiceOption<LiRadsAphe>[] = [
  { value: 'none', labelKey: 'liver.liRads.aphe.none' },
  { value: 'nonrim', labelKey: 'liver.liRads.aphe.nonrim' },
];

const ancillaryOptions: readonly ChoiceOption<AncillaryDirection>[] = [
  { value: 'none', labelKey: 'liver.liRads.ancillary.none' },
  { value: 'malignancy', labelKey: 'liver.liRads.ancillary.malignancy' },
  { value: 'benignity', labelKey: 'liver.liRads.ancillary.benignity' },
  { value: 'both', labelKey: 'liver.liRads.ancillary.both' },
];

type SpecialCategory = 'none' | 'tumorInVein' | 'definitelyBenign' | 'probablyBenign' | 'lrMFeatures';

const specialCategoryOptions: readonly ChoiceOption<SpecialCategory>[] = [
  { value: 'none', labelKey: 'liver.liRads.special.none' },
  { value: 'tumorInVein', labelKey: 'liver.liRads.form.tumorInVein', descriptionKey: 'liver.liRads.form.tumorInVeinInfo' },
  { value: 'definitelyBenign', labelKey: 'liver.liRads.form.definitelyBenign' },
  { value: 'probablyBenign', labelKey: 'liver.liRads.form.probablyBenign' },
  { value: 'lrMFeatures', labelKey: 'liver.liRads.form.lrMFeatures', descriptionKey: 'liver.liRads.form.lrMFeaturesInfo' },
];

export function LiRadsScreen() {
  const { t, tx } = useI18n();
  const { colors } = useTheme();
  const [age, setAge] = useState('60');
  const [riskBasis, setRiskBasis] = useState<HccRiskBasis>('cirrhosis');
  const [excludedCirrhosisEtiology, setExcludedCirrhosisEtiology] = useState(false);
  const [adequateExam, setAdequateExam] = useState(true);
  const [pathProven, setPathProven] = useState(false);
  const [treatedObservation, setTreatedObservation] = useState(false);
  const [specialCategory, setSpecialCategory] = useState<SpecialCategory>('none');
  const [size, setSize] = useState('15');
  const [aphe, setAphe] = useState<LiRadsAphe>('none');
  const [enhancingCapsule, setEnhancingCapsule] = useState(false);
  const [nonperipheralWashout, setNonperipheralWashout] = useState(false);
  const [thresholdGrowth, setThresholdGrowth] = useState(false);
  const [ancillaryDirection, setAncillaryDirection] = useState<AncillaryDirection>('none');
  const [currentSize, setCurrentSize] = useState('');
  const [priorSize, setPriorSize] = useState('');
  const [intervalMonths, setIntervalMonths] = useState('');

  const result = useMemo(() => {
    const parsedAge = parseLocalizedNumber(age) ?? 0;
    const sizeMm = parseLocalizedNumber(size);
    return calculateLiRads({
      ageYears: parsedAge,
      riskBasis,
      excludedCirrhosisEtiology,
      adequateExam,
      pathProven,
      treatedObservation,
      definitelyBenign: specialCategory === 'definitelyBenign',
      probablyBenign: specialCategory === 'probablyBenign',
      tumorInVein: specialCategory === 'tumorInVein',
      lrMFeatures: specialCategory === 'lrMFeatures',
      ...(sizeMm === undefined ? {} : { sizeMm }),
      aphe,
      enhancingCapsule,
      nonperipheralWashout,
      thresholdGrowth,
      ancillaryDirection,
    });
  }, [
    adequateExam,
    age,
    ancillaryDirection,
    aphe,
    enhancingCapsule,
    excludedCirrhosisEtiology,
    nonperipheralWashout,
    pathProven,
    riskBasis,
    size,
    specialCategory,
    thresholdGrowth,
    treatedObservation,
  ]);

  const growth = useMemo(() => assessThresholdGrowth(
    parseLocalizedNumber(currentSize),
    parseLocalizedNumber(priorSize),
    parseLocalizedNumber(intervalMonths),
  ), [currentSize, priorSize, intervalMonths]);

  const reset = () => {
    setAge('60');
    setRiskBasis('cirrhosis');
    setExcludedCirrhosisEtiology(false);
    setAdequateExam(true);
    setPathProven(false);
    setTreatedObservation(false);
    setSpecialCategory('none');
    setSize('15');
    setAphe('none');
    setEnhancingCapsule(false);
    setNonperipheralWashout(false);
    setThresholdGrowth(false);
    setAncillaryDirection('none');
    setCurrentSize('');
    setPriorSize('');
    setIntervalMonths('');
  };

  const metadata = result.baseCategory === undefined
    ? []
    : [{ labelKey: 'liver.liRads.metadata.baseCategory', value: result.baseCategory }];

  const reportText = `${t('liver.tools.liRads.title')}\n`
    + `LI-RADS (v2018): ${result.displayCategory} - ${tx(result.title)}\n`
    + `${tx(result.recommendation)}\n`
    + (result.notes.length > 0 ? `\n${t('result.notes')}:\n${result.notes.map((n) => `• ${tx(n)}`).join('\n')}\n` : '')
    + `\n${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="liver.tools.liRads.title"
      subtitleKey="liver.tools.liRads.meta"
      switcher={<ToolSwitcher moduleId="liver" current="/liver/li-rads" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.displayCategory}
          title={result.title}
          primary={result.recommendation}
          severity={result.severity}
          notes={result.notes}
          warnings={result.warnings}
          metadata={metadata}
        />
      )}
    >
      <Banner titleKey="liver.liRads.scopeTitle" textKey="liver.liRads.scopeText" />

      <Section headerKey="liver.liRads.section.applicability">
        <InputRow labelKey="liver.liRads.form.age" value={age} onChangeText={setAge} unitKey="liver.units.years" integer />
        <ChoiceRow labelKey="liver.liRads.form.riskBasis" options={riskOptions} value={riskBasis} onChange={setRiskBasis} variant="menu" />
        <SwitchRow
          labelKey="liver.liRads.form.excludedCirrhosisEtiology"
          infoKey="liver.liRads.form.excludedCirrhosisEtiologyInfo"
          value={excludedCirrhosisEtiology}
          onValueChange={setExcludedCirrhosisEtiology}
        />
        <SwitchRow
          labelKey="liver.liRads.form.adequateExam"
          infoKey="liver.liRads.form.adequateExamInfo"
          value={adequateExam}
          onValueChange={setAdequateExam}
        />
        <SwitchRow
          labelKey="liver.liRads.form.pathProven"
          infoKey="liver.liRads.form.pathProvenInfo"
          value={pathProven}
          onValueChange={setPathProven}
        />
        <SwitchRow
          labelKey="liver.liRads.form.treatedObservation"
          infoKey="liver.liRads.form.treatedObservationInfo"
          value={treatedObservation}
          onValueChange={setTreatedObservation}
        />
      </Section>

      <Section headerKey="liver.liRads.section.special" infoKey="liver.liRads.section.specialInfo">
        <ChoiceRow
          labelKey="liver.liRads.section.specialChoice"
          options={specialCategoryOptions}
          value={specialCategory}
          onChange={setSpecialCategory}
          variant="menu"
        />
      </Section>

      <Section headerKey="liver.liRads.section.majorFeatures">
        <InputRow labelKey="liver.liRads.form.size" value={size} onChangeText={setSize} unitKey="units.mm" />
        <ChoiceRow
          labelKey="liver.liRads.form.aphe"
          infoKey="liver.liRads.form.apheInfo"
          options={apheOptions}
          value={aphe}
          onChange={setAphe}
          variant="segmented"
        />
        <SwitchRow labelKey="liver.liRads.form.enhancingCapsule" value={enhancingCapsule} onValueChange={setEnhancingCapsule} />
        <SwitchRow labelKey="liver.liRads.form.nonperipheralWashout" value={nonperipheralWashout} onValueChange={setNonperipheralWashout} />
        <SwitchRow
          labelKey="liver.liRads.form.thresholdGrowth"
          infoKey="liver.liRads.form.thresholdGrowthInfo"
          value={thresholdGrowth}
          onValueChange={setThresholdGrowth}
        />
      </Section>

      <Section headerKey="liver.liRads.section.ancillary" infoKey="liver.liRads.ancillary.info">
        <ChoiceRow
          labelKey="liver.liRads.form.ancillaryDirection"
          options={ancillaryOptions}
          value={ancillaryDirection}
          onChange={setAncillaryDirection}
          variant="menu"
        />
      </Section>

      <Section headerKey="liver.liRads.section.growth" infoKey="liver.liRads.growth.info">
        <InputRow labelKey="liver.liRads.growth.current" value={currentSize} onChangeText={setCurrentSize} unitKey="units.mm" />
        <InputRow labelKey="liver.liRads.growth.prior" value={priorSize} onChangeText={setPriorSize} unitKey="units.mm" />
        <InputRow labelKey="liver.liRads.growth.interval" value={intervalMonths} onChangeText={setIntervalMonths} unitKey="liver.units.months" />
        <View style={styles.growthRow}>
          <Text style={[styles.growthLabel, { color: colors.textSecondary }]}>{t('liver.liRads.growth.interpretation')}</Text>
          <Text style={[styles.growthText, { color: colors.text }]}>{tx(growth.summary)}</Text>
        </View>
      </Section>

      <ReportActions reportText={reportText} shareTitle={t('liver.tools.liRads.title')} accent="liver" onReset={reset} />
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  growthRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 3,
  },
  growthLabel: { ...font.subhead },
  growthText: { ...font.subhead },
});
