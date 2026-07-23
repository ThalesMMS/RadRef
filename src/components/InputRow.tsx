import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { spacing, font, useTheme } from '../theme';

type InputRowProps = Readonly<{
  labelKey: string;
  value: string;
  onChangeText: (value: string) => void;
  unitKey?: string;
  helperKey?: string;
  placeholderKey?: string;
  integer?: boolean;
}>;

/** Settings-style numeric row: label on the left, right-aligned inline input with unit. */
export function InputRow({
  labelKey,
  value,
  onChangeText,
  unitKey,
  helperKey,
  placeholderKey = 'common.numericPlaceholder',
  integer = false,
}: InputRowProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
          {t(labelKey)}
        </Text>
        <TextInput
          accessibilityLabel={t(labelKey)}
          value={value}
          onChangeText={onChangeText}
          placeholder={t(placeholderKey)}
          placeholderTextColor={colors.textTertiary}
          keyboardType={integer ? 'number-pad' : 'decimal-pad'}
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={[styles.input, { color: colors.tint }]}
        />
        {unitKey ? <Text style={[styles.unit, { color: colors.textSecondary }]}>{t(unitKey)}</Text> : null}
      </View>
      {helperKey ? (
        <Text style={[styles.helper, { color: colors.textSecondary }]}>{t(helperKey)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: { ...font.body, flexShrink: 1, flexGrow: 1 },
  input: {
    ...font.body,
    minWidth: 72,
    textAlign: 'right',
    paddingVertical: 4,
  },
  unit: { ...font.body },
  helper: { ...font.caption, marginTop: 2 },
});
