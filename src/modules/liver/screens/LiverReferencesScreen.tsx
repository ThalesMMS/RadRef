import { Banner, KeyPointList, ReferenceList, Screen, Section, type ReferenceItem } from '../../../components';

const references: readonly ReferenceItem[] = [
  {
    id: 'acr-li-rads-v2018',
    titleKey: 'liver.references.acr.title',
    subtitleKey: 'liver.references.acr.subtitle',
    url: 'https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/LI-RADS',
  },
  {
    id: 'acr-li-rads-nonradiation-tra-v2024',
    titleKey: 'liver.references.nonradiation.title',
    subtitleKey: 'liver.references.nonradiation.subtitle',
    url: 'https://edge.sitecorecloud.io/americancoldf5f-acrorgf92a-productioncb02-3650/media/ACR/Files/RADS/LI-RADS/LI-RADS-CTMR-Nonradiation-TRA-v2024-Core.pdf',
  },
  {
    id: 'acr-li-rads-radiation-tra-v2024',
    titleKey: 'liver.references.radiation.title',
    subtitleKey: 'liver.references.radiation.subtitle',
    url: 'https://edge.sitecorecloud.io/americancoldf5f-acrorgf92a-productioncb02-3650/media/ACR/Files/RADS/LI-RADS/LI-RADS-CTMR-Radiation-TRA-v2024-Core.pdf',
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
          accent="liver"
          itemKeys={[
            'liver.references.point.population',
            'liver.references.point.diagonal',
            'liver.references.point.ancillary',
            'liver.references.point.thresholdGrowth',
            'liver.references.point.traSplit',
            'liver.references.point.traAncillary',
            'liver.references.point.traMeasurement',
          ]}
        />
      </Section>
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={references} />
      </Section>
    </Screen>
  );
}
