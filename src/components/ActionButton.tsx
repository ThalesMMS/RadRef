import { Pressable, StyleSheet, Text } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type ActionButtonProps = Readonly<{
  labelKey: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'lung' | 'renal';
  disabled?: boolean;
}>;

export function ActionButton({ labelKey, onPress, tone = 'secondary', disabled = false }: ActionButtonProps) {
  const { t } = useI18n();
  const backgroundColor = tone === 'primary'
    ? colors.primary
    : tone === 'lung'
      ? colors.lung
      : tone === 'renal'
        ? colors.renal
        : colors.backgroundElevated;
  const foregroundColor = tone === 'secondary' ? colors.text : colors.background;
  const borderColor = tone === 'secondary' ? colors.border : backgroundColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(labelKey)}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: foregroundColor }]}>{t(labelKey)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.995 }] },
  disabled: { opacity: 0.45 },
});
