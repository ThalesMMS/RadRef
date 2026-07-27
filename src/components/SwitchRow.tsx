import { StyleSheet, Switch, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, spacing, useTheme } from '../theme';
import { InfoButton } from './InfoButton';

type SwitchRowProps = Readonly<{
  labelKey: string;
  descriptionKey?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  /** Definition or criterion reachable from an inline (i) next to the label. */
  infoKey?: string;
}>;

export function SwitchRow({
  labelKey,
  descriptionKey,
  value,
  onValueChange,
  disabled = false,
  infoKey,
}: SwitchRowProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.copy}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>{t(labelKey)}</Text>
          {infoKey === undefined ? null : <InfoButton titleKey={labelKey} textKey={infoKey} size={14} />}
        </View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: { ...font.body, flexShrink: 1 },
  description: { ...font.footnote },
  disabled: { opacity: 0.4 },
});
