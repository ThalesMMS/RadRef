import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, useTheme } from '../theme';

type InputRowProps = Readonly<{
  labelKey: string;
  value: string;
  onChangeText: (value: string) => void;
  unitKey?: string;
  helperKey?: string;
  placeholderKey?: string;
  integer?: boolean;
}>;

/** Numeric row: label on the left, a compact editable value field on the right. */
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
        <Text style={[styles.label, { color: colors.text }]}>{t(labelKey)}</Text>
        <View style={[styles.field, { backgroundColor: colors.fill }]}>
          <TextInput
            accessibilityLabel={t(labelKey)}
            value={value}
            onChangeText={onChangeText}
            placeholder={t(placeholderKey)}
            placeholderTextColor={colors.textTertiary}
            keyboardType={integer ? 'number-pad' : 'decimal-pad'}
            autoCorrect={false}
            selectTextOnFocus
            style={[styles.input, { color: colors.text }]}
          />
          {unitKey ? <Text style={[styles.unit, { color: colors.textSecondary }]}>{t(unitKey)}</Text> : null}
        </View>
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
    paddingVertical: 9,
    minHeight: 48,
    justifyContent: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: { ...font.body, flex: 1 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 34,
    borderRadius: radii.sm + 1,
    borderCurve: 'continuous',
    paddingHorizontal: 10,
  },
  input: {
    ...font.subheadBold,
    minWidth: 46,
    paddingVertical: 6,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  unit: { ...font.footnote },
  helper: { ...font.caption },
});
