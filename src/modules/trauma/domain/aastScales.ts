import { type MessageRef, msg, type Severity } from '../../../core/domain.ts';

export type AastRegion = 'neck' | 'thorax' | 'abdomen' | 'genitourinary' | 'pelvicReproductive' | 'extremity';
export type AastGrade = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export type AastScaleGrade = Readonly<{
  grade: AastGrade;
  criteria: readonly MessageRef[];
  ais?: number;
}>;

export type AastScale = Readonly<{
  id:
    | 'cervicalVascular'
    | 'chestWall'
    | 'heart'
    | 'lung'
    | 'thoracicVascular'
    | 'diaphragm'
    | 'spleen'
    | 'liver'
    | 'biliaryTree'
    | 'pancreas'
    | 'esophagus'
    | 'stomach'
    | 'duodenum'
    | 'smallBowel'
    | 'colon'
    | 'rectum'
    | 'abdominalVascular'
    | 'adrenal'
    | 'kidney'
    | 'ureter'
    | 'bladder'
    | 'urethra'
    | 'uterusNonpregnant'
    | 'uterusPregnant'
    | 'fallopianTube'
    | 'ovary'
    | 'vagina'
    | 'vulva'
    | 'testis'
    | 'scrotum'
    | 'penis'
    | 'peripheralVascular';
  region: AastRegion;
  titleKey: string;
  versionKey: string;
  grades: readonly AastScaleGrade[];
  noteKeys: readonly string[];
}>;

function g(grade: AastGrade, key: string, ais?: number): AastScaleGrade {
  return { grade, criteria: [msg(key)], ...(ais === undefined ? {} : { ais }) };
}

const multipleToThree = 'trauma.aast.note.multipleToGradeIII';
const bilateralToThree = 'trauma.aast.note.bilateralToGradeIII';
const vesselAdjustment = 'trauma.aast.note.vesselCircumference';

export const aastRegions: readonly Readonly<{ id: AastRegion; labelKey: string }>[] = [
  { id: 'neck', labelKey: 'trauma.region.neck' },
  { id: 'thorax', labelKey: 'trauma.region.thorax' },
  { id: 'abdomen', labelKey: 'trauma.region.abdomen' },
  { id: 'genitourinary', labelKey: 'trauma.region.genitourinary' },
  { id: 'pelvicReproductive', labelKey: 'trauma.region.pelvicReproductive' },
  { id: 'extremity', labelKey: 'trauma.region.extremity' },
];

export const aastScales: readonly AastScale[] = [
  {
    id: 'cervicalVascular',
    region: 'neck',
    titleKey: 'trauma.scale.cervicalVascular.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.cervicalVascular.grade.I'),
      g('II', 'trauma.scale.cervicalVascular.grade.II'),
      g('III', 'trauma.scale.cervicalVascular.grade.III'),
      g('IV', 'trauma.scale.cervicalVascular.grade.IV'),
    ],
    noteKeys: [vesselAdjustment, 'trauma.aast.note.sourceBlankHighestGrade'],
  },
  {
    id: 'chestWall',
    region: 'thorax',
    titleKey: 'trauma.scale.chestWall.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.chestWall.grade.I'),
      g('II', 'trauma.scale.chestWall.grade.II'),
      g('III', 'trauma.scale.chestWall.grade.III'),
      g('IV', 'trauma.scale.chestWall.grade.IV'),
    ],
    noteKeys: ['trauma.scale.chestWall.note.scope', 'trauma.aast.note.sourceBlankHighestGrade'],
  },
  {
    id: 'heart',
    region: 'thorax',
    titleKey: 'trauma.scale.heart.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.heart.grade.I'),
      g('II', 'trauma.scale.heart.grade.II'),
      g('III', 'trauma.scale.heart.grade.III'),
      g('IV', 'trauma.scale.heart.grade.IV'),
      g('V', 'trauma.scale.heart.grade.V'),
    ],
    noteKeys: ['trauma.scale.heart.note.multiple'],
  },
  {
    id: 'lung',
    region: 'thorax',
    titleKey: 'trauma.scale.lung.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.lung.grade.I'),
      g('II', 'trauma.scale.lung.grade.II'),
      g('III', 'trauma.scale.lung.grade.III'),
      g('IV', 'trauma.scale.lung.grade.IV'),
      g('V', 'trauma.scale.lung.grade.V'),
      g('VI', 'trauma.scale.lung.grade.VI'),
    ],
    noteKeys: [bilateralToThree, 'trauma.scale.lung.note.hemothorax'],
  },
  {
    id: 'thoracicVascular',
    region: 'thorax',
    titleKey: 'trauma.scale.thoracicVascular.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.thoracicVascular.grade.I'),
      g('II', 'trauma.scale.thoracicVascular.grade.II'),
      g('III', 'trauma.scale.thoracicVascular.grade.III'),
      g('IV', 'trauma.scale.thoracicVascular.grade.IV'),
      g('V', 'trauma.scale.thoracicVascular.grade.V'),
      g('VI', 'trauma.scale.thoracicVascular.grade.VI'),
    ],
    noteKeys: [vesselAdjustment],
  },
  {
    id: 'diaphragm',
    region: 'thorax',
    titleKey: 'trauma.scale.diaphragm.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.diaphragm.grade.I'),
      g('II', 'trauma.scale.diaphragm.grade.II'),
      g('III', 'trauma.scale.diaphragm.grade.III'),
      g('IV', 'trauma.scale.diaphragm.grade.IV'),
      g('V', 'trauma.scale.diaphragm.grade.V'),
    ],
    noteKeys: [bilateralToThree],
  },
  {
    id: 'spleen',
    region: 'abdomen',
    titleKey: 'trauma.scale.spleen.title',
    versionKey: 'trauma.scale.version.2018',
    grades: [
      g('I', 'trauma.scale.spleen.grade.I', 2),
      g('II', 'trauma.scale.spleen.grade.II', 2),
      g('III', 'trauma.scale.spleen.grade.III', 3),
      g('IV', 'trauma.scale.spleen.grade.IV', 4),
      g('V', 'trauma.scale.spleen.grade.V', 5),
    ],
    noteKeys: ['trauma.aast.note.highestCriterion', multipleToThree, 'trauma.aast.note.vascularDefinition'],
  },
  {
    id: 'liver',
    region: 'abdomen',
    titleKey: 'trauma.scale.liver.title',
    versionKey: 'trauma.scale.version.2018',
    grades: [
      g('I', 'trauma.scale.liver.grade.I', 2),
      g('II', 'trauma.scale.liver.grade.II', 2),
      g('III', 'trauma.scale.liver.grade.III', 3),
      g('IV', 'trauma.scale.liver.grade.IV', 4),
      g('V', 'trauma.scale.liver.grade.V', 5),
    ],
    noteKeys: ['trauma.aast.note.highestCriterion', multipleToThree, 'trauma.aast.note.vascularDefinition'],
  },
  {
    id: 'biliaryTree',
    region: 'abdomen',
    titleKey: 'trauma.scale.biliaryTree.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.biliaryTree.grade.I'),
      g('II', 'trauma.scale.biliaryTree.grade.II'),
      g('III', 'trauma.scale.biliaryTree.grade.III'),
      g('IV', 'trauma.scale.biliaryTree.grade.IV'),
      g('V', 'trauma.scale.biliaryTree.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'pancreas',
    region: 'abdomen',
    titleKey: 'trauma.scale.pancreas.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.pancreas.grade.I'),
      g('II', 'trauma.scale.pancreas.grade.II'),
      g('III', 'trauma.scale.pancreas.grade.III'),
      g('IV', 'trauma.scale.pancreas.grade.IV'),
      g('V', 'trauma.scale.pancreas.grade.V'),
    ],
    noteKeys: [multipleToThree, 'trauma.scale.pancreas.note.proximal'],
  },
  {
    id: 'esophagus',
    region: 'abdomen',
    titleKey: 'trauma.scale.esophagus.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.esophagus.grade.I'),
      g('II', 'trauma.scale.esophagus.grade.II'),
      g('III', 'trauma.scale.esophagus.grade.III'),
      g('IV', 'trauma.scale.esophagus.grade.IV'),
      g('V', 'trauma.scale.esophagus.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'stomach',
    region: 'abdomen',
    titleKey: 'trauma.scale.stomach.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.stomach.grade.I'),
      g('II', 'trauma.scale.stomach.grade.II'),
      g('III', 'trauma.scale.stomach.grade.III'),
      g('IV', 'trauma.scale.stomach.grade.IV'),
      g('V', 'trauma.scale.stomach.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'duodenum',
    region: 'abdomen',
    titleKey: 'trauma.scale.duodenum.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.duodenum.grade.I'),
      g('II', 'trauma.scale.duodenum.grade.II'),
      g('III', 'trauma.scale.duodenum.grade.III'),
      g('IV', 'trauma.scale.duodenum.grade.IV'),
      g('V', 'trauma.scale.duodenum.grade.V'),
    ],
    noteKeys: [multipleToThree, 'trauma.scale.duodenum.note.segments'],
  },
  {
    id: 'smallBowel',
    region: 'abdomen',
    titleKey: 'trauma.scale.smallBowel.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.smallBowel.grade.I'),
      g('II', 'trauma.scale.smallBowel.grade.II'),
      g('III', 'trauma.scale.smallBowel.grade.III'),
      g('IV', 'trauma.scale.smallBowel.grade.IV'),
      g('V', 'trauma.scale.smallBowel.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'colon',
    region: 'abdomen',
    titleKey: 'trauma.scale.colon.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.colon.grade.I'),
      g('II', 'trauma.scale.colon.grade.II'),
      g('III', 'trauma.scale.colon.grade.III'),
      g('IV', 'trauma.scale.colon.grade.IV'),
      g('V', 'trauma.scale.colon.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'rectum',
    region: 'abdomen',
    titleKey: 'trauma.scale.rectum.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.rectum.grade.I'),
      g('II', 'trauma.scale.rectum.grade.II'),
      g('III', 'trauma.scale.rectum.grade.III'),
      g('IV', 'trauma.scale.rectum.grade.IV'),
      g('V', 'trauma.scale.rectum.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'abdominalVascular',
    region: 'abdomen',
    titleKey: 'trauma.scale.abdominalVascular.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.abdominalVascular.grade.I'),
      g('II', 'trauma.scale.abdominalVascular.grade.II'),
      g('III', 'trauma.scale.abdominalVascular.grade.III'),
      g('IV', 'trauma.scale.abdominalVascular.grade.IV'),
      g('V', 'trauma.scale.abdominalVascular.grade.V'),
    ],
    noteKeys: [vesselAdjustment, 'trauma.scale.abdominalVascular.note.extraparenchymal'],
  },
  {
    id: 'adrenal',
    region: 'abdomen',
    titleKey: 'trauma.scale.adrenal.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.adrenal.grade.I'),
      g('II', 'trauma.scale.adrenal.grade.II'),
      g('III', 'trauma.scale.adrenal.grade.III'),
      g('IV', 'trauma.scale.adrenal.grade.IV'),
      g('V', 'trauma.scale.adrenal.grade.V'),
    ],
    noteKeys: ['trauma.scale.adrenal.note.bilateral'],
  },
  {
    id: 'kidney',
    region: 'abdomen',
    titleKey: 'trauma.scale.kidney.title',
    versionKey: 'trauma.scale.version.2018',
    grades: [
      g('I', 'trauma.scale.kidney.grade.I', 2),
      g('II', 'trauma.scale.kidney.grade.II', 2),
      g('III', 'trauma.scale.kidney.grade.III', 3),
      g('IV', 'trauma.scale.kidney.grade.IV', 4),
      g('V', 'trauma.scale.kidney.grade.V', 5),
    ],
    noteKeys: ['trauma.aast.note.highestCriterion', 'trauma.scale.kidney.note.bilateral', 'trauma.aast.note.vascularDefinition'],
  },
  {
    id: 'ureter',
    region: 'genitourinary',
    titleKey: 'trauma.scale.ureter.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.ureter.grade.I'),
      g('II', 'trauma.scale.ureter.grade.II'),
      g('III', 'trauma.scale.ureter.grade.III'),
      g('IV', 'trauma.scale.ureter.grade.IV'),
      g('V', 'trauma.scale.ureter.grade.V'),
    ],
    noteKeys: [bilateralToThree],
  },
  {
    id: 'bladder',
    region: 'genitourinary',
    titleKey: 'trauma.scale.bladder.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.bladder.grade.I'),
      g('II', 'trauma.scale.bladder.grade.II'),
      g('III', 'trauma.scale.bladder.grade.III'),
      g('IV', 'trauma.scale.bladder.grade.IV'),
      g('V', 'trauma.scale.bladder.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'urethra',
    region: 'genitourinary',
    titleKey: 'trauma.scale.urethra.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.urethra.grade.I'),
      g('II', 'trauma.scale.urethra.grade.II'),
      g('III', 'trauma.scale.urethra.grade.III'),
      g('IV', 'trauma.scale.urethra.grade.IV'),
      g('V', 'trauma.scale.urethra.grade.V'),
    ],
    noteKeys: [],
  },
  {
    id: 'uterusNonpregnant',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.uterusNonpregnant.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.uterusNonpregnant.grade.I'),
      g('II', 'trauma.scale.uterusNonpregnant.grade.II'),
      g('III', 'trauma.scale.uterusNonpregnant.grade.III'),
      g('IV', 'trauma.scale.uterusNonpregnant.grade.IV'),
      g('V', 'trauma.scale.uterusNonpregnant.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'uterusPregnant',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.uterusPregnant.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.uterusPregnant.grade.I'),
      g('II', 'trauma.scale.uterusPregnant.grade.II'),
      g('III', 'trauma.scale.uterusPregnant.grade.III'),
      g('IV', 'trauma.scale.uterusPregnant.grade.IV'),
      g('V', 'trauma.scale.uterusPregnant.grade.V'),
    ],
    noteKeys: [multipleToThree, 'trauma.scale.uterusPregnant.note.sourceFormatting'],
  },
  {
    id: 'fallopianTube',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.fallopianTube.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.fallopianTube.grade.I'),
      g('II', 'trauma.scale.fallopianTube.grade.II'),
      g('III', 'trauma.scale.fallopianTube.grade.III'),
      g('IV', 'trauma.scale.fallopianTube.grade.IV'),
      g('V', 'trauma.scale.fallopianTube.grade.V'),
    ],
    noteKeys: [bilateralToThree],
  },
  {
    id: 'ovary',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.ovary.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.ovary.grade.I'),
      g('II', 'trauma.scale.ovary.grade.II'),
      g('III', 'trauma.scale.ovary.grade.III'),
      g('IV', 'trauma.scale.ovary.grade.IV'),
      g('V', 'trauma.scale.ovary.grade.V'),
    ],
    noteKeys: [bilateralToThree],
  },
  {
    id: 'vagina',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.vagina.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.vagina.grade.I'),
      g('II', 'trauma.scale.vagina.grade.II'),
      g('III', 'trauma.scale.vagina.grade.III'),
      g('IV', 'trauma.scale.vagina.grade.IV'),
      g('V', 'trauma.scale.vagina.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'vulva',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.vulva.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.vulva.grade.I'),
      g('II', 'trauma.scale.vulva.grade.II'),
      g('III', 'trauma.scale.vulva.grade.III'),
      g('IV', 'trauma.scale.vulva.grade.IV'),
      g('V', 'trauma.scale.vulva.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'testis',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.testis.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.testis.grade.I'),
      g('II', 'trauma.scale.testis.grade.II'),
      g('III', 'trauma.scale.testis.grade.III'),
      g('IV', 'trauma.scale.testis.grade.IV'),
      g('V', 'trauma.scale.testis.grade.V'),
    ],
    noteKeys: ['trauma.scale.testis.note.bilateral'],
  },
  {
    id: 'scrotum',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.scrotum.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.scrotum.grade.I'),
      g('II', 'trauma.scale.scrotum.grade.II'),
      g('III', 'trauma.scale.scrotum.grade.III'),
      g('IV', 'trauma.scale.scrotum.grade.IV'),
      g('V', 'trauma.scale.scrotum.grade.V'),
    ],
    noteKeys: [],
  },
  {
    id: 'penis',
    region: 'pelvicReproductive',
    titleKey: 'trauma.scale.penis.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.penis.grade.I'),
      g('II', 'trauma.scale.penis.grade.II'),
      g('III', 'trauma.scale.penis.grade.III'),
      g('IV', 'trauma.scale.penis.grade.IV'),
      g('V', 'trauma.scale.penis.grade.V'),
    ],
    noteKeys: [multipleToThree],
  },
  {
    id: 'peripheralVascular',
    region: 'extremity',
    titleKey: 'trauma.scale.peripheralVascular.title',
    versionKey: 'trauma.scale.version.legacy',
    grades: [
      g('I', 'trauma.scale.peripheralVascular.grade.I'),
      g('II', 'trauma.scale.peripheralVascular.grade.II'),
      g('III', 'trauma.scale.peripheralVascular.grade.III'),
      g('IV', 'trauma.scale.peripheralVascular.grade.IV'),
      g('V', 'trauma.scale.peripheralVascular.grade.V'),
    ],
    noteKeys: [vesselAdjustment],
  },
];

export function aastScalesForRegion(region: AastRegion): readonly AastScale[] {
  return aastScales.filter((scale) => scale.region === region);
}

export function aastScaleById(id: AastScale['id']): AastScale {
  const scale = aastScales.find((candidate) => candidate.id === id);
  if (!scale) throw new Error(`Unknown AAST scale: ${id}`);
  return scale;
}

export function severityForAastGrade(grade: AastGrade): Severity {
  if (grade === 'I' || grade === 'II') return 'low';
  if (grade === 'III') return 'moderate';
  if (grade === 'IV') return 'high';
  return 'critical';
}
