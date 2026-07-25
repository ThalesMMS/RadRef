import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, surfaceTint, useTheme, type Theme } from '../theme';
import { Icon } from './Icon';

export type ChoiceOption<T extends string> = Readonly<{
  value: T;
  labelKey: string;
  descriptionKey?: string;
}>;

export type ChoiceVariant = 'segmented' | 'chips' | 'list';

type ChoiceRowProps<T extends string> = Readonly<{
  labelKey?: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: ChoiceVariant;
}>;

function autoVariant<T extends string>(options: readonly ChoiceOption<T>[], labels: readonly string[]): ChoiceVariant {
  if (options.some((option) => option.descriptionKey)) return 'list';
  const longest = Math.max(...labels.map((label) => label.length));
  if (options.length <= 4 && longest <= 12) return 'segmented';
  if (longest <= 22) return 'chips';
  return 'list';
}

/**
 * Single-choice control. Renders as a segmented control (few short options),
 * wrapping chips (many short options) or a checkmark list (long or described options).
 */
export function ChoiceRow<T extends string>({ labelKey, options, value, onChange, variant }: ChoiceRowProps<T>) {
  const { t } = useI18n();
  const theme = useTheme();
  const labels = options.map((option) => t(option.labelKey));
  const resolved = variant ?? autoVariant(options, labels);

  if (resolved === 'list') {
    return (
      <View>
        {labelKey ? (
          <Text style={[styles.listLabel, { color: theme.colors.textSecondary }]}>{t(labelKey)}</Text>
        ) : null}
        {options.map((option, index) => {
          const selected = option.value === value;
          return (
            <View key={option.value}>
              {index > 0 || labelKey ? (
                <View style={[styles.listSeparator, { backgroundColor: theme.colors.separator }]} />
              ) : null}
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onChange(option.value)}
                style={({ pressed }) => [styles.listRow, pressed && { backgroundColor: theme.colors.highlight }]}
              >
                <View style={styles.listCopy}>
                  <Text
                    style={[
                      selected ? font.bodyMedium : font.body,
                      { color: selected ? theme.colors.tint : theme.colors.text },
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                  {option.descriptionKey ? (
                    <Text style={[font.footnote, { color: theme.colors.textSecondary }]}>
                      {t(option.descriptionKey)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.check}>
                  {selected ? <Icon name="checkmark" size={15} color={theme.colors.tint} weight="semibold" /> : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      {...(labelKey ? { accessibilityLabel: t(labelKey) } : {})}
    >
      {labelKey ? (
        <Text style={[styles.groupLabel, { color: theme.colors.textSecondary }]}>{t(labelKey)}</Text>
      ) : null}
      {resolved === 'segmented'
        ? <Segmented options={options} labels={labels} value={value} onChange={onChange} theme={theme} />
        : <Chips options={options} labels={labels} value={value} onChange={onChange} theme={theme} />}
    </View>
  );
}

type ControlProps<T extends string> = Readonly<{
  options: readonly ChoiceOption<T>[];
  labels: readonly string[];
  value: T;
  onChange: (value: T) => void;
  theme: Theme;
}>;

function Segmented<T extends string>({ options, labels, value, onChange, theme }: ControlProps<T>) {
  return (
    <View style={[styles.track, { backgroundColor: theme.colors.segmentTrack }]}>
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && [styles.segmentSelected, { backgroundColor: theme.colors.segmentSurface }],
              pressed && !selected && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                selected ? font.subheadBold : font.subhead,
                { color: selected ? theme.colors.text : theme.colors.textSecondary },
              ]}
            >
              {labels[index]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Chips<T extends string>({ options, labels, value, onChange, theme }: ControlProps<T>) {
  return (
    <View style={styles.chipWrap}>
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              selected
                ? { backgroundColor: surfaceTint(theme, theme.colors.tint), borderColor: theme.colors.tint }
                : { backgroundColor: theme.colors.fill, borderColor: 'transparent' },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                selected ? font.subheadBold : font.subhead,
                { color: selected ? theme.colors.tint : theme.colors.text },
              ]}
            >
              {labels[index]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 10,
  },
  groupLabel: { ...font.subhead },
  track: {
    flexDirection: 'row',
    borderRadius: radii.sm + 2,
    padding: 2,
  },
  segment: {
    flex: 1,
    minHeight: 34,
    borderRadius: radii.sm,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentSelected: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.14)',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    minHeight: 36,
    borderRadius: radii.sm + 2,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLabel: {
    ...font.subhead,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 7,
  },
  listSeparator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  listCopy: { flex: 1, gap: 2 },
  check: { width: 18, alignItems: 'center' },
  pressed: { opacity: 0.55 },
});
