import { useMemo, useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
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
import { useI18n } from '../../../core/i18n';
import { parseLocalizedNumber } from '../../../core/numbers';
import { colors, radii, spacing } from '../../../theme';
import {
  assessLungRadsGrowth,
  calculateLungRads,
  type AirwayLocation,
  type AtypicalCystChange,
  type AtypicalCystMorphology,
  type CtStatus,
  type LungRadsCategory,
  type LungRadsNoduleType,
  type NoduleStatus,
} from '../domain';

const ctOptions: readonly ChoiceOption<CtStatus>[] = [
  { value: 'baseline', labelKey: 'lung.lungRads.ctStatus.baseline' },
  { value: 'followUp', labelKey: 'lung.lungRads.ctStatus.followUp' },
  { value: 'awaitingComparison', labelKey: 'lung.lungRads.ctStatus.awaitingComparison' },
  { value: 'incomplete', labelKey: 'lung.lungRads.ctStatus.incomplete' },
];

const typeOptions: readonly ChoiceOption<LungRadsNoduleType>[] = [
  { value: 'none', labelKey: 'lung.lungRads.type.none' },
  { value: 'solid', labelKey: 'lung.form.noduleType.solid' },
  { value: 'partSolid', labelKey: 'lung.form.noduleType.partSolid' },
  { value: 'ggo', labelKey: 'lung.form.noduleType.ggo' },
  { value: 'juxtapleural', labelKey: 'lung.lungRads.type.juxtapleural' },
  { value: 'airway', labelKey: 'lung.lungRads.type.airway' },
  { value: 'atypicalCyst', labelKey: 'lung.lungRads.type.atypicalCyst' },
];

const statusOptions: readonly ChoiceOption<NoduleStatus>[] = [
  { value: 'baseline', labelKey: 'lung.lungRads.status.baseline' },
  { value: 'stable', labelKey: 'lung.lungRads.status.stable' },
  { value: 'new', labelKey: 'lung.lungRads.status.new' },
  { value: 'growing', labelKey: 'lung.lungRads.status.growing' },
  { value: 'slowGrowing', labelKey: 'lung.lungRads.status.slowGrowing' },
  { value: 'resolved', labelKey: 'lung.lungRads.status.resolved' },
];

const airwayOptions: readonly ChoiceOption<AirwayLocation>[] = [
  { value: 'subsegmental', labelKey: 'lung.lungRads.airway.subsegmental' },
  { value: 'segmentalOrProximal', labelKey: 'lung.lungRads.airway.segmentalOrProximal' },
];

const cystMorphologyOptions: readonly ChoiceOption<AtypicalCystMorphology>[] = [
  { value: 'thickWalled', labelKey: 'lung.lungRads.cyst.thickWalled' },
  { value: 'multilocular', labelKey: 'lung.lungRads.cyst.multilocular' },
];

const cystChangeOptions: readonly ChoiceOption<AtypicalCystChange>[] = [
  { value: 'baselineOrNew', labelKey: 'lung.lungRads.cyst.change.baselineOrNew' },
  { value: 'stable', labelKey: 'lung.lungRads.cyst.change.stable' },
  { value: 'growingCysticComponent', labelKey: 'lung.lungRads.cyst.change.growingCysticComponent' },
  { value: 'growingWallOrNodularity', labelKey: 'lung.lungRads.cyst.change.growingWallOrNodularity' },
  { value: 'growingMultilocular', labelKey: 'lung.lungRads.cyst.change.growingMultilocular' },
  { value: 'increasedLoculationOrOpacity', labelKey: 'lung.lungRads.cyst.change.increasedLoculationOrOpacity' },
];

const associatedCategoryOptions: readonly ChoiceOption<Exclude<LungRadsCategory, '0' | '1' | '4X'>>[] = [
  { value: '2', labelKey: 'lung.lungRads.category.2' },
  { value: '3', labelKey: 'lung.lungRads.category.3' },
  { value: '4A', labelKey: 'lung.lungRads.category.4A' },
  { value: '4B', labelKey: 'lung.lungRads.category.4B' },
];

export function LungRadsScreen() {
  const { t, tx } = useI18n();
  const router = useRouter();
  const [ctStatus, setCtStatus] = useState<CtStatus>('baseline');
  const [noduleType, setNoduleType] = useState<LungRadsNoduleType>('solid');
  const [noduleStatus, setNoduleStatus] = useState<NoduleStatus>('baseline');
  const [useVolume, setUseVolume] = useState(false);
  const [size, setSize] = useState('6');
  const [volume, setVolume] = useState('113');
  const [solidComponent, setSolidComponent] = useState('0');
  const [solidComponentGrowth, setSolidComponentGrowth] = useState(false);
  const [benignCalcification, setBenignCalcification] = useState(false);
  const [macroscopicFat, setMacroscopicFat] = useState(false);
  const [inflammatoryFindings, setInflammatoryFindings] = useState(false);
  const [additionalSuspiciousFeatures, setAdditionalSuspiciousFeatures] = useState(false);
  const [sModifier, setSModifier] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [benignJuxtapleuralMorphology, setBenignJuxtapleuralMorphology] = useState(true);
  const [airwayLocation, setAirwayLocation] = useState<AirwayLocation>('subsegmental');
  const [benignAirwaySecretionFeatures, setBenignAirwaySecretionFeatures] = useState(false);
  const [cystMorphology, setCystMorphology] = useState<AtypicalCystMorphology>('thickWalled');
  const [cystChange, setCystChange] = useState<AtypicalCystChange>('baselineOrNew');
  const [hasAssociatedNodule, setHasAssociatedNodule] = useState(false);
  const [associatedCategory, setAssociatedCategory] = useState<Exclude<LungRadsCategory, '0' | '1' | '4X'>>('2');
  const [currentDiameter, setCurrentDiameter] = useState('');
  const [priorDiameter, setPriorDiameter] = useState('');
  const [intervalDays, setIntervalDays] = useState('');

  const reset = () => {
    setCtStatus('baseline');
    setNoduleType('solid');
    setNoduleStatus('baseline');
    setUseVolume(false);
    setSize('6');
    setVolume('113');
    setSolidComponent('0');
    setSolidComponentGrowth(false);
    setBenignCalcification(false);
    setMacroscopicFat(false);
    setInflammatoryFindings(false);
    setAdditionalSuspiciousFeatures(false);
    setSModifier(false);
    setMultiple(false);
    setBenignJuxtapleuralMorphology(true);
    setAirwayLocation('subsegmental');
    setBenignAirwaySecretionFeatures(false);
    setCystMorphology('thickWalled');
    setCystChange('baselineOrNew');
    setHasAssociatedNodule(false);
    setAssociatedCategory('2');
    setCurrentDiameter('');
    setPriorDiameter('');
    setIntervalDays('');
  };

  const result = useMemo(() => {
    const sizeMm = parseLocalizedNumber(size);
    const volumeMm3 = parseLocalizedNumber(volume);
    const solidComponentMm = parseLocalizedNumber(solidComponent);
    return calculateLungRads({
      noduleType,
      ctStatus,
      noduleStatus,
      ...(sizeMm === undefined ? {} : { sizeMm }),
      ...(volumeMm3 === undefined ? {} : { volumeMm3 }),
      useVolume,
      ...(solidComponentMm === undefined ? {} : { solidComponentMm }),
      solidComponentGrowth,
      benignCalcification,
      macroscopicFat,
      inflammatoryFindings,
      additionalSuspiciousFeatures,
      sModifier,
      multiple,
      benignJuxtapleuralMorphology,
      airwayLocation,
      benignAirwaySecretionFeatures,
      atypicalCystMorphology: cystMorphology,
      atypicalCystChange: cystChange,
      ...(hasAssociatedNodule ? { associatedNoduleCategory: associatedCategory } : {}),
    });
  }, [
    additionalSuspiciousFeatures,
    airwayLocation,
    associatedCategory,
    benignAirwaySecretionFeatures,
    benignCalcification,
    benignJuxtapleuralMorphology,
    ctStatus,
    cystChange,
    cystMorphology,
    hasAssociatedNodule,
    inflammatoryFindings,
    macroscopicFat,
    multiple,
    noduleStatus,
    noduleType,
    sModifier,
    size,
    solidComponent,
    solidComponentGrowth,
    useVolume,
    volume,
  ]);

  const growth = useMemo(() => assessLungRadsGrowth(
    parseLocalizedNumber(currentDiameter),
    parseLocalizedNumber(priorDiameter),
    parseLocalizedNumber(intervalDays),
  ), [currentDiameter, intervalDays, priorDiameter]);

  const needsSize = !['none', 'airway', 'atypicalCyst'].includes(noduleType);
  const brockType = noduleType === 'ggo'
    ? 'nonSolid'
    : noduleType === 'solid' || noduleType === 'partSolid' || noduleType === 'juxtapleural'
      ? noduleType === 'juxtapleural' ? 'solid' : noduleType
      : undefined;
  const brockDiameter = result.equivalentDiameterMm ?? parseLocalizedNumber(size);
  const canOpenBrock = result.category === '4B'
    && brockType !== undefined
    && brockDiameter !== undefined
    && brockDiameter >= 3
    && brockDiameter <= 30;

  const openBrock = () => {
    if (!canOpenBrock || brockType === undefined || brockDiameter === undefined) return;
    router.push({
      pathname: '/lung/brock',
      params: {
        diameter: brockDiameter.toFixed(1),
        type: brockType,
        count: multiple ? '2' : '1',
        source: 'lungRads',
      },
    } as Href);
  };

  const metadata = [
    ...(result.equivalentDiameterMm === undefined ? [] : [{
      labelKey: 'lung.lungRads.equivalentDiameter',
      value: t('units.mmValue', { value: result.equivalentDiameterMm.toFixed(1) }),
    }]),
    ...(result.baseCategory === undefined ? [] : [{
      labelKey: 'lung.lungRads.baseCategory',
      value: result.baseCategory,
    }]),
  ];

  return (
    <AppScreen titleKey="lung.tools.lungRads.title" subtitleKey="lung.tools.lungRads.meta">
      <Disclaimer />
      <InfoBanner titleKey="lung.lungRads.scopeTitle" textKey="lung.lungRads.scopeText" />
      <SectionCard titleKey="lung.lungRads.studySection">
        <ChoiceChips labelKey="lung.lungRads.ctStatus" options={ctOptions} value={ctStatus} onChange={setCtStatus} />
        <ChoiceChips labelKey="lung.form.noduleType" options={typeOptions} value={noduleType} onChange={setNoduleType} columns={2} />
        {noduleType !== 'none' ? (
          <ChoiceChips labelKey="lung.lungRads.noduleStatus" options={statusOptions} value={noduleStatus} onChange={setNoduleStatus} columns={3} />
        ) : null}
      </SectionCard>

      {needsSize ? (
        <SectionCard titleKey="lung.lungRads.measurementSection" descriptionKey="lung.lungRads.measurementDescription">
          <ToggleRow labelKey="lung.lungRads.useVolume" value={useVolume} onValueChange={setUseVolume} />
          {useVolume ? (
            <NumberField labelKey="lung.lungRads.volume" value={volume} onChangeText={setVolume} unitKey="units.mm3" />
          ) : (
            <NumberField labelKey="lung.form.totalDiameter" value={size} onChangeText={setSize} unitKey="units.mm" />
          )}
          {noduleType === 'partSolid' ? (
            <>
              <NumberField labelKey="lung.form.solidComponent" value={solidComponent} onChangeText={setSolidComponent} unitKey="units.mm" />
              <ToggleRow labelKey="lung.lungRads.solidComponentGrowth" value={solidComponentGrowth} onValueChange={setSolidComponentGrowth} />
            </>
          ) : null}
          {noduleType === 'juxtapleural' ? (
            <ToggleRow
              labelKey="lung.lungRads.benignJuxtapleuralMorphology"
              descriptionKey="lung.lungRads.benignJuxtapleuralDescription"
              value={benignJuxtapleuralMorphology}
              onValueChange={setBenignJuxtapleuralMorphology}
            />
          ) : null}
        </SectionCard>
      ) : null}

      {noduleType === 'airway' ? (
        <SectionCard titleKey="lung.lungRads.airwaySection">
          <ChoiceChips labelKey="lung.lungRads.airwayLocation" options={airwayOptions} value={airwayLocation} onChange={setAirwayLocation} columns={1} />
          <ToggleRow
            labelKey="lung.lungRads.benignAirwaySecretions"
            descriptionKey="lung.lungRads.benignAirwaySecretionsDescription"
            value={benignAirwaySecretionFeatures}
            onValueChange={setBenignAirwaySecretionFeatures}
          />
        </SectionCard>
      ) : null}

      {noduleType === 'atypicalCyst' ? (
        <SectionCard titleKey="lung.lungRads.cystSection" descriptionKey="lung.lungRads.cystDescription">
          <ChoiceChips labelKey="lung.lungRads.cystMorphology" options={cystMorphologyOptions} value={cystMorphology} onChange={setCystMorphology} />
          <ChoiceChips labelKey="lung.lungRads.cystChange" options={cystChangeOptions} value={cystChange} onChange={setCystChange} columns={1} />
          <ToggleRow labelKey="lung.lungRads.associatedNodule" value={hasAssociatedNodule} onValueChange={setHasAssociatedNodule} />
          {hasAssociatedNodule ? (
            <ChoiceChips labelKey="lung.lungRads.associatedCategory" options={associatedCategoryOptions} value={associatedCategory} onChange={setAssociatedCategory} />
          ) : null}
        </SectionCard>
      ) : null}

      <SectionCard titleKey="lung.lungRads.modifiersSection">
        <ToggleRow labelKey="lung.lungRads.benignCalcification" value={benignCalcification} onValueChange={setBenignCalcification} />
        <ToggleRow labelKey="lung.lungRads.macroscopicFat" value={macroscopicFat} onValueChange={setMacroscopicFat} />
        <ToggleRow labelKey="lung.lungRads.inflammatoryFindings" descriptionKey="lung.lungRads.inflammatoryDescription" value={inflammatoryFindings} onValueChange={setInflammatoryFindings} />
        <ToggleRow labelKey="lung.lungRads.multiple" value={multiple} onValueChange={setMultiple} />
        <ToggleRow labelKey="lung.lungRads.additionalSuspiciousFeatures" descriptionKey="lung.lungRads.additionalSuspiciousDescription" value={additionalSuspiciousFeatures} onValueChange={setAdditionalSuspiciousFeatures} />
        <ToggleRow labelKey="lung.lungRads.sModifier" descriptionKey="lung.lungRads.sModifierDescription" value={sModifier} onValueChange={setSModifier} />
      </SectionCard>

      <ResultCard
        badge={result.displayCategory}
        title={result.title}
        primary={result.management}
        severity={result.severity}
        notes={result.notes}
        warnings={result.warnings}
        metadata={metadata}
      />

      {canOpenBrock ? (
        <ActionButton labelKey="lung.lungRads.openBrock" onPress={openBrock} tone="lung" />
      ) : null}

      <SectionCard titleKey="lung.lungRads.growth.title" descriptionKey="lung.lungRads.growth.description">
        <NumberField labelKey="lung.lungRads.growth.current" value={currentDiameter} onChangeText={setCurrentDiameter} unitKey="units.mm" />
        <NumberField labelKey="lung.lungRads.growth.prior" value={priorDiameter} onChangeText={setPriorDiameter} unitKey="units.mm" />
        <NumberField labelKey="lung.lungRads.growth.interval" value={intervalDays} onChangeText={setIntervalDays} unitKey="units.days" integer />
        <View style={styles.growthResult}>
          <Text style={styles.growthLabel}>{t('lung.lungRads.growth.interpretation')}</Text>
          <Text style={styles.growthText}>{tx(growth.summary)}</Text>
        </View>
      </SectionCard>
      <ActionButton labelKey="common.resetForm" onPress={reset} tone="lung" />
      <InfoBanner textKey="lung.lungRads.noRiskPercentages" tone="warning" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  growthResult: {
    borderRadius: radii.md,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  growthLabel: { color: colors.textSubtle, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  growthText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 3 },
});
