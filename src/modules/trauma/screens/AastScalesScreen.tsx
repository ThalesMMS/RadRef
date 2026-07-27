import { useMemo, useState } from 'react';
import {
  Banner,
  ChoiceRow,
  Disclaimer,
  KeyPointList,
  Screen,
  Section,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import {
  aastRegions,
  aastScaleById,
  aastScalesForRegion,
  type AastRegion,
  type AastScale,
} from '../domain';
import { AastGradeList } from './AastGradeList';

const regionOptions: readonly ChoiceOption<AastRegion>[] = aastRegions.map((region) => ({
  value: region.id,
  labelKey: region.labelKey,
}));

export function AastScalesScreen() {
  const [region, setRegion] = useState<AastRegion>('abdomen');
  const [scaleId, setScaleId] = useState<AastScale['id']>('spleen');
  const scales = useMemo(() => aastScalesForRegion(region), [region]);
  const scale = useMemo(() => aastScaleById(scaleId), [scaleId]);
  const scaleOptions: readonly ChoiceOption<AastScale['id']>[] = scales.map((candidate) => ({
    value: candidate.id,
    labelKey: candidate.titleKey,
    descriptionKey: candidate.versionKey,
  }));

  const selectRegion = (next: AastRegion) => {
    setRegion(next);
    const first = aastScalesForRegion(next)[0];
    if (first) setScaleId(first.id);
  };

  return (
    <Screen
      titleKey="trauma.tools.scales.title"
      subtitleKey="trauma.tools.scales.meta"
      switcher={<ToolSwitcher moduleId="trauma" current="/trauma/scales" />}
    >
      <Banner titleKey="trauma.aast.scopeTitle" textKey="trauma.aast.scopeText" />
      <Section headerKey="trauma.aast.selectionTitle" infoKey="trauma.aast.selectionDescription">
        <ChoiceRow labelKey="trauma.aast.regionLabel" options={regionOptions} value={region} onChange={selectRegion} variant="chips" />
        <ChoiceRow labelKey="trauma.aast.scaleLabel" options={scaleOptions} value={scaleId} onChange={setScaleId} variant="menu" />
      </Section>
      <Section headerKey={scale.titleKey} footerKey={scale.versionKey} plain>
        <AastGradeList scale={scale} />
      </Section>
      {scale.noteKeys.length > 0 ? (
        <Section headerKey="trauma.aast.notesTitle">
          <KeyPointList accent="trauma" itemKeys={scale.noteKeys} />
        </Section>
      ) : null}
      <Banner textKey="trauma.aast.copyrightNotice" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
