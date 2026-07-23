export function parseLocalizedNumber(value: string): number | undefined {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '') return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function roundToNearestMillimeter(value: number): number {
  return Math.round(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number, digits = 1): string {
  return value.toFixed(digits);
}
