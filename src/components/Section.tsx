import { Children, type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { radii, spacing, font, useTheme } from '../theme';

type SectionProps = PropsWithChildren<Readonly<{
  headerKey?: string;
  footerKey?: string;
  /** Left inset of row separators; 58 aligns with text next to a 29pt icon. */
  separatorInset?: number;
  /** Render header/footer around free-standing children (no grouped card). */
  plain?: boolean;
}>>;

/** iOS inset-grouped list: uppercase header, rounded card with hairline-separated rows, footnote footer. */
export function Section({ headerKey, footerKey, separatorInset = spacing.md, plain = false, children }: SectionProps) {
  const { t } = useI18n();
  const { colors } = useTheme();

  if (plain) {
    return (
      <View>
        {headerKey ? (
          <Text style={[styles.header, { color: colors.textSecondary }]}>{t(headerKey)}</Text>
        ) : null}
        <View style={styles.plainStack}>{children}</View>
        {footerKey ? (
          <Text style={[styles.footer, { color: colors.textSecondary }]}>{t(footerKey)}</Text>
        ) : null}
      </View>
    );
  }

  const rows = Children.toArray(children).filter(Boolean);
  const separated: ReactNode[] = [];
  rows.forEach((row, index) => {
    if (index > 0) {
      separated.push(
        <View
          key={`separator-${index}`}
          style={[styles.separator, { backgroundColor: colors.separator, marginLeft: separatorInset }]}
        />,
      );
    }
    separated.push(row);
  });

  return (
    <View>
      {headerKey ? (
        <Text style={[styles.header, { color: colors.textSecondary }]}>{t(headerKey)}</Text>
      ) : null}
      <View style={[styles.card, { backgroundColor: colors.card }]}>{separated}</View>
      {footerKey ? (
        <Text style={[styles.footer, { color: colors.textSecondary }]}>{t(footerKey)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...font.footnote,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginHorizontal: spacing.md,
    marginBottom: 7,
  },
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  plainStack: {
    gap: spacing.sm,
  },
  footer: {
    ...font.footnote,
    marginHorizontal: spacing.md,
    marginTop: 7,
  },
});
