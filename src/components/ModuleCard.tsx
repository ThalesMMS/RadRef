import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import type { RadiologyModule } from '../core/moduleRegistry';
import { accentColor, radii, spacing, font, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

const moduleIcons: Readonly<Record<RadiologyModule['id'], IconName>> = {
  lung: 'lungs.fill',
  renal: 'drop.fill',
};

type ModuleCardProps = Readonly<{ module: RadiologyModule }>;

/** Hero card for a clinical module on the home screen. */
export function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const tint = accentColor(colors, module.accent);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(module.titleKey)}
      onPress={() => router.push(module.route as Href)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: tint }]}>
          <Icon name={moduleIcons[module.id]} size={24} color="#FFFFFF" weight="medium" />
        </View>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.text }]}>{t(module.titleKey)}</Text>
          <Text style={[styles.guideline, { color: tint }]}>{t(module.guidelineKey)}</Text>
        </View>
        <Icon name="chevron.right" size={14} color={colors.textTertiary} weight="semibold" />
      </View>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{t(module.descriptionKey)}</Text>
      <Text style={[styles.count, { color: colors.textTertiary }]}>
        {t('home.toolCount', { count: module.tools.length })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    padding: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md - 2,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, gap: 2 },
  title: { ...font.headline },
  guideline: { ...font.footnoteBold },
  description: { ...font.subhead, marginTop: 2 },
  count: { ...font.caption },
  pressed: { opacity: 0.75 },
});
