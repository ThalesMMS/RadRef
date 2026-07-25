import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n, type LanguageCode } from '../core/i18n';
import { font, useTheme } from '../theme';

const languages: readonly LanguageCode[] = ['pt', 'en'];

/** Minimal PT/EN toggle for the navigation bar — plain text, no nested pill. */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const { colors } = useTheme();

  return (
    <View
      style={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={t('language.selectorLabel')}
    >
      {languages.map((option, index) => {
        const selected = option === language;
        return (
          <View key={option} style={styles.item}>
            {index > 0 ? (
              <View style={[styles.divider, { backgroundColor: colors.textTertiary }]} />
            ) : null}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={t(`language.${option}.full`)}
              onPress={() => setLanguage(option)}
              hitSlop={8}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Text
                style={[
                  selected ? font.footnoteBold : font.footnote,
                  { color: selected ? colors.tint : colors.textTertiary },
                ]}
              >
                {t(`language.${option}.short`)}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, height: 12, marginHorizontal: 7 },
  button: { minHeight: 30, justifyContent: 'center' },
  pressed: { opacity: 0.5 },
});
