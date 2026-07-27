import { useMemo, useState } from 'react';
import {
  Banner,
  Button,
  ChoiceRow,
  Disclaimer,
  ResultCard,
  Screen,
  Section,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import {
  adultFractureAreas,
  adultPatternsAtLevel,
  adultRegionById,
  classifyAdultFracture,
  regionsForAdultArea,
  type AdultFractureArea,
  type AdultFractureRegion,
  type ShaftThird,
} from '../domain';
import { adultIllustration } from '../illustrations';
import { FractureIllustration } from './FractureIllustration';

type OptionalCode = 'none' | string;

const shaftThirdOptions: readonly ChoiceOption<ShaftThird>[] = [
  { value: 'none', labelKey: 'fracture.adult.shaftThird.none' },
  { value: 'a', labelKey: 'fracture.adult.shaftThird.a' },
  { value: 'b', labelKey: 'fracture.adult.shaftThird.b' },
  { value: 'c', labelKey: 'fracture.adult.shaftThird.c' },
];

function areaOptions(): readonly ChoiceOption<AdultFractureArea>[] {
  return adultFractureAreas.map((area) => ({ value: area.id, labelKey: area.labelKey }));
}

function regionOptions(area: AdultFractureArea): readonly ChoiceOption<AdultFractureRegion['id']>[] {
  return regionsForAdultArea(area).map((region) => ({ value: region.id, labelKey: region.labelKey }));
}

export function AdultFractureScreen() {
  const [area, setArea] = useState<AdultFractureArea>('upperLimb');
  const [regionId, setRegionId] = useState<AdultFractureRegion['id']>('humerusProximal');
  const [typeCode, setTypeCode] = useState('11A');
  const [groupCode, setGroupCode] = useState<OptionalCode>('none');
  const [subgroupCode, setSubgroupCode] = useState<OptionalCode>('none');
  const [shaftThird, setShaftThird] = useState<ShaftThird>('none');

  const region = useMemo(() => adultRegionById(regionId), [regionId]);
  const types = useMemo(() => adultPatternsAtLevel(region, 'type'), [region]);
  const groups = useMemo(() => adultPatternsAtLevel(region, 'group', typeCode), [region, typeCode]);
  const subgroups = useMemo(
    () => groupCode === 'none' ? [] : adultPatternsAtLevel(region, 'subgroup', groupCode),
    [groupCode, region],
  );

  const result = useMemo(() => classifyAdultFracture({
    regionId,
    typeCode,
    ...(groupCode === 'none' ? {} : { groupCode }),
    ...(subgroupCode === 'none' ? {} : { subgroupCode }),
    shaftThird,
  }), [groupCode, regionId, shaftThird, subgroupCode, typeCode]);

  const selectRegion = (nextRegionId: AdultFractureRegion['id']) => {
    const nextRegion = adultRegionById(nextRegionId);
    const firstType = adultPatternsAtLevel(nextRegion, 'type')[0];
    setRegionId(nextRegionId);
    setTypeCode(firstType?.code ?? '');
    setGroupCode('none');
    setSubgroupCode('none');
    setShaftThird('none');
  };

  const selectArea = (nextArea: AdultFractureArea) => {
    const firstRegion = regionsForAdultArea(nextArea)[0];
    setArea(nextArea);
    if (firstRegion) selectRegion(firstRegion.id);
  };

  const selectType = (nextType: string) => {
    setTypeCode(nextType);
    setGroupCode('none');
    setSubgroupCode('none');
  };

  const selectGroup = (nextGroup: OptionalCode) => {
    setGroupCode(nextGroup);
    setSubgroupCode('none');
  };

  const reset = () => {
    setArea('upperLimb');
    setRegionId('humerusProximal');
    setTypeCode('11A');
    setGroupCode('none');
    setSubgroupCode('none');
    setShaftThird('none');
  };

  const typeOptions: readonly ChoiceOption<string>[] = types.map((pattern) => ({
    value: pattern.code,
    labelKey: pattern.labelKey,
    descriptionKey: 'fracture.adult.option.codeDescription',
  }));
  const groupOptions: readonly ChoiceOption<OptionalCode>[] = [
    { value: 'none', labelKey: 'fracture.adult.refinement.stopAtType' },
    ...groups.map((pattern) => ({ value: pattern.code, labelKey: pattern.labelKey })),
  ];
  const subgroupOptions: readonly ChoiceOption<OptionalCode>[] = [
    { value: 'none', labelKey: 'fracture.adult.refinement.stopAtGroup' },
    ...subgroups.map((pattern) => ({ value: pattern.code, labelKey: pattern.labelKey })),
  ];

  return (
    <Screen
      titleKey="fracture.tools.adult.title"
      subtitleKey="fracture.tools.adult.meta"
      switcher={<ToolSwitcher moduleId="fracture" current="/fracture/adult" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.code}
          title={result.title}
          primary={result.recommendation}
          severity={result.severity}
          notes={result.notes}
          {...(result.warnings ? { warnings: result.warnings } : {})}
        />
      )}
    >
      <Banner titleKey="fracture.adult.scopeTitle" textKey="fracture.adult.scopeText" />
      <Section headerKey="fracture.adult.locationTitle" infoKey="fracture.adult.locationDescription">
        <ChoiceRow
          labelKey="fracture.adult.areaLabel"
          options={areaOptions()}
          value={area}
          onChange={selectArea}
          variant="chips"
        />
        <ChoiceRow
          labelKey="fracture.adult.regionLabel"
          options={regionOptions(area)}
          value={regionId}
          onChange={selectRegion}
          variant="menu"
        />
      </Section>
      <FractureIllustration
        illustration={adultIllustration(regionId)}
        selectedCode={typeCode}
      />
      <Section headerKey="fracture.adult.morphologyTitle" infoKey="fracture.adult.morphologyDescription">
        <ChoiceRow
          labelKey="fracture.adult.typeLabel"
          options={typeOptions}
          value={typeCode}
          onChange={selectType}
          variant="menu"
        />
        {groups.length > 0 ? (
          <ChoiceRow
            labelKey="fracture.adult.groupLabel"
            options={groupOptions}
            value={groupCode}
            onChange={selectGroup}
            variant="menu"
          />
        ) : null}
        {subgroups.length > 0 ? (
          <ChoiceRow
            labelKey="fracture.adult.subgroupLabel"
            options={subgroupOptions}
            value={subgroupCode}
            onChange={setSubgroupCode}
            variant="menu"
          />
        ) : null}
        {region.supportsThirds ? (
          <ChoiceRow
            labelKey="fracture.adult.shaftThirdLabel"
            options={shaftThirdOptions}
            value={shaftThird}
            onChange={setShaftThird}
            variant="chips"
          />
        ) : null}
      </Section>
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="fracture" />
      <Banner textKey="fracture.adult.coverageWarning" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
