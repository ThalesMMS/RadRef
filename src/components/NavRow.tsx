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

/**
 * Tappable list row: tinted icon tile, title over subtitle, trailing chevron.
 * The favorite star is a button of its own, so it cannot live inside the row's pressable
 * (nested buttons on web, out of VoiceOver's reach on iOS). The pressable fills the row
 * from underneath instead: the rest of the row lets touches through to it and is hidden
 * from assistive tech, which hears the pressable.
 */
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
    <View style={styles.row}>
      <Pressable
        accessibilityRole={external ? 'link' : 'button'}
        accessibilityLabel={t(titleKey)}
        onPress={handlePress}
        testID={testID}
        style={({ pressed }) => [StyleSheet.absoluteFill, pressed && { backgroundColor: colors.highlight }]}
      />
      <View aria-hidden style={styles.content}>
        {icon ? <IconTile name={icon} color={tint} /> : null}
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]}>{t(titleKey)}</Text>
          {subtitleKey ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
          ) : null}
        </View>
      </View>
      {onToggleFavorite ? (
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? t('home.unfavorite') : t('home.favorite')}
          onPress={onToggleFavorite}
          style={styles.starButton}
        >
          <Icon
            name={favorite ? 'star.fill' : 'star'}
            size={18}
            color={favorite ? colors.orange : colors.textTertiary}
          />
        </Pressable>
      ) : null}
      <View aria-hidden style={styles.chevron}>
        <Icon name={external ? 'arrow.up.right' : 'chevron.right'} size={13} color={colors.textTertiary} weight="bold" />
      </View>
    </View>
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
  // pointerEvents lives in StyleSheet.create: react-native-web deprecates the prop and ignores it in inline styles.
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    pointerEvents: 'none',
  },
  copy: { flex: 1, gap: 2 },
  starButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // A View around the Icon: it renders as Text on Android, which ignores pointerEvents.
  chevron: { pointerEvents: 'none' },
  title: { ...font.body },
  subtitle: { ...font.footnote },
  value: { ...font.body, fontVariant: ['tabular-nums'] },
});
