import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { radii, spacing, font, useTheme } from '../theme';
import { Icon } from './Icon';

export type ReferenceItem = Readonly<{
  id: string;
  titleKey: string;
  subtitleKey: string;
  url: string;
}>;

type ReferenceListProps = Readonly<{
  items: readonly ReferenceItem[];
}>;

/** External literature links as Settings-style rows; render inside a Section with separatorInset 58. */
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
            <View style={[styles.iconBox, { backgroundColor: colors.tint }]}>
              <Icon name="link" size={15} color="#FFFFFF" weight="medium" />
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, { color: colors.text }]}>{t(item.titleKey)}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(item.subtitleKey)}</Text>
            </View>
            <Icon name="arrow.up.right" size={14} color={colors.textTertiary} weight="semibold" />
          </Pressable>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 58,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  iconBox: {
    width: 29,
    height: 29,
    borderRadius: radii.sm - 1,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { ...font.subheadBold },
  subtitle: { ...font.footnote },
});
