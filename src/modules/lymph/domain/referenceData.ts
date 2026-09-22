/** Published dimensional references, not a malignancy classifier or management algorithm. */
export type LymphRegion = 'cervical' | 'thoracic' | 'abdominal';
export const lymphRegions: readonly LymphRegion[] = ['cervical', 'thoracic', 'abdominal'];

export const lymphSources = [
  { id: 'brekel1990', titleKey: 'lymph.source.brekel1990.title', subtitleKey: 'lymph.source.brekel1990.subtitle', url: 'https://doi.org/10.1148/radiology.177.2.2217772' },
  { id: 'tang2014', titleKey: 'lymph.source.tang2014.title', subtitleKey: 'lymph.source.tang2014.subtitle', url: 'https://doi.org/10.1371/journal.pone.0108375' },
  { id: 'glazer1985', titleKey: 'lymph.source.glazer1985.title', subtitleKey: 'lymph.source.glazer1985.subtitle', url: 'https://doi.org/10.2214/ajr.144.2.261' },
  { id: 'kiyono1989', titleKey: 'lymph.source.kiyono1989.title', subtitleKey: 'lymph.source.kiyono1989.subtitle', url: 'https://doi.org/10.1177/028418518903000505' },
  { id: 'dorfman1991', titleKey: 'lymph.source.dorfman1991.title', subtitleKey: 'lymph.source.dorfman1991.subtitle', url: 'https://doi.org/10.1148/radiology.180.2.2068292' },
  { id: 'lucey2005', titleKey: 'lymph.source.lucey2005.title', subtitleKey: 'lymph.source.lucey2005.subtitle', url: 'https://doi.org/10.2214/ajr.184.1.01840041' },
  { id: 'arita1996', titleKey: 'lymph.source.arita1996.title', subtitleKey: 'lymph.source.arita1996.subtitle', url: 'https://doi.org/10.1378/chest.110.4.1004' },
  { id: 'schwartz2009', titleKey: 'lymph.source.schwartz2009.title', subtitleKey: 'lymph.source.schwartz2009.subtitle', url: 'https://doi.org/10.1016/j.ejca.2008.10.028' },
] as const;

export type LymphSourceId = typeof lymphSources[number]['id'];
export type LymphMeasurement = Readonly<
  | { kind: 'upperCT' | 'suspicion' | 'typicalCT' | 'upperAnatomy'; shortAxisMm: number }
  | { kind: 'qualitative' }
>;
export type LymphChain = Readonly<{
  id: string;
  region: LymphRegion;
  labelKey: string;
  measurement: LymphMeasurement;
  noteKey: string;
  sourceIds: readonly LymphSourceId[];
}>;

function chain(
  id: string,
  region: LymphRegion,
  measurement: LymphMeasurement,
  noteKey: string,
  sourceIds: readonly LymphSourceId[],
): LymphChain {
  return { id, region, labelKey: `lymph.chain.${id}`, measurement, noteKey, sourceIds };
}

// The general cervical criterion is deliberately shared, not claimed to have been
// independently validated for every modern neck level. The exception is subdigastric.
const cervical = (id: string, shortAxisMm = 10) => chain(id, 'cervical',
  { kind: 'suspicion', shortAxisMm },
  shortAxisMm === 11 ? 'lymph.note.jugulodigastric' : 'lymph.note.cervical',
  ['brekel1990', 'tang2014']);
const mediastinal = (id: string) => chain(id, 'thoracic',
  { kind: 'upperCT', shortAxisMm: 10 }, 'lymph.note.mediastinal', ['glazer1985']);
const hilar = (id: string, shortAxisMm: number) => chain(id, 'thoracic',
  { kind: 'upperAnatomy', shortAxisMm }, 'lymph.note.hilar', ['kiyono1989']);
const abdominal = (id: string, shortAxisMm: number) => chain(id, 'abdominal',
  { kind: 'upperCT', shortAxisMm }, 'lymph.note.abdominal', ['dorfman1991']);

export const lymphChains: readonly LymphChain[] = [
  cervical('submental'),
  cervical('submandibular'),
  cervical('jugulodigastric', 11),
  cervical('upperJugularOther'),
  cervical('middleJugular'),
  cervical('lowerJugular'),
  cervical('posteriorTriangle'),
  cervical('central'),
  chain('retropharyngealLateral', 'cervical', { kind: 'suspicion', shortAxisMm: 5 },
    'lymph.note.retropharyngealLateral', ['tang2014']),
  chain('retropharyngealMedial', 'cervical', { kind: 'qualitative' },
    'lymph.note.retropharyngealMedial', ['tang2014']),
  mediastinal('upperParatracheal'),
  mediastinal('lowerParatracheal'),
  mediastinal('prevascularRetrotracheal'),
  mediastinal('aortopulmonary'),
  mediastinal('thoracicParaaortic'),
  mediastinal('subcarinal'),
  mediastinal('paraesophageal'),
  mediastinal('pulmonaryLigament'),
  hilar('hilarRightAulIil', 12),
  hilar('hilarRightSilLeftAulIil', 10),
  hilar('hilarOther', 8),
  abdominal('retrocrural', 6),
  abdominal('paracardiac', 8),
  abdominal('gastrohepatic', 8),
  abdominal('portaHepatis', 7),
  abdominal('portacaval', 10),
  abdominal('upperParaaortic', 9),
  abdominal('lowerParaaortic', 11),
  chain('mesenteric', 'abdominal', { kind: 'typicalCT', shortAxisMm: 5 },
    'lymph.note.mesenteric', ['lucey2005']),
];

export function chainsForRegion(region: LymphRegion): readonly LymphChain[] {
  return lymphChains.filter((item) => item.region === region);
}

export function sourcesFor(ids: readonly LymphSourceId[]) {
  return lymphSources.filter((source) => ids.includes(source.id));
}

/** Accent-insensitive lookup works for both the Portuguese and English dictionaries. */
export function normalizeLymphSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}
