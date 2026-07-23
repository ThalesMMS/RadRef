import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type ToolCardProps = Readonly<{
  titleKey: string;
  descriptionKey: string;
  route: string;
  metaKey?: string;
  accent?: 'lung' | 'renal' | 'primary';
}>;

export function ToolCard({ titleKey, descriptionKey, route, metaKey, accent = 'primary' }: ToolCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const accentColor = accent === 'lung' ? colors.lung : accent === 'renal' ? colors.renal : colors.primary;
  const accentSoft = accent === 'lung' ? colors.lungSoft : accent === 'renal' ? colors.renalSoft : colors.primarySoft;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(route as Href)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.marker, { backgroundColor: accentSoft, borderColor: accentColor }]}>
        <Text style={[styles.markerText, { color: accentColor }]}>{t('common.openSymbol')}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{t(titleKey)}</Text>
        <Text style={styles.description}>{t(descriptionKey)}</Text>
        {metaKey ? <Text style={[styles.meta, { color: accentColor }]}>{t(metaKey)}</Text> : null}
      </View>
      <Text style={styles.chevron}>{t('common.chevron')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
  },
  marker: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: { fontSize: 18, fontWeight: '800' },
  copy: { flex: 1 },
  title: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  meta: { fontSize: 11, lineHeight: 15, fontWeight: '700', marginTop: 6 },
  chevron: { color: colors.textSubtle, fontSize: 20 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.995 }] },
});
