import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { accentColor, font, spacing, useTheme, type ModuleAccentName } from '../theme';
import { Icon, type IconName } from './Icon';
import { IconTile } from './IconTile';

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
  favorite?: boolean;
  onToggleFavorite?: () => void;
}>;

/** Tappable list row: tinted icon tile, title over subtitle, trailing chevron. */
export function NavRow({
  titleKey,
  subtitleKey,
  route,
  onPress,
  icon,
  accent = 'tint',
  external = false,
  testID,
  favorite,
  onToggleFavorite,
}: NavRowProps) {
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
      {icon ? <IconTile name={icon} color={tint} /> : null}
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{t(titleKey)}</Text>
        {subtitleKey ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
        ) : null}
      </View>
      {onToggleFavorite ? (
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? t('home.unfavorite') : t('home.favorite')}
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggleFavorite();
          }}
          style={styles.starButton}
        >
          <Icon
            name={favorite ? 'star.fill' : 'star'}
            size={18}
            color={favorite ? colors.orange : colors.textTertiary}
          />
        </Pressable>
      ) : null}
      <Icon name={external ? 'arrow.up.right' : 'chevron.right'} size={13} color={colors.textTertiary} weight="bold" />
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
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  copy: { flex: 1, gap: 2 },
  starButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { ...font.body },
  subtitle: { ...font.footnote },
  value: { ...font.body, fontVariant: ['tabular-nums'] },
});
