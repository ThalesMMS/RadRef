import { StyleSheet, Switch, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, spacing } from '../theme';

type ToggleRowProps = Readonly<{
  labelKey: string;
  descriptionKey?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}>;

export function ToggleRow({ labelKey, descriptionKey, value, onValueChange, disabled = false }: ToggleRowProps) {
  const { t } = useI18n();
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.copy}>
        <Text style={styles.label}>{t(labelKey)}</Text>
        {descriptionKey ? <Text style={styles.description}>{t(descriptionKey)}</Text> : null}
      </View>
      <Switch
        accessibilityLabel={t(labelKey)}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primarySoft }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  copy: { flex: 1 },
  label: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '600' },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  disabled: { opacity: 0.45 },
});
