import { StyleSheet, Text, View } from 'react-native';
import type { MessageRef, Severity } from '../core/domain';
import { useI18n } from '../core/i18n';
import { radii, severityColors, spacing, font, useTheme } from '../theme';
import { Icon } from './Icon';

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
  const theme = useTheme();
  const { colors } = theme;
  const palette = severityColors(theme, severity);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.wash }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text style={[styles.eyebrow, { color: palette.color }]}>{t('result.label')}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{tx(title)}</Text>
          </View>
          {badge ? (
            badge.length <= 8 ? (
              <View style={[styles.badge, { backgroundColor: palette.color }]}>
                <Text style={[styles.badgeText, { color: palette.onColor }]}>{badge}</Text>
              </View>
            ) : (
              <View style={[styles.badgeCompact, { backgroundColor: colors.fill }]}>
                <Text style={[styles.badgeCompactText, { color: palette.color }]}>{badge}</Text>
              </View>
            )
          ) : null}
        </View>

        <Text style={[styles.primary, { color: colors.text }]}>{tx(primary)}</Text>
        {secondary ? (
          <Text style={[styles.secondary, { color: colors.textSecondary }]}>{tx(secondary)}</Text>
        ) : null}

        {metadata.length > 0 ? (
          <View style={styles.metadata}>
            {metadata.map((item) => (
              <View
                key={`${item.labelKey}:${item.value}`}
                style={[styles.metadataPill, { backgroundColor: colors.fill }]}
              >
                <Text style={[styles.metadataLabel, { color: colors.textSecondary }]}>{t(item.labelKey)}</Text>
                <Text style={[styles.metadataValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {notes.length > 0 ? (
          <View style={[styles.notes, { borderTopColor: colors.separator }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('result.notes')}</Text>
            {notes.map((note, index) => (
              <View key={`${note.key}:${index}`} style={styles.noteRow}>
                <View style={[styles.noteDot, { backgroundColor: palette.color }]} />
                <Text style={[styles.noteText, { color: colors.textSecondary }]}>{tx(note)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {warnings.length > 0 ? (
          <View style={[styles.warnings, { backgroundColor: `${colors.orange}${theme.scheme === 'dark' ? '33' : '26'}` }]}>
            <Text style={[styles.sectionTitle, { color: colors.orange }]}>{t('result.warnings')}</Text>
            {warnings.map((warning, index) => (
              <View key={`${warning.key}:${index}`} style={styles.noteRow}>
                <Icon name="exclamationmark.triangle.fill" size={13} color={colors.orange} />
                <Text style={[styles.noteText, { color: colors.text }]}>{tx(warning)}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleWrap: { flex: 1, gap: 3 },
  eyebrow: {
    ...font.captionBold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: { ...font.title3 },
  badge: {
    minWidth: 44,
    minHeight: 36,
    borderRadius: radii.md - 2,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    ...font.headline,
    fontVariant: ['tabular-nums'],
  },
  badgeCompact: {
    maxWidth: 150,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeCompactText: {
    ...font.footnoteBold,
    fontVariant: ['tabular-nums'],
  },
  primary: { ...font.body },
  secondary: { ...font.subhead },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metadataPill: {
    borderRadius: radii.sm,
    borderCurve: 'continuous',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 1,
  },
  metadataLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metadataValue: {
    ...font.footnoteBold,
    fontVariant: ['tabular-nums'],
  },
  notes: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: 6,
  },
  sectionTitle: {
    ...font.captionBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  noteDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6.5,
  },
  noteText: { ...font.footnote, flex: 1 },
  warnings: {
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: spacing.sm,
    gap: 6,
  },
});
