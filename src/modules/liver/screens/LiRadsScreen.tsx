import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

export function LiRadsScreen() {
  const { t, tx } = useI18n();
  const { colors } = useTheme();
  const [age, setAge] = useState('60');
  const [riskBasis, setRiskBasis] = useState<HccRiskBasis>('cirrhosis');
  const [excludedCirrhosisEtiology, setExcludedCirrhosisEtiology] = useState(false);
  const [adequateExam, setAdequateExam] = useState(true);
  const [pathProven, setPathProven] = useState(false);
  const [treatedObservation, setTreatedObservation] = useState(false);
  const [tumorInVein, setTumorInVein] = useState(false);
  const [definitelyBenign, setDefinitelyBenign] = useState(true);
  const [probablyBenign, setProbablyBenign] = useState(false);
  const [lrMFeatures, setLrMFeatures] = useState(false);
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
      definitelyBenign,
      probablyBenign,
      tumorInVein,
      lrMFeatures,
      ...(sizeMm === undefined ? {} : { sizeMm }),
      aphe,
      enhancingCapsule,
      nonperipheralWashout,
      thresholdGrowth,
      ancillaryDirection,
    });
  }, [
    age,
    riskBasis,
    excludedCirrhosisEtiology,
    adequateExam,
    pathProven,
    treatedObservation,
    definitelyBenign,
    probablyBenign,
    tumorInVein,
    lrMFeatures,
    size,
    aphe,
    enhancingCapsule,
    nonperipheralWashout,
    thresholdGrowth,
    ancillaryDirection,
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
    setTumorInVein(false);
    setDefinitelyBenign(true);
    setProbablyBenign(false);
    setLrMFeatures(false);
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

      <Section headerKey="liver.liRads.section.special">
        <SwitchRow
          labelKey="liver.liRads.form.tumorInVein"
          infoKey="liver.liRads.form.tumorInVeinInfo"
          value={tumorInVein}
          onValueChange={setTumorInVein}
        />
        <SwitchRow labelKey="liver.liRads.form.definitelyBenign" value={definitelyBenign} onValueChange={setDefinitelyBenign} />
        <SwitchRow labelKey="liver.liRads.form.probablyBenign" value={probablyBenign} onValueChange={setProbablyBenign} />
        <SwitchRow
          labelKey="liver.liRads.form.lrMFeatures"
          infoKey="liver.liRads.form.lrMFeaturesInfo"
          value={lrMFeatures}
          onValueChange={setLrMFeatures}
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

      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="trauma" />
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
