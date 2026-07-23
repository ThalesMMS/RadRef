import { Stack } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../core/i18n';
import { spacing, font, useTheme } from '../theme';

type ScreenProps = PropsWithChildren<Readonly<{
  titleKey: string;
  /** Small context line rendered under the navigation title. */
  subtitleKey?: string;
  /** Native large title (hub screens). Detail/form screens keep the inline title. */
  large?: boolean;
  testID?: string;
}>>;

export function Screen({ titleKey, subtitleKey, large = false, testID, children }: ScreenProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

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
        testID={testID}
      >
        {subtitleKey ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
        ) : null}
        {children}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  subtitle: {
    ...font.footnote,
    marginHorizontal: spacing.md,
    marginBottom: -spacing.xs,
  },
});
