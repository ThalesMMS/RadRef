import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageSwitcher } from '../src/components';
import { I18nProvider } from '../src/core/i18n';
import { useTheme } from '../src/theme';

function AppStack() {
  const { scheme, colors } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.tint,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.separator,
        notification: colors.red,
      },
    };
  }, [colors, scheme]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerTintColor: colors.tint,
          headerTitleStyle: { color: colors.text },
          headerLargeTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
          headerRight: () => <LanguageSwitcher />,
          ...(Platform.OS === 'ios'
            ? {}
            : {
                headerStyle: { backgroundColor: colors.card },
                headerShadowVisible: false,
              }),
        }}
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar style="auto" />
        <AppStack />
      </I18nProvider>
    </SafeAreaProvider>
  );
}
