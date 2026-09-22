import {
  examKey, measurementKey, ultrasoundExams, ultrasoundMeasurements, ultrasoundReviewedOn,
  type LocalizedText, type MeasurementField, type UltrasoundLanguage,
} from './catalog.ts';

const messages: Readonly<Record<string, LocalizedText>> = {
  'module.ultrasound.title': { en: 'Ultrasound measurements', pt: 'Medidas de ultrassonografia' },
  'module.ultrasound.shortLabel': { en: 'Ultrasound', pt: 'Ultrassonografia' },
  'module.ultrasound.description': { en: 'Reference measurements by examination, with technique, population and source.', pt: 'Medidas de referência por exame, com técnica, população e fonte.' },
  'module.ultrasound.guidelines': { en: 'Exam-specific references · offline consultation', pt: 'Referências por exame · consulta offline' },
  'ultrasound.scope.title': { en: 'Reference, not an automatic diagnosis', pt: 'Referência, não diagnóstico automático' },
  'ultrasound.scope.text': { en: 'Initial selection of common measurements, not an exhaustive atlas. Usual values, diagnostic criteria, means and formulas are explicitly separated. Check population, acquisition and the original source. Independent clinical review is required before clinical deployment.', pt: 'Seleção inicial de medidas frequentes, não um atlas exaustivo. Valores usuais, critérios diagnósticos, médias e fórmulas estão separados. Conferir população, aquisição e fonte original. É necessária revisão clínica independente antes do uso assistencial.' },
  'ultrasound.exams': { en: 'Examination types', pt: 'Tipos de exame' },
  'ultrasound.search': { en: 'Search measurements, organs or techniques', pt: 'Buscar medidas, órgãos ou técnicas' },
  'ultrasound.clear': { en: 'Clear search', pt: 'Limpar busca' },
  'ultrasound.results': { en: '{{count}} measurement(s)', pt: '{{count}} medida(s)' },
  'ultrasound.empty': { en: 'No measurements match this search. Try an organ or another term.', pt: 'Nenhuma medida corresponde à busca. Tente um órgão ou outro termo.' },
  'ultrasound.population': { en: 'Population / setting', pt: 'População / contexto' },
  'ultrasound.method': { en: 'How to measure', pt: 'Como medir' },
  'ultrasound.caution': { en: 'Interpretation limits', pt: 'Limites de interpretação' },
  'ultrasound.sources': { en: 'Sources', pt: 'Fontes' },
  'ultrasound.references.title': { en: 'Ultrasound references', pt: 'Referências de ultrassonografia' },
  'ultrasound.references.description': { en: 'Publications, versions and source links for the measurements.', pt: 'Publicações, versões e links das fontes das medidas.' },
  'ultrasound.references.note': { en: `Sources consulted on ${ultrasoundReviewedOn}. Content is stored locally; opening a publication requires a connection. Source consultation is not independent clinical validation.`, pt: `Fontes consultadas em ${ultrasoundReviewedOn}. Conteúdo armazenado localmente; abrir uma publicação requer conexão. Consulta às fontes não equivale a validação clínica independente.` },
  'ultrasound.linkError': { en: 'The source could not be opened. Check the connection and try again.', pt: 'Não foi possível abrir a fonte. Verifique a conexão e tente novamente.' },
  'ultrasound.kind.reference': { en: 'Source-specific reference', pt: 'Referência da fonte' },
  'ultrasound.kind.criterion': { en: 'Diagnostic / morphologic criterion', pt: 'Critério diagnóstico / morfológico' },
  'ultrasound.kind.mean': { en: 'Population mean, not a cutoff', pt: 'Média populacional, não corte' },
  'ultrasound.kind.formula': { en: 'Formula / measurement convention', pt: 'Fórmula / convenção de medida' },
  'ultrasound.kind.context': { en: 'Context-dependent interpretation', pt: 'Interpretação dependente do contexto' },
};
export const ultrasoundMeasurementFields: readonly MeasurementField[] = ['name', 'value', 'population', 'method', 'caution'];

function dictionary(language: UltrasoundLanguage): Readonly<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(messages)) result[key] = value[language];
  for (const exam of ultrasoundExams) {
    result[examKey(exam.id, 'title')] = exam.title[language];
    result[examKey(exam.id, 'description')] = exam.description[language];
  }
  for (const item of ultrasoundMeasurements) {
    for (const field of ultrasoundMeasurementFields) result[measurementKey(item.id, field)] = item[field][language];
  }
  return Object.freeze(result);
}
export const ultrasoundEn = dictionary('en');
export const ultrasoundPt = dictionary('pt');
