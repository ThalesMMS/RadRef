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
import { msg } from '../../../core/domain';
import { useI18n } from '../../../core/i18n';
import { parseLocalizedNumber } from '../../../core/numbers';
import {
  acquisitionModality,
  adaptContentPattern,
  calculateBosniak,
  contentPatternsForAcquisition,
  type CalcificationPattern,
  type ImagingAcquisition,
  type ProtrusionMargin,
  type SpecialContentPattern,
} from '../domain';

const acquisitionOptions: readonly ChoiceOption<ImagingAcquisition>[] = [
  { value: 'ctRenalMassProtocol', labelKey: 'renal.bosniak.acquisition.ctRenalMassProtocol' },
  { value: 'ctNoncontrast', labelKey: 'renal.bosniak.acquisition.ctNoncontrast' },
  { value: 'ctPortalVenous', labelKey: 'renal.bosniak.acquisition.ctPortalVenous' },
  { value: 'ctOther', labelKey: 'renal.bosniak.acquisition.ctOther' },
  { value: 'mriRenalMassProtocol', labelKey: 'renal.bosniak.acquisition.mriRenalMassProtocol' },
  { value: 'mriNoncontrast', labelKey: 'renal.bosniak.acquisition.mriNoncontrast' },
  { value: 'mriOther', labelKey: 'renal.bosniak.acquisition.mriOther' },
  { value: 'ultrasound', labelKey: 'renal.bosniak.acquisition.ultrasound' },
];

const ctContentOptions: readonly ChoiceOption<SpecialContentPattern>[] = [
  { value: 'none', labelKey: 'renal.bosniak.content.none' },
  { value: 'simpleFluid', labelKey: 'renal.bosniak.content.simpleFluidCt' },
  { value: 'ctMinus9To20', labelKey: 'renal.bosniak.content.ctMinus9To20' },
  { value: 'ctAtLeast70', labelKey: 'renal.bosniak.content.ctAtLeast70' },
  { value: 'ctOver20Nonenhancing', labelKey: 'renal.bosniak.content.ctOver20Nonenhancing' },
  { value: 'ctPortal21To30', labelKey: 'renal.bosniak.content.ctPortal21To30' },
  { value: 'ctTooSmallLowAttenuation', labelKey: 'renal.bosniak.content.ctTooSmallLowAttenuation' },
];

// Contrast-enhanced MRI: content is still read on T2 and on the precontrast T1 series.
const contrastMriContentOptions: readonly ChoiceOption<SpecialContentPattern>[] = [
  { value: 'none', labelKey: 'renal.bosniak.content.none' },
  { value: 'simpleFluid', labelKey: 'renal.bosniak.content.simpleFluidMri' },
  { value: 'mriT2CSFLike', labelKey: 'renal.bosniak.content.mriT2CSFLike' },
  { value: 'mriT1MarkedHomogeneous', labelKey: 'renal.bosniak.content.mriT1MarkedHomogeneousPrecontrast' },
  { value: 'mriT1Heterogeneous', labelKey: 'renal.bosniak.content.mriT1HeterogeneousPrecontrast' },
];

const noncontrastMriContentOptions: readonly ChoiceOption<SpecialContentPattern>[] = [
  { value: 'none', labelKey: 'renal.bosniak.content.none' },
  { value: 'mriT2CSFLike', labelKey: 'renal.bosniak.content.mriT2CSFLike' },
  { value: 'mriT1MarkedHomogeneous', labelKey: 'renal.bosniak.content.mriT1MarkedHomogeneous' },
  { value: 'mriT1Heterogeneous', labelKey: 'renal.bosniak.content.mriT1Heterogeneous' },
];

function contentOptionsFor(acquisition: ImagingAcquisition): readonly ChoiceOption<SpecialContentPattern>[] {
  const available = contentPatternsForAcquisition(acquisition);
  const labelled = acquisitionModality(acquisition) === 'ct'
    ? ctContentOptions
    : acquisition === 'mriNoncontrast' ? noncontrastMriContentOptions : contrastMriContentOptions;
  return labelled.filter((option) => available.includes(option.value));
}

const calcificationOptions: readonly ChoiceOption<CalcificationPattern>[] = [
  { value: 'none', labelKey: 'renal.bosniak.calcification.none' },
  { value: 'present', labelKey: 'renal.bosniak.calcification.present' },
  { value: 'abundantThickOrNodular', labelKey: 'renal.bosniak.calcification.abundant' },
];

const protrusionOptions: readonly ChoiceOption<ProtrusionMargin>[] = [
  { value: 'none', labelKey: 'renal.bosniak.protrusion.none' },
  { value: 'obtuse', labelKey: 'renal.bosniak.protrusion.obtuse' },
  { value: 'acute', labelKey: 'renal.bosniak.protrusion.acute' },
];

export function BosniakScreen() {
  const { t, tx } = useI18n();
  const [acquisition, setAcquisition] = useState<ImagingAcquisition>('ctRenalMassProtocol');
  const [cysticMassConfirmed, setCysticMassConfirmed] = useState(true);
  const [enhancingTissuePercent, setEnhancingTissuePercent] = useState('0');
  const [alternativeEtiology, setAlternativeEtiology] = useState(false);
  const [hereditarySyndrome, setHereditarySyndrome] = useState(false);
  const [lesionSize, setLesionSize] = useState('20');
  const [wellDefined, setWellDefined] = useState(true);
  const [homogeneous, setHomogeneous] = useState(true);
  const [contentPattern, setContentPattern] = useState<SpecialContentPattern>('simpleFluid');
  const [wallThickness, setWallThickness] = useState('2');
  const [wallSmooth, setWallSmooth] = useState(true);
  const [wallEnhances, setWallEnhances] = useState(false);
  const [septaCount, setSeptaCount] = useState('0');
  const [septalThickness, setSeptalThickness] = useState('0');
  const [septaSmooth, setSeptaSmooth] = useState(true);
  const [septaEnhance, setSeptaEnhance] = useState(false);
  const [calcification, setCalcification] = useState<CalcificationPattern>('none');
  const [protrusionMargin, setProtrusionMargin] = useState<ProtrusionMargin>('none');
  const [protrusionSize, setProtrusionSize] = useState('0');
  const [protrusionEnhances, setProtrusionEnhances] = useState(false);
  const [symptomatic, setSymptomatic] = useState(false);
  const [comorbidity, setComorbidity] = useState(false);
  const [targetableSolidComponent, setTargetableSolidComponent] = useState(false);

  const contentOptions = contentOptionsFor(acquisition);

  const selectAcquisition = (nextAcquisition: ImagingAcquisition) => {
    setAcquisition(nextAcquisition);
    setContentPattern((current) => adaptContentPattern(current, nextAcquisition));
  };

  const reset = () => {
    setAcquisition('ctRenalMassProtocol');
    setCysticMassConfirmed(true);
    setEnhancingTissuePercent('0');
    setAlternativeEtiology(false);
    setHereditarySyndrome(false);
    setLesionSize('20');
    setWellDefined(true);
    setHomogeneous(true);
    setContentPattern('simpleFluid');
    setWallThickness('2');
    setWallSmooth(true);
    setWallEnhances(false);
    setSeptaCount('0');
    setSeptalThickness('0');
    setSeptaSmooth(true);
    setSeptaEnhance(false);
    setCalcification('none');
    setProtrusionMargin('none');
    setProtrusionSize('0');
    setProtrusionEnhances(false);
    setSymptomatic(false);
    setComorbidity(false);
    setTargetableSolidComponent(false);
  };

  const result = useMemo(() => {
    const enhancingPercent = parseLocalizedNumber(enhancingTissuePercent);
    const lesionSizeMm = parseLocalizedNumber(lesionSize);
    return calculateBosniak({
      acquisition,
      cysticMassConfirmed,
      ...(enhancingPercent === undefined ? {} : { enhancingTissuePercent: enhancingPercent }),
      suspectedInfectiousInflammatoryOrVascular: alternativeEtiology,
      hereditaryRenalCancerSyndrome: hereditarySyndrome,
      ...(lesionSizeMm === undefined ? {} : { lesionSizeMm }),
      wellDefined,
      homogeneous,
      specialContentPattern: contentPattern,
      wallThicknessMm: parseLocalizedNumber(wallThickness) ?? Number.NaN,
      wallSmooth,
      wallEnhances,
      septaCount: parseLocalizedNumber(septaCount) ?? Number.NaN,
      maxSeptalThicknessMm: parseLocalizedNumber(septalThickness) ?? Number.NaN,
      septaSmooth,
      septaEnhance,
      calcification,
      protrusionMargin,
      protrusionSizeMm: parseLocalizedNumber(protrusionSize) ?? Number.NaN,
      protrusionEnhances,
      symptomatic,
      significantComorbidityOrLimitedLifeExpectancy: comorbidity,
      targetableSolidComponent,
    });
  }, [
    acquisition,
    alternativeEtiology,
    calcification,
    comorbidity,
    contentPattern,
    cysticMassConfirmed,
    enhancingTissuePercent,
    hereditarySyndrome,
    homogeneous,
    lesionSize,
    protrusionEnhances,
    protrusionMargin,
    protrusionSize,
    septaCount,
    septaEnhance,
    septaSmooth,
    septalThickness,
    symptomatic,
    targetableSolidComponent,
    wallEnhances,
    wallSmooth,
    wallThickness,
    wellDefined,
  ]);

  const managementNotes = [...result.management.notes, result.management.evidence];
  const managementMetadata = result.management.followUp === undefined ? [] : [{
    labelKey: 'renal.management.followUpLabel',
    value: tx(result.management.followUp),
  }];

  const reportText = `${t('renal.tools.bosniak.title')}\n`
    + `Bosniak ${result.categoryLabel}: ${tx(result.title)}\n`
    + `${tx(result.riskSummary)}\n\n`
    + `${tx(result.reportSuggestion)}\n\n`
    + `${t('renal.bosniak.shareManagementLabel')}: ${tx(result.management.primary)}\n\n`
    + `${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="renal.tools.bosniak.title"
      subtitleKey="renal.tools.bosniak.meta"
      switcher={<ToolSwitcher moduleId="renal" current="/renal/bosniak" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.categoryLabel}
          title={result.title}
          primary={result.riskSummary}
          secondary={result.reportSuggestion}
          severity={result.severity}
          notes={result.rationale}
          warnings={result.warnings}
        />
      )}
    >
      <Banner titleKey="renal.bosniak.scopeTitle" textKey="renal.bosniak.scopeText" />

      <Section headerKey="renal.bosniak.acquisitionSection" infoKey="renal.bosniak.acquisitionDescription">
        <ChoiceRow
          labelKey="renal.bosniak.acquisition"
          options={acquisitionOptions}
          value={acquisition}
          onChange={selectAcquisition}
          variant="menu"
        />
        <SwitchRow
          labelKey="renal.bosniak.cysticMassConfirmed"
          infoKey="renal.bosniak.cysticMassDescription"
          value={cysticMassConfirmed}
          onValueChange={setCysticMassConfirmed}
        />
        <InputRow
          labelKey="renal.bosniak.enhancingTissuePercent"
          value={enhancingTissuePercent}
          onChangeText={setEnhancingTissuePercent}
          unitKey="units.percent"
          infoKey="renal.bosniak.enhancingTissueHelper"
        />
        <InputRow
          labelKey="renal.management.lesionSize"
          value={lesionSize}
          onChangeText={setLesionSize}
          unitKey="units.mm"
        />
        <SwitchRow labelKey="renal.bosniak.alternativeEtiology" value={alternativeEtiology} onValueChange={setAlternativeEtiology} />
        <SwitchRow labelKey="renal.bosniak.hereditarySyndrome" value={hereditarySyndrome} onValueChange={setHereditarySyndrome} />
      </Section>

      <Section headerKey="renal.bosniak.contentSection">
        <SwitchRow labelKey="renal.bosniak.wellDefined" value={wellDefined} onValueChange={setWellDefined} />
        <SwitchRow labelKey="renal.bosniak.homogeneous" value={homogeneous} onValueChange={setHomogeneous} />
        {contentOptions.length > 0 ? (
          <ChoiceRow
            labelKey="renal.bosniak.contentPattern"
            infoKey="renal.bosniak.contentPatternDescription"
            options={contentOptions}
            value={contentPattern}
            onChange={setContentPattern}
            variant="menu"
          />
        ) : null}
      </Section>

      <Section headerKey="renal.bosniak.wallSection">
        <InputRow labelKey="renal.bosniak.wallThickness" value={wallThickness} onChangeText={setWallThickness} unitKey="units.mm" />
        <SwitchRow labelKey="renal.bosniak.wallSmooth" value={wallSmooth} onValueChange={setWallSmooth} />
        <SwitchRow labelKey="renal.bosniak.wallEnhances" value={wallEnhances} onValueChange={setWallEnhances} />
      </Section>

      <Section headerKey="renal.bosniak.septaSection">
        <InputRow labelKey="renal.bosniak.septaCount" value={septaCount} onChangeText={setSeptaCount} integer />
        <InputRow labelKey="renal.bosniak.septalThickness" value={septalThickness} onChangeText={setSeptalThickness} unitKey="units.mm" />
        <SwitchRow labelKey="renal.bosniak.septaSmooth" value={septaSmooth} onValueChange={setSeptaSmooth} />
        <SwitchRow labelKey="renal.bosniak.septaEnhance" value={septaEnhance} onValueChange={setSeptaEnhance} />
      </Section>

      <Section headerKey="renal.bosniak.calcificationNoduleSection">
        <ChoiceRow
          labelKey="renal.bosniak.calcification"
          options={calcificationOptions}
          value={calcification}
          onChange={setCalcification}
          variant="menu"
        />
        <ChoiceRow
          labelKey="renal.bosniak.protrusionMargin"
          options={protrusionOptions}
          value={protrusionMargin}
          onChange={setProtrusionMargin}
          variant="segmented"
        />
        {protrusionMargin !== 'none' ? (
          <InputRow labelKey="renal.bosniak.protrusionSize" value={protrusionSize} onChangeText={setProtrusionSize} unitKey="units.mm" />
        ) : null}
        {protrusionMargin !== 'none' ? (
          <SwitchRow labelKey="renal.bosniak.protrusionEnhances" value={protrusionEnhances} onValueChange={setProtrusionEnhances} />
        ) : null}
      </Section>

      <Section headerKey="renal.bosniak.managementContextSection">
        <SwitchRow labelKey="renal.management.symptomatic" value={symptomatic} onValueChange={setSymptomatic} />
        <SwitchRow labelKey="renal.management.comorbidity" value={comorbidity} onValueChange={setComorbidity} />
        <SwitchRow labelKey="renal.management.targetableComponent" value={targetableSolidComponent} onValueChange={setTargetableSolidComponent} />
      </Section>

      <ResultCard
        badge={result.categoryLabel}
        title={msg('renal.management.resultTitle')}
        primary={result.management.primary}
        severity={result.severity}
        notes={managementNotes}
        metadata={managementMetadata}
      />
      <ReportActions reportText={reportText} shareTitle={t('renal.bosniak.shareTitle')} accent="renal" onReset={reset} />
      <Banner textKey="renal.bosniak.reportReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
