import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, spacing, useTheme } from '../theme';
import { Icon } from './Icon';
import { IconTile } from './IconTile';

export type ReferenceItem = Readonly<{
  id: string;
  titleKey: string;
  subtitleKey: string;
  url: string;
}>;

type ReferenceListProps = Readonly<{
  items: readonly ReferenceItem[];
}>;

/** External literature links as list rows; render inside a Section with separatorInset 60. */
export function ReferenceList({ items }: ReferenceListProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <>
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 ? (
            <View style={[styles.separator, { backgroundColor: colors.separator }]} />
          ) : null}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t(item.titleKey)}
            onPress={() => {
              void Linking.openURL(item.url);
            }}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.highlight }]}
          >
            <IconTile name="link" color={colors.tint} />
            <View style={styles.copy}>
              <Text style={[styles.title, { color: colors.text }]}>{t(item.titleKey)}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(item.subtitleKey)}</Text>
            </View>
            <Icon name="arrow.up.right" size={13} color={colors.textTertiary} weight="bold" />
          </Pressable>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  copy: { flex: 1, gap: 2 },
  title: { ...font.subheadBold },
  subtitle: { ...font.footnote },
});
