import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { accentColor, font, spacing, useTheme, type ModuleAccentName } from '../theme';

type KeyPointListProps = Readonly<{
  itemKeys: readonly string[];
  accent?: ModuleAccentName;
}>;

/** Bulleted key points, rendered as one block inside a Section. */
export function KeyPointList({ itemKeys, accent = 'tint' }: KeyPointListProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const dotColor = accentColor(colors, accent);
  return (
    <View style={styles.list}>
      {itemKeys.map((key) => (
        <View key={key} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.text, { color: colors.text }]}>{t(key)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 7,
  },
  text: { ...font.subhead, flex: 1 },
});
