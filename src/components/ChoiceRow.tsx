import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, surfaceTint, useTheme, type Theme } from '../theme';
import { Icon } from './Icon';
import { InfoButton } from './InfoButton';
import { Sheet } from './Sheet';

export type ChoiceOption<T extends string> = Readonly<{
  value: T;
  labelKey: string;
  descriptionKey?: string;
}>;

export type ChoiceVariant = 'segmented' | 'chips' | 'list' | 'menu';

type ChoiceRowProps<T extends string> = Readonly<{
  labelKey?: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: ChoiceVariant;
  /** Definition or criterion reachable from an inline (i) next to the label. */
  infoKey?: string;
}>;

function autoVariant<T extends string>(options: readonly ChoiceOption<T>[], labels: readonly string[]): ChoiceVariant {
  if (options.some((option) => option.descriptionKey)) return 'menu';
  const longest = Math.max(...labels.map((label) => label.length));
  if (options.length <= 4 && longest <= 12) return 'segmented';
  if (options.length <= 6 && longest <= 22) return 'chips';
  return 'menu';
}

/**
 * Single-choice control. Renders as a segmented control (few short options),
 * wrapping chips (a handful of short options), a compact menu row that opens a
 * picker sheet (long or described options) or an always-open checkmark list.
 */
export function ChoiceRow<T extends string>({ labelKey, options, value, onChange, variant, infoKey }: ChoiceRowProps<T>) {
  const { t } = useI18n();
  const theme = useTheme();
  const labels = options.map((option) => t(option.labelKey));
  const requested = variant ?? autoVariant(options, labels);
  // The menu row needs a title on the left; without one the list stays open instead.
  const resolved = requested === 'menu' && labelKey === undefined ? 'list' : requested;

  if (resolved === 'menu' && labelKey !== undefined) {
    return (
      <Menu
        labelKey={labelKey}
        {...(infoKey === undefined ? {} : { infoKey })}
        options={options}
        labels={labels}
        value={value}
        onChange={onChange}
        theme={theme}
      />
    );
  }

  if (resolved === 'list') {
    return (
      <View>
        {labelKey ? (
          <View style={styles.listLabelRow}>
            <Text style={[styles.listLabel, { color: theme.colors.textSecondary }]}>{t(labelKey)}</Text>
            {infoKey === undefined ? null : <InfoButton titleKey={labelKey} textKey={infoKey} size={14} />}
          </View>
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
        <View style={styles.groupLabelRow}>
          <Text style={[styles.groupLabel, { color: theme.colors.textSecondary }]}>{t(labelKey)}</Text>
          {infoKey === undefined ? null : <InfoButton titleKey={labelKey} textKey={infoKey} size={14} />}
        </View>
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

type MenuProps<T extends string> = ControlProps<T> & Readonly<{
  labelKey: string;
  infoKey?: string;
}>;

/** `Label ⓘ …… Value ⇅` — one line in the form, the full option list in a sheet. */
function Menu<T extends string>({ labelKey, infoKey, options, labels, value, onChange, theme }: MenuProps<T>) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel = selectedIndex < 0 ? t('common.notSelected') : labels[selectedIndex] ?? '';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(labelKey)}
        accessibilityValue={{ text: selectedLabel }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: theme.colors.highlight }]}
      >
        <View style={styles.menuLabelWrap}>
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{t(labelKey)}</Text>
          {infoKey === undefined ? null : <InfoButton titleKey={labelKey} textKey={infoKey} size={14} />}
        </View>
        <View style={styles.menuValueWrap}>
          <Text numberOfLines={1} style={[styles.menuValue, { color: theme.colors.tint }]}>
            {selectedLabel}
          </Text>
          <Icon name="chevron.up.chevron.down" size={12} color={theme.colors.tint} weight="semibold" />
        </View>
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)} title={t(labelKey)}>
        <View style={[styles.sheetGroup, { backgroundColor: theme.colors.fill }]}>
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <View key={option.value}>
                {index > 0 ? (
                  <View style={[styles.listSeparator, { backgroundColor: theme.colors.separator }]} />
                ) : null}
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [styles.listRow, pressed && { backgroundColor: theme.colors.highlight }]}
                >
                  <View style={styles.listCopy}>
                    <Text
                      style={[
                        selected ? font.bodyMedium : font.body,
                        { color: selected ? theme.colors.tint : theme.colors.text },
                      ]}
                    >
                      {labels[index]}
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
      </Sheet>
    </>
  );
}

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
  groupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupLabel: { ...font.subhead },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  menuLabelWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuLabel: { ...font.body, flexShrink: 1 },
  menuValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '52%',
  },
  menuValue: { ...font.body, flexShrink: 1, textAlign: 'right' },
  sheetGroup: {
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
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
  listLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 7,
  },
  listLabel: { ...font.subhead },
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
