import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, spacing } from '../theme';

type KeyPointListProps = Readonly<{
  itemKeys: readonly string[];
}>;

export function KeyPointList({ itemKeys }: KeyPointListProps) {
  const { t } = useI18n();
  return (
    <View style={styles.list}>
      {itemKeys.map((key) => (
        <View key={key} style={styles.row}>
          <Text style={styles.bullet}>{t('common.bullet')}</Text>
          <Text style={styles.text}>{t(key)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  bullet: { color: colors.primary, fontSize: 14, lineHeight: 20 },
  text: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 20 },
});
