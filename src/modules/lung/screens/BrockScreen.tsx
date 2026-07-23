import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
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
import { calculateBrock, type BrockNoduleType, type BrockSex } from '../domain';

const sexOptions: readonly ChoiceOption<BrockSex>[] = [
  { value: 'male', labelKey: 'lung.brock.sex.male' },
  { value: 'female', labelKey: 'lung.brock.sex.female' },
];

const typeOptions: readonly ChoiceOption<BrockNoduleType>[] = [
  { value: 'solid', labelKey: 'lung.form.noduleType.solid' },
  { value: 'partSolid', labelKey: 'lung.form.noduleType.partSolid' },
  { value: 'nonSolid', labelKey: 'lung.brock.noduleType.nonSolid' },
];

export function BrockScreen() {
  const { t } = useI18n();
  const params = useLocalSearchParams();
  const [age, setAge] = useState('65');
  const [sex, setSex] = useState<BrockSex>('male');
  const [familyHistory, setFamilyHistory] = useState(false);
  const [emphysema, setEmphysema] = useState(false);
  const [diameter, setDiameter] = useState('10');
  const [noduleType, setNoduleType] = useState<BrockNoduleType>('solid');
  const [upperLobe, setUpperLobe] = useState(false);
  const [noduleCount, setNoduleCount] = useState('1');
  const [spiculation, setSpiculation] = useState(false);

  useEffect(() => {
    const diameterParam = Array.isArray(params.diameter) ? params.diameter[0] : params.diameter;
    const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
    const countParam = Array.isArray(params.count) ? params.count[0] : params.count;
    if (diameterParam && parseLocalizedNumber(diameterParam) !== undefined) setDiameter(diameterParam);
    if (typeParam === 'solid' || typeParam === 'partSolid' || typeParam === 'nonSolid') setNoduleType(typeParam);
    const parsedCount = countParam ? parseLocalizedNumber(countParam) : undefined;
    if (countParam && parsedCount !== undefined && Number.isInteger(parsedCount) && parsedCount > 0) setNoduleCount(countParam);
  }, [params.count, params.diameter, params.type]);

  const sourceParam = Array.isArray(params.source) ? params.source[0] : params.source;
  const fromLungRads = sourceParam === 'lungRads';

  const reset = () => {
    setAge('65');
    setSex('male');
    setFamilyHistory(false);
    setEmphysema(false);
    setDiameter('10');
    setNoduleType('solid');
    setUpperLobe(false);
    setNoduleCount('1');
    setSpiculation(false);
  };

  const result = useMemo(() => {
    const ageYears = parseLocalizedNumber(age);
    const diameterMm = parseLocalizedNumber(diameter);
    const count = parseLocalizedNumber(noduleCount);
    return calculateBrock({
      ...(ageYears === undefined ? {} : { ageYears }),
      sex,
      familyHistoryLungCancer: familyHistory,
      emphysema,
      ...(diameterMm === undefined ? {} : { diameterMm }),
      noduleType,
      upperLobe,
      ...(count === undefined ? {} : { noduleCount: count }),
      spiculation,
    });
  }, [age, diameter, emphysema, familyHistory, noduleCount, noduleType, sex, spiculation, upperLobe]);

  const badge = result.probabilityPercent === undefined
    ? undefined
    : t('units.percentValue', { value: result.probabilityPercent.toFixed(1) });

  const metadata = result.stratum ? [{
    labelKey: 'lung.brock.riskBandLabel',
    value: t(`lung.brock.stratum.${result.stratum}`),
  }] : [];

  return (
    <AppScreen titleKey="lung.tools.brock.title" subtitleKey="lung.tools.brock.meta">
      <Disclaimer />
      <InfoBanner titleKey="lung.brock.scopeTitle" textKey="lung.brock.scopeText" />
      {fromLungRads ? <InfoBanner textKey="lung.brock.prefillNotice" /> : null}
      <SectionCard titleKey="lung.brock.patientSection">
        <NumberField labelKey="lung.brock.age" value={age} onChangeText={setAge} unitKey="units.years" integer />
        <ChoiceChips labelKey="lung.brock.sex" options={sexOptions} value={sex} onChange={setSex} />
        <ToggleRow labelKey="lung.brock.familyHistory" value={familyHistory} onValueChange={setFamilyHistory} />
        <ToggleRow labelKey="lung.brock.emphysema" value={emphysema} onValueChange={setEmphysema} />
      </SectionCard>
      <SectionCard titleKey="lung.brock.noduleSection">
        <NumberField labelKey="lung.form.totalDiameter" value={diameter} onChangeText={setDiameter} unitKey="units.mm" helperKey="lung.brock.sizeRange" />
        <ChoiceChips labelKey="lung.form.noduleType" options={typeOptions} value={noduleType} onChange={setNoduleType} columns={3} />
        <NumberField labelKey="lung.brock.noduleCount" value={noduleCount} onChangeText={setNoduleCount} integer />
        <ToggleRow labelKey="lung.brock.upperLobe" value={upperLobe} onValueChange={setUpperLobe} />
        <ToggleRow labelKey="lung.brock.spiculation" value={spiculation} onValueChange={setSpiculation} />
      </SectionCard>
      <ResultCard
        {...(badge === undefined ? {} : { badge })}
        title={result.title}
        primary={result.interpretation}
        severity={result.severity}
        notes={result.notes}
        metadata={metadata}
      />
      <ActionButton labelKey="common.resetForm" onPress={reset} tone="lung" />
      <InfoBanner textKey="lung.brock.notStandaloneManagement" tone="warning" />
    </AppScreen>
  );
}
