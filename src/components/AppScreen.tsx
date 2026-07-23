import { useRouter } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../core/i18n';
import { colors, radii, spacing } from '../theme';
import { LanguageSwitcher } from './LanguageSwitcher';

type AppScreenProps = PropsWithChildren<Readonly<{
  titleKey: string;
  subtitleKey?: string;
  showBack?: boolean;
  headerAccessory?: ReactNode;
  footer?: ReactNode;
  testID?: string;
}>>;

export function AppScreen({
  titleKey,
  subtitleKey,
  showBack = true,
  headerAccessory,
  footer,
  children,
  testID,
}: AppScreenProps) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.safeArea} testID={testID}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.leading}>
              {showBack ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('common.back')}
                  onPress={() => router.back()}
                  style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                >
                  <Text style={styles.backSymbol}>{t('common.backSymbol')}</Text>
                </Pressable>
              ) : (
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>{t('app.mark')}</Text>
                </View>
              )}
              <View style={styles.titleWrap}>
                <Text style={styles.title}>{t(titleKey)}</Text>
                {subtitleKey ? <Text style={styles.subtitle}>{t(subtitleKey)}</Text> : null}
              </View>
            </View>
            <LanguageSwitcher />
          </View>
          {headerAccessory ? <View style={styles.accessory}>{headerAccessory}</View> : null}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  leading: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  titleWrap: { flex: 1 },
  title: { color: colors.text, fontSize: 22, lineHeight: 27, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
  },
  backSymbol: { color: colors.text, fontSize: 22, lineHeight: 24, fontWeight: '500' },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#245776',
  },
  brandMarkText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
  accessory: { marginTop: spacing.sm },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },
  footer: { marginTop: spacing.xs },
  pressed: { opacity: 0.66 },
});
