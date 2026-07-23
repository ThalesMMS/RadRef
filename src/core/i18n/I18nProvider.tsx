import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { MessageParams, MessageRef } from '../domain';
import en from './locales/en.json';
import pt from './locales/pt.json';

export type LanguageCode = 'en' | 'pt';
export type TranslationParams = MessageParams;

type Dictionary = Readonly<Record<string, string>>;

type I18nContextValue = Readonly<{
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: TranslationParams) => string;
  tx: (message: MessageRef) => string;
}>;

const dictionaries: Readonly<Record<LanguageCode, Dictionary>> = { en, pt };
const storageKey = 'radref:language';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function deviceLanguage(): LanguageCode {
  const code = getLocales()[0]?.languageCode?.toLowerCase();
  return code === 'pt' ? 'pt' : 'en';
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/{{\s*([A-Za-z0-9_]+)\s*}}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<LanguageCode>(deviceLanguage);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey)
      .then((saved) => {
        if (active && (saved === 'en' || saved === 'pt')) setLanguageState(saved);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((next: LanguageCode) => {
    setLanguageState(next);
    AsyncStorage.setItem(storageKey, next).catch(() => undefined);
  }, []);

  const t = useCallback((key: string, params?: TranslationParams) => {
    const template = dictionaries[language][key] ?? dictionaries.en[key] ?? key;
    return interpolate(template, params);
  }, [language]);

  const tx = useCallback((message: MessageRef) => t(message.key, message.params), [t]);

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t, tx }), [language, setLanguage, t, tx]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
