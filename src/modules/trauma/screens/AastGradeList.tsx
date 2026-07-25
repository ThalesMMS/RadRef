import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../../../core/i18n';
import { font, radii, severityColors, spacing, surfaceTint, useTheme } from '../../../theme';
import { severityForAastGrade, type AastScale } from '../domain';

type AastGradeListProps = Readonly<{
  scale: AastScale;
}>;

export function AastGradeList({ scale }: AastGradeListProps) {
  const { t, tx } = useI18n();
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      {scale.grades.map((entry, index) => {
        const palette = severityColors(theme, severityForAastGrade(entry.grade));
        return (
          <View key={entry.grade}>
            {index > 0 ? <View style={[styles.separator, { backgroundColor: theme.colors.separator }]} /> : null}
            <View style={styles.row}>
              <View style={[styles.gradeBadge, { backgroundColor: surfaceTint(theme, palette.color) }]}>
                <Text style={[styles.grade, { color: palette.color }]}>{entry.grade}</Text>
              </View>
              <View style={styles.copy}>
                {entry.criteria.map((criterion, criterionIndex) => (
                  <Text key={`${criterion.key}:${criterionIndex}`} style={[font.subhead, { color: theme.colors.text }]}>
                    {tx(criterion)}
                  </Text>
                ))}
                {entry.ais !== undefined ? (
                  <Text style={[font.caption, { color: theme.colors.textSecondary }]}>
                    {t('trauma.aast.aisValue', { value: entry.ais })}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 76,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  gradeBadge: {
    width: 48,
    minHeight: 36,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  grade: {
    ...font.headline,
    fontVariant: ['tabular-nums'],
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
