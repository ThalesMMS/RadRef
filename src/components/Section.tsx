import { Children, type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, useTheme } from '../theme';
import { InfoButton } from './InfoButton';

type SectionProps = PropsWithChildren<Readonly<{
  headerKey?: string;
  footerKey?: string;
  /** Left inset of row separators; 60 aligns with text next to a 32pt icon tile. */
  separatorInset?: number;
  /** Render header/footer around free-standing children (no grouped card). */
  plain?: boolean;
  /** Scope or criteria for the whole group, reachable from an (i) in the header. */
  infoKey?: string;
}>>;

/** iOS inset-grouped list: overline header, rounded card with hairline-separated rows, footnote footer. */
export function Section({
  headerKey,
  footerKey,
  separatorInset = spacing.md,
  plain = false,
  infoKey,
  children,
}: SectionProps) {
  const { t } = useI18n();
  const { colors } = useTheme();

  const header = headerKey ? (
    <View style={styles.headerRow}>
      <Text style={[styles.header, { color: colors.textSecondary }]}>{t(headerKey)}</Text>
      {infoKey === undefined ? null : <InfoButton titleKey={headerKey} textKey={infoKey} size={14} />}
    </View>
  ) : null;
  const footer = footerKey ? (
    <Text style={[styles.footer, { color: colors.textSecondary }]}>{t(footerKey)}</Text>
  ) : null;

  if (plain) {
    return (
      <View>
        {header}
        <View style={styles.plainStack}>{children}</View>
        {footer}
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
      {header}
      <View style={[styles.card, { backgroundColor: colors.card }]}>{separated}</View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: spacing.md,
    marginBottom: 8,
  },
  header: {
    ...font.overline,
    textTransform: 'uppercase',
    flexShrink: 1,
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
    marginTop: 8,
  },
});
