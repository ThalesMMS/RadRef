import { AppScreen, InfoBanner, KeyPointList, ReferenceList, SectionCard } from '../../../components';
import { renalReferences } from '../../../content/references';

export function RenalReferencesScreen() {
  return (
    <AppScreen titleKey="renal.references.title" subtitleKey="renal.references.subtitle">
      <InfoBanner textKey="references.externalLinksNotice" />
      <SectionCard titleKey="renal.references.classificationPointsTitle">
        <KeyPointList itemKeys={[
          'renal.references.point.cysticDefinition',
          'renal.references.point.enhancementRequired',
          'renal.references.point.thickness',
          'renal.references.point.protrusions',
          'renal.references.point.mriPatterns',
        ]} />
      </SectionCard>
      <SectionCard titleKey="renal.references.pitfallsPointsTitle">
        <KeyPointList itemKeys={[
          'renal.references.point.ultrasound',
          'renal.references.point.calcification',
          'renal.references.point.heterogeneousCt',
          'renal.references.point.noncontrast',
        ]} />
      </SectionCard>
      <SectionCard titleKey="renal.references.managementPointsTitle">
        <KeyPointList itemKeys={[
          'renal.references.point.iifFollowUp',
          'renal.references.point.sizeManagement',
          'renal.references.point.comorbidity',
          'renal.references.point.biopsy',
          'renal.references.point.evidence',
        ]} />
      </SectionCard>
      <SectionCard titleKey="common.references">
        <ReferenceList items={renalReferences} />
      </SectionCard>
    </AppScreen>
  );
}
