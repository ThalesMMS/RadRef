import { Pressable, StyleSheet, Text } from 'react-native';
import { useI18n } from '../core/i18n';
import { accentColor, radii, spacing, font, useTheme, type ModuleAccentName } from '../theme';
import { Icon, type IconName } from './Icon';

type ButtonProps = Readonly<{
  labelKey: string;
  onPress: () => void;
  /** filled: prominent tinted background; tinted: translucent wash; plain: borderless text. */
  variant?: 'filled' | 'tinted' | 'plain';
  accent?: ModuleAccentName;
  icon?: IconName;
  disabled?: boolean;
}>;

export function Button({ labelKey, onPress, variant = 'filled', accent = 'tint', icon, disabled = false }: ButtonProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const tint = accentColor(theme.colors, accent);
  const background = variant === 'filled' ? tint : variant === 'tinted' ? `${tint}${theme.scheme === 'dark' ? '2E' : '1F'}` : 'transparent';
  const foreground = variant === 'filled' ? '#FFFFFF' : tint;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(labelKey)}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'plain' && styles.plain,
        { backgroundColor: background },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon ? <Icon name={icon} size={17} color={foreground} weight="semibold" /> : null}
      <Text style={[styles.label, { color: foreground }]}>{t(labelKey)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.lg - 2,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  plain: { minHeight: 44 },
  label: { ...font.headline },
  pressed: { opacity: 0.55 },
  disabled: { opacity: 0.4 },
});
