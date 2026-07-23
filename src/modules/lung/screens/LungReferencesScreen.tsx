import { AppScreen, InfoBanner, KeyPointList, ReferenceList, SectionCard } from '../../../components';
import { lungReferences } from '../../../content/references';

export function LungReferencesScreen() {
  return (
    <AppScreen titleKey="lung.references.title" subtitleKey="lung.references.subtitle">
      <InfoBanner textKey="references.externalLinksNotice" />
      <SectionCard titleKey="lung.references.fleischnerPointsTitle">
        <KeyPointList itemKeys={[
          'lung.references.point.fleischnerScope',
          'lung.references.point.fleischnerMeasurement',
          'lung.references.point.fleischnerRisk',
          'lung.references.point.fleischnerPartSolid',
        ]} />
      </SectionCard>
      <SectionCard titleKey="lung.references.lungRadsPointsTitle">
        <KeyPointList itemKeys={[
          'lung.references.point.lungRadsScreening',
          'lung.references.point.lungRadsGrowth',
          'lung.references.point.lungRadsCysts',
          'lung.references.point.lungRadsSModifier',
          'lung.references.point.lungRadsNoRiskColumn',
        ]} />
      </SectionCard>
      <SectionCard titleKey="lung.references.brockPointsTitle">
        <KeyPointList itemKeys={[
          'lung.references.point.brockScope',
          'lung.references.point.brockInputs',
          'lung.references.point.brockThresholds',
        ]} />
      </SectionCard>
      <SectionCard titleKey="common.references">
        <ReferenceList items={lungReferences} />
      </SectionCard>
    </AppScreen>
  );
}
