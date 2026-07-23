import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n, type LanguageCode } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

const languages: readonly LanguageCode[] = ['pt', 'en'];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel={t('language.selectorLabel')}>
      {languages.map((option) => {
        const selected = option === language;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={t(`language.${option}.full`)}
            onPress={() => setLanguage(option)}
            style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{t(`language.${option}.short`)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    padding: 2,
    backgroundColor: colors.backgroundElevated,
  },
  option: {
    minWidth: 38,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
  },
  selected: {
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.72,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  selectedLabel: {
    color: colors.primary,
  },
});
