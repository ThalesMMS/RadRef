import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n, type LanguageCode } from '../core/i18n';
import { radii, font, useTheme } from '../theme';

const languages: readonly LanguageCode[] = ['pt', 'en'];

/** Compact segmented language toggle, sized for the navigation bar. */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const { colors, scheme } = useTheme();

  return (
    <View
      style={[styles.track, { backgroundColor: colors.segmentTrack }]}
      accessibilityRole="radiogroup"
      accessibilityLabel={t('language.selectorLabel')}
    >
      {languages.map((option) => {
        const selected = option === language;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={t(`language.${option}.full`)}
            onPress={() => setLanguage(option)}
            style={[
              styles.segment,
              selected && [
                styles.segmentSelected,
                { backgroundColor: scheme === 'dark' ? colors.segmentSurface : colors.card },
              ],
            ]}
          >
            <Text
              style={[
                selected ? font.captionBold : font.caption,
                { color: selected ? colors.text : colors.textSecondary },
              ]}
            >
              {t(`language.${option}.short`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    padding: 2,
  },
  segment: {
    minWidth: 36,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: radii.sm - 2,
    borderCurve: 'continuous',
  },
  segmentSelected: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
