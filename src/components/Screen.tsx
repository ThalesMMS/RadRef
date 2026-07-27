import { Stack } from 'expo-router';
import { Fragment, type PropsWithChildren, type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../core/i18n';
import { font, spacing, useTheme } from '../theme';

type ScreenProps = PropsWithChildren<Readonly<{
  titleKey: string;
  /** Context line rendered under the navigation title. */
  subtitleKey?: string;
  /** Native large title (hub screens). Detail/form screens keep the inline title. */
  large?: boolean;
  /** Switcher between the sibling tools of a module; scrolls away with the lede. */
  switcher?: ReactNode;
  /**
   * Live result, pinned under the navigation bar while the form scrolls beneath it,
   * so changing an input never means scrolling to find what it did.
   */
  result?: ReactNode;
  testID?: string;
}>>;

export function Screen({
  titleKey,
  subtitleKey,
  large = false,
  switcher,
  result,
  testID,
  children,
}: ScreenProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const lede = subtitleKey !== undefined || switcher !== undefined ? (
    <View style={styles.lede}>
      {subtitleKey !== undefined ? (
        <Text style={[styles.ledeText, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
      ) : null}
      {switcher}
    </View>
  ) : null;

  // Children are flattened by React.Children.toArray before sticky indices are read,
  // so a null lede does not occupy a slot.
  const stickyIndices = result === undefined ? undefined : [lede === null ? 0 : 1];

  return (
    <>
      <Stack.Screen options={{ title: t(titleKey), headerLargeTitle: large }} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.xxl + (Platform.OS === 'ios' ? 0 : insets.bottom) },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        {...(stickyIndices === undefined ? {} : { stickyHeaderIndices: stickyIndices })}
        testID={testID}
      >
        {lede}
        {result === undefined ? null : (
          <View style={[styles.pinned, { backgroundColor: colors.background }]}>{result}</View>
        )}
        <Fragment>{children}</Fragment>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  lede: {
    marginBottom: -spacing.xxs,
    gap: spacing.sm,
  },
  ledeText: { ...font.subhead, paddingHorizontal: spacing.xxs },
  /** Opaque backing so the form scrolls cleanly under the pinned result. */
  pinned: { paddingBottom: spacing.sm, gap: spacing.sm },
});
