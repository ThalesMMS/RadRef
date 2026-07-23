import Constants from 'expo-constants';
import { AppScreen, Disclaimer, InfoBanner, KeyPointList, SectionCard } from '../components';
import { useI18n } from '../core/i18n';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';

export function AboutScreen() {
  const { t } = useI18n();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <AppScreen titleKey="about.title" subtitleKey="about.subtitle">
      <Disclaimer />
      <SectionCard titleKey="about.guidelinesTitle" descriptionKey="about.guidelinesDescription">
        <KeyPointList itemKeys={[
          'about.guideline.fleischner',
          'about.guideline.lungRads',
          'about.guideline.brock',
          'about.guideline.bosniak',
          'about.guideline.cua',
        ]} />
      </SectionCard>
      <SectionCard titleKey="about.offlineTitle" descriptionKey="about.offlineDescription">
        <KeyPointList itemKeys={[
          'about.offline.localRules',
          'about.offline.noAccount',
          'about.offline.externalReferences',
        ]} />
      </SectionCard>
      <SectionCard titleKey="about.architectureTitle" descriptionKey="about.architectureDescription">
        <KeyPointList itemKeys={[
          'about.architecture.modules',
          'about.architecture.domain',
          'about.architecture.i18n',
          'about.architecture.tests',
        ]} />
      </SectionCard>
      <InfoBanner titleKey="about.assumptionsTitle" textKey="about.assumptionsText" tone="info" />
      <View style={styles.versionBox}>
        <Text style={styles.versionLabel}>{t('about.versionLabel')}</Text>
        <Text style={styles.versionValue}>{version}</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.sm,
  },
  versionLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  versionValue: { color: colors.text, fontSize: 13, fontWeight: '800' },
});
