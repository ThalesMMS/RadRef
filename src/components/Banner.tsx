import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { radii, spacing, font, useTheme, type Palette } from '../theme';
import { Icon, type IconName } from './Icon';

type BannerTone = 'info' | 'warning' | 'danger';

type BannerProps = Readonly<{
  titleKey?: string;
  textKey: string;
  tone?: BannerTone;
}>;

const toneConfig: Readonly<Record<BannerTone, { icon: IconName; color: (colors: Palette) => string }>> = {
  info: { icon: 'info.circle.fill', color: (colors) => colors.tint },
  warning: { icon: 'exclamationmark.triangle.fill', color: (colors) => colors.orange },
  danger: { icon: 'exclamationmark.octagon.fill', color: (colors) => colors.red },
};

/** Tinted callout card for scope notes and clinical caveats. */
export function Banner({ titleKey, textKey, tone = 'info' }: BannerProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const color = toneConfig[tone].color(theme.colors);

  return (
    <View style={[styles.banner, { backgroundColor: `${color}${theme.scheme === 'dark' ? '2B' : '1C'}` }]}>
      <Icon name={toneConfig[tone].icon} size={18} color={color} />
      <View style={styles.copy}>
        {titleKey ? <Text style={[styles.title, { color }]}>{t(titleKey)}</Text> : null}
        <Text style={[styles.text, { color: theme.colors.text }]}>{t(textKey)}</Text>
      </View>
    </View>
  );
}

/** Compact educational-use footnote, shown once per screen. */
export function Disclaimer() {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={styles.disclaimer}>
      <Icon name="stethoscope" size={13} color={colors.textSecondary} />
      <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
        <Text style={font.footnoteBold}>{t('disclaimer.title')}</Text>
        <Text>{' — '}</Text>
        <Text>{t('disclaimer.text')}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: spacing.sm,
    paddingRight: spacing.md,
  },
  copy: { flex: 1, gap: 2 },
  title: { ...font.footnoteBold },
  text: { ...font.footnote },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  disclaimerText: { ...font.footnote, flex: 1 },
});
