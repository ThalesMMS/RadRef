import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type BannerTone = 'info' | 'warning' | 'danger';

type InfoBannerProps = Readonly<{
  titleKey?: string;
  textKey: string;
  tone?: BannerTone;
}>;

const palette: Readonly<Record<BannerTone, { border: string; background: string; foreground: string }>> = {
  info: { border: '#245776', background: colors.primarySoft, foreground: colors.primary },
  warning: { border: '#705A24', background: colors.warningSoft, foreground: colors.warning },
  danger: { border: '#6D3037', background: colors.dangerSoft, foreground: colors.danger },
};

export function InfoBanner({ titleKey, textKey, tone = 'info' }: InfoBannerProps) {
  const { t } = useI18n();
  const theme = palette[tone];
  return (
    <View style={[styles.banner, { borderColor: theme.border, backgroundColor: theme.background }]}>
      <View style={[styles.dot, { backgroundColor: theme.foreground }]} />
      <View style={styles.copy}>
        {titleKey ? <Text style={[styles.title, { color: theme.foreground }]}>{t(titleKey)}</Text> : null}
        <Text style={styles.text}>{t(textKey)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  copy: { flex: 1 },
  title: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  text: { color: colors.text, fontSize: 13, lineHeight: 19 },
});
