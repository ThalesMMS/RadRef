import { Banner, KeyPointList, ReferenceList, Screen, Section } from '../../../components';
import { renalReferences } from '../../../content/references';

export function RenalReferencesScreen() {
  return (
    <Screen titleKey="renal.references.title" subtitleKey="renal.references.subtitle">
      <Banner textKey="references.externalLinksNotice" />
      <Section headerKey="renal.references.classificationPointsTitle">
        <KeyPointList
          accent="renal"
          itemKeys={[
            'renal.references.point.cysticDefinition',
            'renal.references.point.enhancementRequired',
            'renal.references.point.thickness',
            'renal.references.point.protrusions',
            'renal.references.point.mriPatterns',
          ]}
        />
      </Section>
      <Section headerKey="renal.references.pitfallsPointsTitle">
        <KeyPointList
          accent="renal"
          itemKeys={[
            'renal.references.point.ultrasound',
            'renal.references.point.calcification',
            'renal.references.point.heterogeneousCt',
            'renal.references.point.noncontrast',
          ]}
        />
      </Section>
      <Section headerKey="renal.references.managementPointsTitle">
        <KeyPointList
          accent="renal"
          itemKeys={[
            'renal.references.point.iifFollowUp',
            'renal.references.point.sizeManagement',
            'renal.references.point.comorbidity',
            'renal.references.point.biopsy',
            'renal.references.point.evidence',
          ]}
        />
      </Section>
      <Section headerKey="common.references" separatorInset={58}>
        <ReferenceList items={renalReferences} />
      </Section>
    </Screen>
  );
}
