import { StyleSheet, Text, View } from 'react-native';
import type { MessageRef, Severity } from '../core/domain';
import { useI18n } from '../core/i18n';
import { font, radii, severityColors, spacing, surfaceTint, useTheme } from '../theme';
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

/** Category codes longer than this are rule identifiers, not labels — shown as a footnote. */
const MAX_BADGE_LENGTH = 10;

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
  const isLabelBadge = badge !== undefined && badge.length <= MAX_BADGE_LENGTH;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.surface }]} />
      <View style={[styles.accent, { backgroundColor: palette.color }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text style={[styles.eyebrow, { color: palette.color }]}>{t('result.label')}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{tx(title)}</Text>
          </View>
          {isLabelBadge ? (
            <View style={[styles.badge, { backgroundColor: surfaceTint(theme, palette.color) }]}>
              <Text style={[styles.badgeText, { color: palette.color }]}>{badge}</Text>
            </View>
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
          <View style={[styles.block, { borderTopColor: colors.separator }]}>
            <Text style={[styles.blockTitle, { color: colors.textSecondary }]}>{t('result.notes')}</Text>
            {notes.map((note, index) => (
              <View key={`${note.key}:${index}`} style={styles.noteRow}>
                <View style={[styles.noteDot, { backgroundColor: palette.color }]} />
                <Text style={[styles.noteText, { color: colors.textSecondary }]}>{tx(note)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {warnings.length > 0 ? (
          <View style={[styles.warnings, { backgroundColor: surfaceTint(theme, colors.orange) }]}>
            <Text style={[styles.blockTitle, { color: colors.orange }]}>{t('result.warnings')}</Text>
            {warnings.map((warning, index) => (
              <View key={`${warning.key}:${index}`} style={styles.noteRow}>
                <Icon name="exclamationmark.triangle.fill" size={12} color={colors.orange} />
                <Text style={[styles.noteText, { color: colors.text }]}>{tx(warning)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {badge !== undefined && !isLabelBadge ? (
          <Text style={[styles.code, { color: colors.textTertiary }]}>{badge}</Text>
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
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  content: {
    paddingLeft: spacing.md + 3,
    paddingRight: spacing.md,
    paddingVertical: spacing.md,
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
    ...font.overline,
    textTransform: 'uppercase',
  },
  title: { ...font.title3 },
  badge: {
    minWidth: 52,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  badgeText: {
    ...font.title3,
    fontVariant: ['tabular-nums'],
  },
  primary: { ...font.bodyMedium },
  secondary: { ...font.subhead },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metadataPill: {
    borderRadius: radii.sm + 2,
    borderCurve: 'continuous',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  metadataLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metadataValue: {
    ...font.subheadBold,
    fontVariant: ['tabular-nums'],
  },
  block: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: 7,
  },
  blockTitle: {
    ...font.overline,
    textTransform: 'uppercase',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  noteDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 7,
  },
  noteText: { ...font.footnote, flex: 1 },
  warnings: {
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: spacing.sm,
    gap: 7,
  },
  code: {
    ...font.mono,
    fontVariant: ['tabular-nums'],
  },
});
