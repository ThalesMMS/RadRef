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
  /** Accent for text and glyphs drawn on background/card surfaces. */
  tint: string;
  lung: string;
  renal: string;
  fracture: string;
  trauma: string;
  /** Deeper accent for filled surfaces that carry white text. */
  tintSolid: string;
  lungSolid: string;
  renalSolid: string;
  fractureSolid: string;
  traumaSolid: string;
  green: string;
  orange: string;
  red: string;
  pink: string;
  gray: string;
  /** track of the custom segmented control */
  segmentTrack: string;
  /** selected segment surface */
  segmentSurface: string;
}>;

export const palettes: Readonly<Record<ThemeScheme, Palette>> = {
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    fill: 'rgba(118, 118, 128, 0.10)',
    highlight: 'rgba(120, 120, 128, 0.16)',
    text: '#1C1C1E',
    textSecondary: 'rgba(60, 60, 67, 0.60)',
    textTertiary: 'rgba(60, 60, 67, 0.32)',
    separator: 'rgba(60, 60, 67, 0.20)',
    tint: '#0B69D4',
    lung: '#0B69D4',
    renal: '#0E8C8C',
    fracture: '#7A4EB2',
    trauma: '#B5472F',
    tintSolid: '#0B69D4',
    lungSolid: '#0B69D4',
    renalSolid: '#0E8C8C',
    fractureSolid: '#6D3FA5',
    traumaSolid: '#A13B27',
    green: '#248A3D',
    orange: '#C86A00',
    red: '#D70015',
    pink: '#BF2C55',
    gray: '#8E8E93',
    segmentTrack: 'rgba(118, 118, 128, 0.12)',
    segmentSurface: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    fill: 'rgba(118, 118, 128, 0.22)',
    highlight: 'rgba(120, 120, 128, 0.30)',
    text: '#FFFFFF',
    textSecondary: 'rgba(235, 235, 245, 0.60)',
    textTertiary: 'rgba(235, 235, 245, 0.30)',
    separator: 'rgba(84, 84, 88, 0.55)',
    tint: '#4C9CFF',
    lung: '#4C9CFF',
    renal: '#4CD0D0',
    fracture: '#C49AFF',
    trauma: '#FF8A70',
    tintSolid: '#0A6FE0',
    lungSolid: '#0A6FE0',
    renalSolid: '#0A7C7C',
    fractureSolid: '#7442AA',
    traumaSolid: '#A63A27',
    green: '#30D158',
    orange: '#FF9F0A',
    red: '#FF6961',
    pink: '#FF6482',
    gray: '#98989D',
    segmentTrack: 'rgba(118, 118, 128, 0.20)',
    segmentSurface: '#5A5A5E',
  },
} as const;

export type Theme = Readonly<{
  scheme: ThemeScheme;
  colors: Palette;
  /** Translucent version of a solid theme color, for tinted surfaces. */
  alpha: (color: string, opacity: number) => string;
}>;

function withAlpha(color: string, opacity: number): string {
  const clamped = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  return `${color}${clamped.toString(16).padStart(2, '0').toUpperCase()}`;
}

export function useTheme(): Theme {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: palettes[scheme], alpha: withAlpha };
}

export type ModuleAccentName = 'lung' | 'renal' | 'fracture' | 'trauma' | 'tint';

export function accentColor(colors: Palette, accent: ModuleAccentName): string {
  if (accent === 'lung') return colors.lung;
  if (accent === 'renal') return colors.renal;
  if (accent === 'fracture') return colors.fracture;
  if (accent === 'trauma') return colors.trauma;
  return colors.tint;
}

/** Accent variant safe to fill a surface that carries white text. */
export function accentSolid(colors: Palette, accent: ModuleAccentName): string {
  if (accent === 'lung') return colors.lungSolid;
  if (accent === 'renal') return colors.renalSolid;
  if (accent === 'fracture') return colors.fractureSolid;
  if (accent === 'trauma') return colors.traumaSolid;
  return colors.tintSolid;
}

/** Opacity of a tinted surface (icon tile, chip, callout) against the card. */
export function surfaceTint(theme: Theme, color: string): string {
  return withAlpha(color, theme.scheme === 'dark' ? 0.2 : 0.12);
}

export type SeverityColors = Readonly<{
  /** saturated severity color (badges, eyebrow, bullets) */
  color: string;
  /** faint tint behind the result surface — a hint, never a wash */
  surface: string;
}>;

const severityBase: Readonly<Record<Severity, (colors: Palette) => string>> = {
  neutral: (colors) => colors.gray,
  low: (colors) => colors.green,
  moderate: (colors) => colors.orange,
  high: (colors) => colors.red,
  critical: (colors) => colors.pink,
};

export function severityColors(theme: Theme, severity: Severity): SeverityColors {
  const color = severityBase[severity](theme.colors);
  return { color, surface: withAlpha(color, theme.scheme === 'dark' ? 0.14 : 0.07) };
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
  xl: 20,
  pill: 999,
} as const;

/** iOS text-style ramp (SF on iOS, Roboto on Android). Colors are applied at use sites. */
export const font = {
  title2: { fontSize: 22, lineHeight: 27, fontWeight: '700', letterSpacing: 0.35 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600', letterSpacing: 0.38 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.41 },
  body: { fontSize: 17, lineHeight: 23, fontWeight: '400', letterSpacing: -0.41 },
  bodyMedium: { fontSize: 17, lineHeight: 24, fontWeight: '500', letterSpacing: -0.41 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400', letterSpacing: -0.32 },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: -0.24 },
  subheadBold: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: -0.24 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: -0.08 },
  footnoteBold: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: -0.08 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0 },
  captionBold: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.06 },
  /** Small all-caps label used for section eyebrows. */
  overline: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.5 },
  /** Numeric/code text that should align in columns. */
  mono: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.2 },
} as const satisfies Readonly<Record<string, TextStyle>>;
