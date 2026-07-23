import type { Severity } from './core/domain';

export const colors = {
  background: '#07111D',
  backgroundElevated: '#0A1623',
  card: '#0F1C29',
  cardStrong: '#142437',
  border: '#203246',
  text: '#F4F7FA',
  textMuted: '#A7B4C3',
  textSubtle: '#738399',
  primary: '#63C7FF',
  primarySoft: '#14334A',
  lung: '#62C7FF',
  lungSoft: '#12344A',
  renal: '#65D5B3',
  renalSoft: '#123A35',
  warning: '#F6C868',
  warningSoft: '#3E3118',
  danger: '#FF8C8C',
  dangerSoft: '#422326',
  success: '#78D7A3',
  successSoft: '#15392A',
  neutral: '#B7C3D0',
  neutralSoft: '#263340',
  overlay: 'rgba(0, 0, 0, 0.25)',
} as const;

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
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
} as const;

export const severityPalette: Readonly<Record<Severity, { foreground: string; background: string }>> = {
  neutral: { foreground: colors.neutral, background: colors.neutralSoft },
  low: { foreground: colors.success, background: colors.successSoft },
  moderate: { foreground: colors.warning, background: colors.warningSoft },
  high: { foreground: colors.danger, background: colors.dangerSoft },
  critical: { foreground: '#FFB1B1', background: '#551D25' },
};
