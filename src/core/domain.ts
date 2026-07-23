export type MessageParams = Readonly<Record<string, string | number>>;

export type MessageRef = Readonly<{
  key: string;
  params?: MessageParams;
}>;

export type Severity = 'neutral' | 'low' | 'moderate' | 'high' | 'critical';

export type ClinicalResult = Readonly<{
  code: string;
  title: MessageRef;
  recommendation: MessageRef;
  notes: readonly MessageRef[];
  warnings?: readonly MessageRef[];
  severity: Severity;
}>;

export function msg(key: string, params?: MessageParams): MessageRef {
  return params ? { key, params } : { key };
}
