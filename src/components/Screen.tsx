import { Stack } from 'expo-router';
import type { PropsWithChildren } from 'react';
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
          <View style={styles.lede}>
            <Text style={[styles.ledeText, { color: colors.textSecondary }]}>{t(subtitleKey)}</Text>
          </View>
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
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  lede: {
    paddingHorizontal: spacing.xxs,
    marginBottom: -spacing.xxs,
  },
  ledeText: { ...font.subhead },
});
