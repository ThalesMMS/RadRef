import { StyleSheet, Text, View } from 'react-native';
import type { MessageRef, Severity } from '../core/domain';
import { useI18n } from '../core/i18n';
import { colors, radii, severityPalette, spacing } from '../theme';

type MetadataItem = Readonly<{
  labelKey: string;
  value: string;
}>;

type ResultCardProps = Readonly<{
  badge?: string;
  title: MessageRef;
  primary: MessageRef;
  severity: Severity;
  notes?: readonly MessageRef[];
  warnings?: readonly MessageRef[];
  metadata?: readonly MetadataItem[];
  secondary?: MessageRef;
}>;

export function ResultCard({
  badge,
  title,
  primary,
  severity,
  notes = [],
  warnings = [],
  metadata = [],
  secondary,
}: ResultCardProps) {
  const { t, tx } = useI18n();
  const palette = severityPalette[severity];
  return (
    <View style={[styles.card, { borderColor: palette.foreground }]}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>{t('result.label')}</Text>
          <Text style={styles.title}>{tx(title)}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: palette.background }]}>
            <Text style={[styles.badgeText, { color: palette.foreground }]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.primary}>{tx(primary)}</Text>
      {secondary ? <Text style={styles.secondary}>{tx(secondary)}</Text> : null}
      {metadata.length > 0 ? (
        <View style={styles.metadata}>
          {metadata.map((item) => (
            <View key={`${item.labelKey}:${item.value}`} style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>{t(item.labelKey)}</Text>
              <Text style={styles.metadataValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {notes.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>{t('result.notes')}</Text>
          {notes.map((note, index) => (
            <View key={`${note.key}:${index}`} style={styles.listRow}>
              <Text style={styles.bullet}>{t('common.bullet')}</Text>
              <Text style={styles.listText}>{tx(note)}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {warnings.length > 0 ? (
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>{t('result.warnings')}</Text>
          {warnings.map((warning, index) => (
            <View key={`${warning.key}:${index}`} style={styles.listRow}>
              <Text style={styles.warningBullet}>{t('common.warningSymbol')}</Text>
              <Text style={styles.listText}>{tx(warning)}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    backgroundColor: colors.cardStrong,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  titleWrap: { flex: 1 },
  eyebrow: { color: colors.textSubtle, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 18, lineHeight: 23, fontWeight: '800', marginTop: 3 },
  badge: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 6, minWidth: 44, alignItems: 'center' },
  badgeText: { fontSize: 15, fontWeight: '900' },
  primary: { color: colors.text, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  secondary: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  metadataItem: { backgroundColor: colors.backgroundElevated, borderRadius: radii.sm, padding: spacing.xs, minWidth: 112 },
  metadataLabel: { color: colors.textSubtle, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  metadataValue: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 2 },
  listSection: { gap: 6, paddingTop: spacing.xs, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  listTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  bullet: { color: colors.primary, fontSize: 13, lineHeight: 19 },
  listText: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  warningSection: { gap: 6, borderRadius: radii.md, padding: spacing.sm, backgroundColor: colors.warningSoft },
  warningTitle: { color: colors.warning, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  warningBullet: { color: colors.warning, fontSize: 13, lineHeight: 19 },
});
