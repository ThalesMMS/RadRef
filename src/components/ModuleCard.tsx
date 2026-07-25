import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import type { RadiologyModule } from '../core/moduleRegistry';
import { accentColor, font, radii, spacing, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';
import { IconTile } from './IconTile';

const moduleIcons: Readonly<Record<RadiologyModule['id'], IconName>> = {
  lung: 'lungs.fill',
  renal: 'drop.fill',
};

type ModuleCardProps = Readonly<{ module: RadiologyModule }>;

/** Hero card for a clinical module: what it is, what it does, which guidelines it follows. */
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
        <IconTile name={moduleIcons[module.id]} color={tint} size={40} />
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.text }]}>{t(module.titleKey)}</Text>
          <Text style={[styles.count, { color: colors.textTertiary }]}>
            {t('home.toolCount', { count: module.tools.length })}
          </Text>
        </View>
        <Icon name="chevron.right" size={13} color={colors.textTertiary} weight="bold" />
      </View>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t(module.descriptionKey)}
      </Text>
      <View style={[styles.guidelineRow, { borderTopColor: colors.separator }]}>
        <Text style={[styles.guideline, { color: tint }]}>{t(module.guidelineKey)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleWrap: { flex: 1, gap: 1 },
  title: { ...font.headline },
  count: { ...font.caption },
  description: { ...font.subhead },
  guidelineRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 11,
  },
  guideline: { ...font.caption },
  pressed: { opacity: 0.7 },
});
