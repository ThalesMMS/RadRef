import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, useTheme } from '../theme';
import { Icon } from './Icon';
import { Sheet } from './Sheet';

type InfoButtonProps = Readonly<{
  /** Label of the control being explained; doubles as the sheet title. */
  titleKey: string;
  /** Definition or criterion shown in the sheet. */
  textKey: string;
  size?: number;
}>;

/**
 * Inline (i) affordance next to a control label. Keeps criteria one tap away
 * instead of spending a permanent line of the form on them.
 */
export function InfoButton({ titleKey, textKey, size = 15 }: InfoButtonProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.aboutLabel', { label: t(titleKey) })}
        onPress={() => setOpen(true)}
        hitSlop={12}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Icon name="info.circle" size={size} color={colors.tint} />
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)} title={t(titleKey)}>
        <Text style={[styles.body, { color: colors.text }]}>{t(textKey)}</Text>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center' },
  body: { ...font.callout },
  pressed: { opacity: 0.5 },
});
