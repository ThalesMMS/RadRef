import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { radii, spacing, font, useTheme, type Theme } from '../theme';
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
 * Single-choice control. Renders as a native-style segmented control (few short options),
 * wrapping capsule chips (many short options) or a checkmark list (long/described options).
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
                  <Text style={[font.body, { color: theme.colors.text }]}>{t(option.labelKey)}</Text>
                  {option.descriptionKey ? (
                    <Text style={[font.footnote, { color: theme.colors.textSecondary }]}>
                      {t(option.descriptionKey)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.check}>
                  {selected ? <Icon name="checkmark" size={16} color={theme.colors.tint} weight="semibold" /> : null}
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
              pressed && !selected && { opacity: 0.55 },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                selected ? font.footnoteBold : font.footnote,
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
              { backgroundColor: selected ? theme.colors.tint : theme.colors.fill },
              pressed && { opacity: 0.65 },
            ]}
          >
            <Text
              style={[
                selected ? font.subheadBold : font.subhead,
                { color: selected ? '#FFFFFF' : theme.colors.text },
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
    paddingVertical: 10,
    gap: spacing.xs,
  },
  groupLabel: { ...font.subhead },
  track: {
    flexDirection: 'row',
    borderRadius: radii.sm + 1,
    padding: 2,
  },
  segment: {
    flex: 1,
    minHeight: 32,
    borderRadius: radii.sm - 1,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentSelected: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    minHeight: 34,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLabel: {
    ...font.footnote,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 6,
  },
  listSeparator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  listCopy: { flex: 1, gap: 2 },
  check: { width: 20, alignItems: 'center' },
});
