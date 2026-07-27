import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MessageRef, Severity } from '../core/domain';
import { useI18n } from '../core/i18n';
import {
  font,
  radii,
  severityColors,
  severityRank,
  severitySteps,
  spacing,
  surfaceTint,
  useTheme,
} from '../theme';
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
  /**
   * `hero` is the pinned summary at the top of a form: it keeps notes and metadata
   * behind a disclosure so the card stays short while the form scrolls under it.
   * `card` is the inline variant and renders every block open.
   */
  variant?: 'hero' | 'card';
}>;

/** Category codes longer than this are rule identifiers, not labels — shown as a footnote. */
const MAX_BADGE_LENGTH = 10;

/** Lines of `secondary` kept in the pinned hero; the full text lives in the details block. */
const HERO_SECONDARY_LINES = 2;

/**
 * Badges range from a single digit ("2") to a short metric ("Δ 20.0 HU"), so the glyph
 * steps down with length instead of relying on `adjustsFontSizeToFit`, which react-native-web ignores.
 */
function badgeFontSize(length: number): number {
  if (length <= 2) return font.display.fontSize;
  if (length <= 4) return 27;
  if (length <= 6) return 21;
  if (length <= 8) return 17;
  return 15;
}

export function ResultCard({
  badge,
  title,
  primary,
  severity,
  notes = [],
  warnings = [],
  metadata = [],
  secondary,
  variant = 'card',
}: ResultCardProps) {
  const { t, tx } = useI18n();
  const theme = useTheme();
  const { colors } = theme;
  const palette = severityColors(theme, severity);
  const [expanded, setExpanded] = useState(false);

  const isLabelBadge = badge !== undefined && badge.length <= MAX_BADGE_LENGTH;
  const codeFootnote = badge !== undefined && !isLabelBadge ? badge : undefined;
  const detailCount = metadata.length + notes.length + (codeFootnote === undefined ? 0 : 1);
  const collapsible = variant === 'hero' && detailCount > 0;
  const showDetails = !collapsible || expanded;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.surface }]} />
      <View style={[styles.accent, { backgroundColor: palette.color }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          {isLabelBadge ? (
            <View style={[styles.badge, { backgroundColor: surfaceTint(theme, palette.color) }]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.badgeText,
                  {
                    color: palette.color,
                    fontSize: badgeFontSize(badge.length),
                    lineHeight: Math.round(badgeFontSize(badge.length) * 1.18),
                  },
                ]}
              >
                {badge}
              </Text>
            </View>
          ) : null}
          <View style={styles.titleWrap}>
            <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>{t('result.label')}</Text>
            <Text style={[styles.title, { color: palette.color }]}>{tx(title)}</Text>
          </View>
        </View>

        <SeverityMeter severity={severity} color={palette.color} track={colors.fill} />

        <Text style={[styles.primary, { color: colors.text }]}>{tx(primary)}</Text>
        {secondary ? (
          <Text
            style={[styles.secondary, { color: colors.textSecondary }]}
            {...(collapsible && !expanded ? { numberOfLines: HERO_SECONDARY_LINES } : {})}
          >
            {tx(secondary)}
          </Text>
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

        {collapsible ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={t('result.details')}
            onPress={() => setExpanded((open) => !open)}
            style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}
          >
            <Icon
              name={expanded ? 'chevron.up' : 'chevron.down'}
              size={11}
              color={colors.tint}
              weight="bold"
            />
            <Text style={[styles.disclosureText, { color: colors.tint }]}>{t('result.details')}</Text>
            <View style={[styles.count, { backgroundColor: colors.fill }]}>
              <Text style={[styles.countText, { color: colors.textSecondary }]}>{String(detailCount)}</Text>
            </View>
          </Pressable>
        ) : null}

        {showDetails && metadata.length > 0 ? (
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

        {showDetails && notes.length > 0 ? (
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

        {showDetails && codeFootnote !== undefined ? (
          <Text style={[styles.code, { color: colors.textTertiary }]}>{codeFootnote}</Text>
        ) : null}
      </View>
    </View>
  );
}

type SeverityMeterProps = Readonly<{
  severity: Severity;
  color: string;
  track: string;
}>;

/**
 * Four-step gauge: how far up the severity ladder this result sits. Decorative for
 * assistive tech — the result title already states the severity in words.
 */
function SeverityMeter({ severity, color, track }: SeverityMeterProps) {
  const rank = severityRank(severity);
  return (
    <View
      style={styles.meter}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: severitySteps }, (_, step) => (
        <View
          key={step}
          style={[styles.meterStep, { backgroundColor: step < rank ? color : track }]}
        />
      ))}
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
    gap: spacing.sm,
  },
  titleWrap: { flex: 1, gap: 3 },
  eyebrow: {
    ...font.overline,
    textTransform: 'uppercase',
  },
  title: { ...font.title3 },
  badge: {
    minWidth: 64,
    maxWidth: '45%',
    height: 64,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeText: {
    ...font.display,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  meter: {
    flexDirection: 'row',
    gap: 4,
  },
  meterStep: {
    flex: 1,
    height: 5,
    borderRadius: radii.pill,
  },
  primary: { ...font.bodyMedium },
  secondary: { ...font.subhead },
  disclosure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    minHeight: 28,
  },
  disclosureText: { ...font.subheadBold },
  count: {
    minWidth: 20,
    borderRadius: radii.pill,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countText: { ...font.captionBold, fontVariant: ['tabular-nums'] },
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
  pressed: { opacity: 0.55 },
});
