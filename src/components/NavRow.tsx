import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { accentColor, radii, spacing, font, useTheme, type ModuleAccentName } from '../theme';
import { Icon, type IconName } from './Icon';

type NavRowProps = Readonly<{
  titleKey: string;
  subtitleKey?: string;
  route?: string;
  onPress?: () => void;
  icon?: IconName;
  accent?: ModuleAccentName;
  /** Trailing arrow.up.right instead of a chevron (external links). */
  external?: boolean;
  testID?: string;
}>;

/** Settings-style tappable row: tinted icon square, title/subtitle, trailing chevron. */
export function NavRow({ titleKey, subtitleKey, route, onPress, icon, accent = 'tint', external = false, testID }: NavRowProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const tint = accentColor(colors, accent);

  const handlePress = () => {
    if (onPress) onPress();
    else if (route) router.push(route as Href);
  };

  return (
    <Pressable
      accessibilityRole={external ? 'link' : 'button'}
      accessibilityLabel={t(titleKey)}
      onPress={handlePress}
      testID={testID}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.highlight }]}
    >
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: tint }]}>
          <Icon name={icon} size={16} color="#FFFFFF" weight="medium" />
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{t(titleKey)}</Text>
        {subtitleKey ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
        ) : null}
      </View>
      <Icon name={external ? 'arrow.up.right' : 'chevron.right'} size={14} color={colors.textTertiary} weight="semibold" />
    </Pressable>
  );
}

type ValueRowProps = Readonly<{
  labelKey: string;
  value: string;
}>;

/** Static label/value row (e.g. app version). */
export function ValueRow({ labelKey, value }: ValueRowProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text, flex: 1 }]}>{t(labelKey)}</Text>
      <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  title: { ...font.body },
  subtitle: { ...font.footnote },
  value: { ...font.body },
});
