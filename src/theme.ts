import { useColorScheme, type TextStyle } from 'react-native';
import type { Severity } from './core/domain';

export type ThemeScheme = 'light' | 'dark';

export type Palette = Readonly<{
  /** systemGroupedBackground */
  background: string;
  /** secondarySystemGroupedBackground — inset grouped cards */
  card: string;
  /** tertiary fill — nested controls sitting on a card */
  fill: string;
  /** fill used while a row is pressed */
  highlight: string;
  /** primary label */
  text: string;
  /** secondaryLabel */
  textSecondary: string;
  /** tertiaryLabel */
  textTertiary: string;
  separator: string;
  tint: string;
  lung: string;
  renal: string;
  green: string;
  yellow: string;
  orange: string;
  red: string;
  pink: string;
  gray: string;
  /** solid track of the custom segmented control */
  segmentTrack: string;
  /** selected segment surface */
  segmentSurface: string;
}>;

export const palettes: Readonly<Record<ThemeScheme, Palette>> = {
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    fill: 'rgba(118, 118, 128, 0.12)',
    highlight: 'rgba(120, 120, 128, 0.20)',
    text: '#000000',
    textSecondary: 'rgba(60, 60, 67, 0.60)',
    textTertiary: 'rgba(60, 60, 67, 0.30)',
    separator: 'rgba(60, 60, 67, 0.29)',
    tint: '#007AFF',
    lung: '#007AFF',
    renal: '#2FA8BE',
    green: '#34C759',
    yellow: '#FFCC00',
    orange: '#FF9500',
    red: '#FF3B30',
    pink: '#FF2D55',
    gray: '#8E8E93',
    segmentTrack: 'rgba(118, 118, 128, 0.12)',
    segmentSurface: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    fill: 'rgba(118, 118, 128, 0.24)',
    highlight: 'rgba(120, 120, 128, 0.32)',
    text: '#FFFFFF',
    textSecondary: 'rgba(235, 235, 245, 0.60)',
    textTertiary: 'rgba(235, 235, 245, 0.30)',
    separator: 'rgba(84, 84, 88, 0.60)',
    tint: '#0A84FF',
    lung: '#0A84FF',
    renal: '#4DC4DB',
    green: '#30D158',
    yellow: '#FFD60A',
    orange: '#FF9F0A',
    red: '#FF453A',
    pink: '#FF375F',
    gray: '#8E8E93',
    segmentTrack: 'rgba(118, 118, 128, 0.18)',
    segmentSurface: '#636366',
  },
} as const;

export type Theme = Readonly<{
  scheme: ThemeScheme;
  colors: Palette;
}>;

export function useTheme(): Theme {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: palettes[scheme] };
}

export type ModuleAccentName = 'lung' | 'renal' | 'tint';

export function accentColor(colors: Palette, accent: ModuleAccentName): string {
  return accent === 'lung' ? colors.lung : accent === 'renal' ? colors.renal : colors.tint;
}

export type SeverityColors = Readonly<{
  /** saturated severity color (badges, emphasis) */
  color: string;
  /** translucent wash used behind result surfaces */
  wash: string;
  /** text drawn on top of the saturated color */
  onColor: string;
}>;

const severityAlpha: Readonly<Record<ThemeScheme, string>> = { light: '2E', dark: '3D' };

const severityBase: Readonly<Record<Severity, (colors: Palette) => string>> = {
  neutral: (colors) => colors.gray,
  low: (colors) => colors.green,
  moderate: (colors) => colors.orange,
  high: (colors) => colors.red,
  critical: (colors) => colors.pink,
};

export function severityColors(theme: Theme, severity: Severity): SeverityColors {
  const color = severityBase[severity](theme.colors);
  return { color, wash: `${color}${severityAlpha[theme.scheme]}`, onColor: '#FFFFFF' };
}

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

/** iOS text-style ramp (SF on iOS, Roboto on Android). Colors are applied at use sites. */
export const font = {
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: 0.35 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600', letterSpacing: 0.38 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.41 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400', letterSpacing: -0.41 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400', letterSpacing: -0.32 },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: -0.24 },
  subheadBold: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: -0.24 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: -0.08 },
  footnoteBold: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: -0.08 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0 },
  captionBold: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0 },
} as const satisfies Readonly<Record<string, TextStyle>>;
