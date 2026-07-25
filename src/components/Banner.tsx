import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, surfaceTint, useTheme, type Palette } from '../theme';
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

/** Tinted callout for scope notes and clinical caveats. */
export function Banner({ titleKey, textKey, tone = 'info' }: BannerProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const color = toneConfig[tone].color(theme.colors);

  return (
    <View style={[styles.banner, { backgroundColor: surfaceTint(theme, color) }]}>
      <Icon name={toneConfig[tone].icon} size={15} color={color} />
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
      <Icon name="stethoscope" size={12} color={colors.textSecondary} />
      <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
        <Text style={font.captionBold}>{t('disclaimer.title')}</Text>
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
    gap: 10,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
  },
  copy: { flex: 1, gap: 3 },
  title: { ...font.footnoteBold },
  text: { ...font.footnote },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  disclaimerText: { ...font.caption, flex: 1 },
});
