import { StyleSheet, Switch, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, spacing, useTheme } from '../theme';

type SwitchRowProps = Readonly<{
  labelKey: string;
  descriptionKey?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}>;

export function SwitchRow({ labelKey, descriptionKey, value, onValueChange, disabled = false }: SwitchRowProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: colors.text }]}>{t(labelKey)}</Text>
        {descriptionKey ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>{t(descriptionKey)}</Text>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={t(labelKey)}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: colors.tint, false: colors.fill }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  copy: { flex: 1, gap: 2 },
  label: { ...font.body },
  description: { ...font.footnote },
  disabled: { opacity: 0.4 },
});
