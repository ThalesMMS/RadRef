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
} from '../../../components';
import { useI18n } from '../../../core/i18n';
import { parseLocalizedNumber } from '../../../core/numbers';
import {
  enhancementOptions,
  modalityOptions,
  optionLabelKey,
  pretreatmentOptions,
  radiationChangeOptions,
  riskOptions,
  segmentOptions,
  treatmentOptions,
} from './treatmentResponseOptions';
import {
  calculateTreatmentResponse,
  type CouinaudSegment,
  type HccRiskBasis,
  type MasslikeEnhancementAssessment,
  type PretreatmentCategory,
  type RadiationEnhancementChange,
  type TreatmentModality,
  type TreatmentType,
} from '../domain';

export function TreatmentResponseScreen() {
  const { t, tx } = useI18n();
  const [age, setAge] = useState('60');
  const [riskBasis, setRiskBasis] = useState<HccRiskBasis>('cirrhosis');
  const [presumedOrProvenHcc, setPresumedOrProvenHcc] = useState(true);
  const [modality, setModality] = useState<TreatmentModality>('mri');
  const [multiphaseExam, setMultiphaseExam] = useState(true);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>('ctace');
  const [withinTreatmentZone, setWithinTreatmentZone] = useState(true);
  const [concurrentSystemicTherapy, setConcurrentSystemicTherapy] = useState(false);
  const [masslikeEnhancement, setMasslikeEnhancement] = useState<MasslikeEnhancementAssessment>('absent');
  const [radiationEnhancementChange, setRadiationEnhancementChange] = useState<RadiationEnhancementChange>('stableOrDecreased');
  const [useAncillaryFeatures, setUseAncillaryFeatures] = useState(false);
  const [diffusionRestriction, setDiffusionRestriction] = useState(false);
  const [mildModerateT2Hyperintensity, setMildModerateT2Hyperintensity] = useState(false);
  const [ancillaryNewOrIncreased, setAncillaryNewOrIncreased] = useState(false);
  const [lesionNumber, setLesionNumber] = useState('1');
  const [segment, setSegment] = useState<CouinaudSegment>('VIII');
  const [pretreatmentCategory, setPretreatmentCategory] = useState<PretreatmentCategory>('LR-5');
  const [pretreatmentSize, setPretreatmentSize] = useState('25');
  const [enhancingComponentSize, setEnhancingComponentSize] = useState('');
  const [seriesNumber, setSeriesNumber] = useState('');
  const [imageNumber, setImageNumber] = useState('');

  const parsedLesionNumber = parseLocalizedNumber(lesionNumber);
  const parsedPretreatmentSize = parseLocalizedNumber(pretreatmentSize);
  const parsedEnhancingComponentSize = parseLocalizedNumber(enhancingComponentSize);
  const isRadiationTreatment = treatmentType === 'sbrt' || treatmentType === 'tare';

  const result = useMemo(() => calculateTreatmentResponse({
    ageYears: parseLocalizedNumber(age) ?? 0,
    riskBasis,
    presumedOrProvenHcc,
    modality,
    multiphaseExam,
    treatmentType,
    withinTreatmentZone,
    concurrentSystemicTherapy,
    masslikeEnhancement,
    radiationEnhancementChange,
    useAncillaryFeatures,
    diffusionRestriction,
    mildModerateT2Hyperintensity,
    ancillaryNewOrIncreased,
    ...(parsedLesionNumber === undefined ? {} : { lesionNumber: Math.trunc(parsedLesionNumber) }),
    segment,
    pretreatmentCategory,
    ...(parsedPretreatmentSize === undefined ? {} : { pretreatmentSizeMm: parsedPretreatmentSize }),
    ...(parsedEnhancingComponentSize === undefined ? {} : { enhancingComponentSizeMm: parsedEnhancingComponentSize }),
  }), [
    age,
    ancillaryNewOrIncreased,
    concurrentSystemicTherapy,
    diffusionRestriction,
    masslikeEnhancement,
    mildModerateT2Hyperintensity,
    modality,
    multiphaseExam,
    parsedEnhancingComponentSize,
    parsedLesionNumber,
    parsedPretreatmentSize,
    presumedOrProvenHcc,
    pretreatmentCategory,
    radiationEnhancementChange,
    riskBasis,
    segment,
    treatmentType,
    useAncillaryFeatures,
    withinTreatmentZone,
  ]);
  const displayCategory = result.category === 'notApplicable'
    ? t(result.displayCategory)
    : result.displayCategory;

  const reset = () => {
    setAge('60');
    setRiskBasis('cirrhosis');
    setPresumedOrProvenHcc(true);
    setModality('mri');
    setMultiphaseExam(true);
    setTreatmentType('ctace');
    setWithinTreatmentZone(true);
    setConcurrentSystemicTherapy(false);
    setMasslikeEnhancement('absent');
    setRadiationEnhancementChange('stableOrDecreased');
    setUseAncillaryFeatures(false);
    setDiffusionRestriction(false);
    setMildModerateT2Hyperintensity(false);
    setAncillaryNewOrIncreased(false);
    setLesionNumber('1');
    setSegment('VIII');
    setPretreatmentCategory('LR-5');
    setPretreatmentSize('25');
    setEnhancingComponentSize('');
    setSeriesNumber('');
    setImageNumber('');
  };

  const reportText = useMemo(() => {
    const lesion = parsedLesionNumber === undefined ? '—' : String(Math.trunc(parsedLesionNumber));
    const preSize = parsedPretreatmentSize === undefined ? '—' : parsedPretreatmentSize.toFixed(1);
    const currentSize = parsedEnhancingComponentSize === undefined ? '—' : parsedEnhancingComponentSize.toFixed(1);
    return [
      t('liver.tra.share.lesion', { lesion, segment: t(optionLabelKey(segmentOptions, segment)) }),
      t('liver.tra.share.treatment', { treatment: t(optionLabelKey(treatmentOptions, treatmentType)) }),
      t('liver.tra.share.pretreatment', {
        category: t(optionLabelKey(pretreatmentOptions, pretreatmentCategory)),
        size: preSize,
      }),
      t('liver.tra.share.assessment', { category: displayCategory, measurement: currentSize }),
      t('liver.tra.share.imageLocation', {
        series: seriesNumber.trim() || '—',
        image: imageNumber.trim() || '—',
      }),
      tx(result.reportSuggestion),
      '',
      t('disclaimer.short'),
    ].join('\n');
  }, [
    displayCategory,
    imageNumber,
    parsedEnhancingComponentSize,
    parsedLesionNumber,
    parsedPretreatmentSize,
    pretreatmentCategory,
    result.reportSuggestion,
    segment,
    seriesNumber,
    t,
    treatmentType,
    tx,
  ]);

  const metadata = [
    ...(result.algorithm === undefined ? [] : [{
      labelKey: 'liver.tra.metadata.algorithm',
      value: t(`liver.tra.algorithm.${result.algorithm}`),
    }]),
    ...(parsedEnhancingComponentSize === undefined ? [] : [{
      labelKey: 'liver.tra.metadata.enhancingComponent',
      value: t('units.mmValue', { value: parsedEnhancingComponentSize.toFixed(1) }),
    }]),
  ];

  const showAncillaryTemporalChange = isRadiationTreatment
    && masslikeEnhancement === 'present'
    && radiationEnhancementChange === 'stableOrDecreased';

  return (
    <Screen
      titleKey="liver.tools.treatmentResponse.title"
      subtitleKey="liver.tools.treatmentResponse.meta"
      switcher={<ToolSwitcher moduleId="liver" current="/liver/treatment-response" />}
      result={(
        <ResultCard
          variant="hero"
          badge={displayCategory}
          title={result.title}
          primary={result.management}
          secondary={result.reportSuggestion}
          severity={result.severity}
          notes={result.notes}
          warnings={result.warnings}
          metadata={metadata}
        />
      )}
    >
      <Banner titleKey="liver.tra.scopeTitle" textKey="liver.tra.scopeText" />

      <Section headerKey="liver.tra.section.applicability" infoKey="liver.tra.section.applicabilityInfo">
        <InputRow labelKey="liver.liRads.form.age" value={age} onChangeText={setAge} unitKey="liver.units.years" integer />
        <ChoiceRow labelKey="liver.liRads.form.riskBasis" options={riskOptions} value={riskBasis} onChange={setRiskBasis} variant="menu" />
        <SwitchRow
          labelKey="liver.tra.form.presumedOrProvenHcc"
          infoKey="liver.tra.form.presumedOrProvenHccInfo"
          value={presumedOrProvenHcc}
          onValueChange={setPresumedOrProvenHcc}
        />
        <ChoiceRow labelKey="liver.tra.form.modality" options={modalityOptions} value={modality} onChange={setModality} variant="segmented" />
        <SwitchRow
          labelKey="liver.tra.form.multiphaseExam"
          infoKey="liver.tra.form.multiphaseExamInfo"
          value={multiphaseExam}
          onValueChange={setMultiphaseExam}
        />
        <ChoiceRow
          labelKey="liver.tra.form.treatmentType"
          infoKey="liver.tra.form.treatmentTypeInfo"
          options={treatmentOptions}
          value={treatmentType}
          onChange={setTreatmentType}
          variant="menu"
        />
        <SwitchRow
          labelKey="liver.tra.form.withinTreatmentZone"
          infoKey="liver.tra.form.withinTreatmentZoneInfo"
          value={withinTreatmentZone}
          onValueChange={setWithinTreatmentZone}
        />
        <SwitchRow
          labelKey="liver.tra.form.concurrentSystemicTherapy"
          infoKey="liver.tra.form.concurrentSystemicTherapyInfo"
          value={concurrentSystemicTherapy}
          onValueChange={setConcurrentSystemicTherapy}
        />
      </Section>

      <Section headerKey="liver.tra.section.response" infoKey="liver.tra.section.responseInfo">
        <ChoiceRow
          labelKey="liver.tra.form.masslikeEnhancement"
          options={enhancementOptions}
          value={masslikeEnhancement}
          onChange={setMasslikeEnhancement}
          variant="menu"
        />
        {isRadiationTreatment && masslikeEnhancement === 'present' ? (
          <ChoiceRow
            labelKey="liver.tra.form.radiationEnhancementChange"
            infoKey="liver.tra.form.radiationEnhancementChangeInfo"
            options={radiationChangeOptions}
            value={radiationEnhancementChange}
            onChange={setRadiationEnhancementChange}
            variant="menu"
          />
        ) : null}
      </Section>

      <Section headerKey="liver.tra.section.ancillary" infoKey="liver.tra.section.ancillaryInfo">
        <SwitchRow
          labelKey="liver.tra.form.useAncillaryFeatures"
          value={useAncillaryFeatures}
          onValueChange={setUseAncillaryFeatures}
        />
        {useAncillaryFeatures ? (
          <SwitchRow
            labelKey="liver.tra.form.diffusionRestriction"
            value={diffusionRestriction}
            onValueChange={setDiffusionRestriction}
          />
        ) : null}
        {useAncillaryFeatures ? (
          <SwitchRow
            labelKey="liver.tra.form.mildModerateT2Hyperintensity"
            value={mildModerateT2Hyperintensity}
            onValueChange={setMildModerateT2Hyperintensity}
          />
        ) : null}
        {useAncillaryFeatures && showAncillaryTemporalChange ? (
          <SwitchRow
            labelKey="liver.tra.form.ancillaryNewOrIncreased"
            infoKey="liver.tra.form.ancillaryNewOrIncreasedInfo"
            value={ancillaryNewOrIncreased}
            onValueChange={setAncillaryNewOrIncreased}
          />
        ) : null}
      </Section>

      <Section headerKey="liver.tra.section.reporting" infoKey="liver.tra.section.reportingInfo">
        <InputRow labelKey="liver.tra.form.lesionNumber" value={lesionNumber} onChangeText={setLesionNumber} integer />
        <ChoiceRow labelKey="liver.tra.form.segment" options={segmentOptions} value={segment} onChange={setSegment} variant="menu" />
        <ChoiceRow
          labelKey="liver.tra.form.pretreatmentCategory"
          options={pretreatmentOptions}
          value={pretreatmentCategory}
          onChange={setPretreatmentCategory}
          variant="menu"
        />
        <InputRow labelKey="liver.tra.form.pretreatmentSize" value={pretreatmentSize} onChangeText={setPretreatmentSize} unitKey="units.mm" />
        <InputRow
          labelKey="liver.tra.form.enhancingComponentSize"
          infoKey="liver.tra.form.enhancingComponentSizeInfo"
          value={enhancingComponentSize}
          onChangeText={setEnhancingComponentSize}
          unitKey="units.mm"
        />
        <InputRow labelKey="liver.tra.form.seriesNumber" value={seriesNumber} onChangeText={setSeriesNumber} integer />
        <InputRow labelKey="liver.tra.form.imageNumber" value={imageNumber} onChangeText={setImageNumber} integer />
      </Section>

      <ReportActions reportText={reportText} shareTitle={t('liver.tra.share.title')} accent="liver" onReset={reset} />
      <Disclaimer />
    </Screen>
  );
}
