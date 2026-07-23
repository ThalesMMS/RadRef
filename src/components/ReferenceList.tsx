import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

export type ReferenceItem = Readonly<{
  id: string;
  titleKey: string;
  subtitleKey: string;
  url: string;
}>;

type ReferenceListProps = Readonly<{
  items: readonly ReferenceItem[];
}>;

export function ReferenceList({ items }: ReferenceListProps) {
  const { t } = useI18n();
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="link"
          accessibilityLabel={t(item.titleKey)}
          onPress={() => {
            void Linking.openURL(item.url);
          }}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          <View style={styles.icon}>
            <Text style={styles.iconText}>{t('common.referenceSymbol')}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>
          </View>
          <Text style={styles.external}>{t('common.externalSymbol')}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.sm,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  copy: { flex: 1 },
  title: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  external: { color: colors.textSubtle, fontSize: 16 },
  pressed: { opacity: 0.7 },
});
