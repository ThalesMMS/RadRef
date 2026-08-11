import { Banner, KeyPointList, ReferenceList, Screen, Section, type ReferenceItem } from '../../../components';

const references: readonly ReferenceItem[] = [
  {
    id: 'acr-li-rads-v2018',
    titleKey: 'liver.references.acr.title',
    subtitleKey: 'liver.references.acr.subtitle',
    url: 'https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/LI-RADS',
  },
  {
    id: 'chernyak-2018',
    titleKey: 'liver.references.article.title',
    subtitleKey: 'liver.references.article.subtitle',
    url: 'https://doi.org/10.1148/radiol.2018181494',
  },
];

export function LiverReferencesScreen() {
  return (
    <Screen titleKey="liver.references.title" subtitleKey="liver.references.subtitle">
      <Banner textKey="liver.references.externalNotice" />
      <Section headerKey="liver.references.pointsTitle">
        <KeyPointList
          accent="trauma"
          itemKeys={[
            'liver.references.point.population',
            'liver.references.point.diagonal',
            'liver.references.point.ancillary',
            'liver.references.point.thresholdGrowth',
          ]}
        />
      </Section>
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={references} />
      </Section>
    </Screen>
  );
}
