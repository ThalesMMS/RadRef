import { Banner, KeyPointList, ReferenceList, Screen, Section } from '../../../components';
import { lungReferences } from '../../../content/references';

export function LungReferencesScreen() {
  return (
    <Screen titleKey="lung.references.title" subtitleKey="lung.references.subtitle">
      <Banner textKey="references.externalLinksNotice" />
      <Section headerKey="lung.references.fleischnerPointsTitle">
        <KeyPointList
          accent="lung"
          itemKeys={[
            'lung.references.point.fleischnerScope',
            'lung.references.point.fleischnerMeasurement',
            'lung.references.point.fleischnerRisk',
            'lung.references.point.fleischnerPartSolid',
          ]}
        />
      </Section>
      <Section headerKey="lung.references.lungRadsPointsTitle">
        <KeyPointList
          accent="lung"
          itemKeys={[
            'lung.references.point.lungRadsScreening',
            'lung.references.point.lungRadsGrowth',
            'lung.references.point.lungRadsCysts',
            'lung.references.point.lungRadsSModifier',
            'lung.references.point.lungRadsNoRiskColumn',
          ]}
        />
      </Section>
      <Section headerKey="lung.references.brockPointsTitle">
        <KeyPointList
          accent="lung"
          itemKeys={[
            'lung.references.point.brockScope',
            'lung.references.point.brockInputs',
            'lung.references.point.brockThresholds',
          ]}
        />
      </Section>
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={lungReferences} />
      </Section>
    </Screen>
  );
}
