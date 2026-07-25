import Constants from 'expo-constants';
import { Banner, Disclaimer, KeyPointList, Screen, Section, ValueRow } from '../components';

export function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.1.0';

  return (
    <Screen titleKey="about.title" subtitleKey="about.subtitle" large>
      <Section headerKey="about.guidelinesTitle" footerKey="about.guidelinesDescription">
        <KeyPointList itemKeys={[
          'about.guideline.fleischner',
          'about.guideline.lungRads',
          'about.guideline.brock',
          'about.guideline.bosniak',
          'about.guideline.cua',
          'about.guideline.aoOta',
          'about.guideline.aast',
        ]} />
      </Section>
      <Section headerKey="about.offlineTitle" footerKey="about.offlineDescription">
        <KeyPointList itemKeys={[
          'about.offline.localRules',
          'about.offline.noAccount',
          'about.offline.externalReferences',
        ]} />
      </Section>
      <Section headerKey="about.architectureTitle" footerKey="about.architectureDescription">
        <KeyPointList itemKeys={[
          'about.architecture.modules',
          'about.architecture.domain',
          'about.architecture.i18n',
          'about.architecture.tests',
        ]} />
      </Section>
      <Banner titleKey="about.assumptionsTitle" textKey="about.assumptionsText" tone="info" />
      <Section>
        <ValueRow labelKey="about.versionLabel" value={version} />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
