import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';

type SectionCardProps = PropsWithChildren<Readonly<{
  titleKey?: string;
  descriptionKey?: string;
  accessory?: ReactNode;
}>>;

export function SectionCard({ titleKey, descriptionKey, accessory, children }: SectionCardProps) {
  const { t } = useI18n();
  return (
    <View style={styles.card}>
      {titleKey || descriptionKey || accessory ? (
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            {titleKey ? <Text style={styles.title}>{t(titleKey)}</Text> : null}
            {descriptionKey ? <Text style={styles.description}>{t(descriptionKey)}</Text> : null}
          </View>
          {accessory}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  headerCopy: { flex: 1 },
  title: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 4 },
  body: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
});
