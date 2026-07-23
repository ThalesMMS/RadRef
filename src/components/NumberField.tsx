import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type NumberFieldProps = Readonly<{
  labelKey: string;
  value: string;
  onChangeText: (value: string) => void;
  unitKey?: string;
  helperKey?: string;
  placeholderKey?: string;
  integer?: boolean;
}>;

export function NumberField({
  labelKey,
  value,
  onChangeText,
  unitKey,
  helperKey,
  placeholderKey = 'common.numericPlaceholder',
  integer = false,
}: NumberFieldProps) {
  const { t } = useI18n();
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t(labelKey)}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={t(labelKey)}
          value={value}
          onChangeText={onChangeText}
          placeholder={t(placeholderKey)}
          placeholderTextColor={colors.textSubtle}
          keyboardType={integer ? 'number-pad' : 'decimal-pad'}
          autoCorrect={false}
          style={styles.input}
        />
        {unitKey ? <Text style={styles.unit}>{t(unitKey)}</Text> : null}
      </View>
      {helperKey ? <Text style={styles.helper}>{t(helperKey)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    minHeight: 46,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  unit: { color: colors.textMuted, fontSize: 13, fontWeight: '600', paddingRight: spacing.sm },
  helper: { color: colors.textSubtle, fontSize: 11, lineHeight: 15 },
});
