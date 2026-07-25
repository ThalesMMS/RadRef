import { Banner, KeyPointList, ReferenceList, Screen, Section } from '../../../components';
import { fractureReferences } from '../../../content/references';

export function FractureReferencesScreen() {
  return (
    <Screen titleKey="fracture.references.title" subtitleKey="fracture.references.subtitle">
      <Banner textKey="references.externalLinksNotice" />
      <Section headerKey="fracture.references.implementationTitle">
        <KeyPointList
          accent="fracture"
          itemKeys={[
            'fracture.references.point.adult',
            'fracture.references.point.open',
            'fracture.references.point.pediatric',
            'fracture.references.point.periprosthetic',
            'fracture.references.point.dislocations',
          ]}
        />
      </Section>
      <Banner textKey="fracture.references.copyrightNotice" tone="warning" />
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={fractureReferences} />
      </Section>
    </Screen>
  );
}
