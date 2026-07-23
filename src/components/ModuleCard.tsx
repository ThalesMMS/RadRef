import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RadiologyModule } from '../core/moduleRegistry';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type ModuleCardProps = Readonly<{ module: RadiologyModule }>;

export function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const accent = module.accent === 'lung' ? colors.lung : colors.renal;
  const soft = module.accent === 'lung' ? colors.lungSoft : colors.renalSoft;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(module.route as Href)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={[styles.mark, { backgroundColor: soft, borderColor: accent }]}>
          <Text style={[styles.markText, { color: accent }]}>{t(module.shortLabelKey)}</Text>
        </View>
        <View style={[styles.count, { backgroundColor: soft }]}>
          <Text style={[styles.countText, { color: accent }]}>
            {t('home.toolCount', { count: module.tools.length })}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{t(module.titleKey)}</Text>
      <Text style={styles.description}>{t(module.descriptionKey)}</Text>
      <View style={styles.bottomRow}>
        <Text style={[styles.guideline, { color: accent }]}>{t(module.guidelineKey)}</Text>
        <Text style={styles.chevron}>{t('common.chevron')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mark: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { fontSize: 16, fontWeight: '900', letterSpacing: -0.2 },
  count: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  countText: { fontSize: 11, fontWeight: '800' },
  title: { color: colors.text, fontSize: 22, lineHeight: 27, fontWeight: '800', letterSpacing: -0.5 },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  guideline: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  chevron: { color: colors.textSubtle, fontSize: 20 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.995 }] },
});
