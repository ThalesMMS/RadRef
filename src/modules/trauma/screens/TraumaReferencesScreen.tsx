import { Banner, KeyPointList, ReferenceList, Screen, Section } from '../../../components';
import { traumaReferences } from '../../../content/references';

export function TraumaReferencesScreen() {
  return (
    <Screen titleKey="trauma.references.title" subtitleKey="trauma.references.subtitle">
      <Banner textKey="references.externalLinksNotice" />
      <Section headerKey="trauma.references.implementationTitle">
        <KeyPointList
          accent="trauma"
          itemKeys={[
            'trauma.references.point.solidOrgans',
            'trauma.references.point.allScales',
            'trauma.references.point.gradingNotTreatment',
            'trauma.references.point.imagingProtocol',
          ]}
        />
      </Section>
      <Banner textKey="trauma.aast.copyrightNotice" tone="warning" />
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={traumaReferences} />
      </Section>
    </Screen>
  );
}
