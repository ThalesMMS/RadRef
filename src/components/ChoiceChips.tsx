import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

export type ChoiceOption<T extends string> = Readonly<{
  value: T;
  labelKey: string;
  descriptionKey?: string;
}>;

type ChoiceChipsProps<T extends string> = Readonly<{
  labelKey?: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}>;

export function ChoiceChips<T extends string>({
  labelKey,
  options,
  value,
  onChange,
  columns = 2,
}: ChoiceChipsProps<T>) {
  const { t } = useI18n();
  return (
    <View style={styles.group}>
      {labelKey ? <Text style={styles.groupLabel}>{t(labelKey)}</Text> : null}
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                columns === 1 ? styles.oneColumn : columns === 3 ? styles.threeColumns : styles.twoColumns,
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.optionLabel, selected && styles.selectedLabel]}>{t(option.labelKey)}</Text>
              {option.descriptionKey ? (
                <Text style={[styles.optionDescription, selected && styles.selectedDescription]}>{t(option.descriptionKey)}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.xs },
  groupLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  option: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  oneColumn: { flexBasis: '100%' },
  twoColumns: { flexGrow: 1, flexBasis: '46%' },
  threeColumns: { flexGrow: 1, flexBasis: '29%' },
  selected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionLabel: { color: colors.textMuted, fontSize: 13, lineHeight: 17, fontWeight: '700' },
  selectedLabel: { color: colors.text },
  optionDescription: { color: colors.textSubtle, fontSize: 11, lineHeight: 15, marginTop: 3 },
  selectedDescription: { color: colors.textMuted },
  pressed: { opacity: 0.72 },
});
