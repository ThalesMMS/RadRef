import { type ClinicalResult, msg } from '../../../core/domain.ts';

export type AdultFractureArea = 'upperLimb' | 'pelvisLowerLimb' | 'handFoot' | 'axial';
export type ShaftThird = 'none' | 'a' | 'b' | 'c';

export type AdultPatternLevel = 'type' | 'group' | 'subgroup';

export type AdultFracturePattern = Readonly<{
  code: string;
  labelKey: string;
  level: AdultPatternLevel;
  parent?: string;
}>;

export type AdultFractureRegion = Readonly<{
  id:
    | 'humerusProximal'
    | 'humerusShaft'
    | 'humerusDistal'
    | 'radiusProximal'
    | 'radiusShaft'
    | 'radiusDistal'
    | 'ulnaProximal'
    | 'ulnaShaft'
    | 'ulnaDistal'
    | 'scapula'
    | 'clavicle'
    | 'femurProximal'
    | 'femurShaft'
    | 'femurDistal'
    | 'patella'
    | 'tibiaProximal'
    | 'tibiaShaft'
    | 'tibiaDistal'
    | 'fibulaProximal'
    | 'fibulaShaft'
    | 'fibulaDistal'
    | 'malleolar'
    | 'pelvicRing'
    | 'acetabulum'
    | 'handCarpus'
    | 'foot'
    | 'cervicalSpine'
    | 'thoracolumbarSpine'
    | 'sacrum'
    | 'ribs'
    | 'sternum';
  area: AdultFractureArea;
  labelKey: string;
  baseCode: string;
  supportsThirds?: boolean;
  noteKey?: string;
  patterns: readonly AdultFracturePattern[];
}>;

export type AdultFractureInput = Readonly<{
  regionId: AdultFractureRegion['id'];
  typeCode: string;
  groupCode?: string;
  subgroupCode?: string;
  shaftThird: ShaftThird;
}>;

export type AdultFractureResult = ClinicalResult & Readonly<{
  regionId?: AdultFractureRegion['id'];
  selectedLevel?: AdultPatternLevel;
}>;

function p(
  code: string,
  labelKey: string,
  level: AdultPatternLevel,
  parent?: string,
): AdultFracturePattern {
  return { code, labelKey, level, ...(parent ? { parent } : {}) };
}

const shaftPatterns = (base: string): readonly AdultFracturePattern[] => [
  p(`${base}A`, 'fracture.adult.pattern.shaft.simple', 'type'),
  p(`${base}A1`, 'fracture.adult.pattern.shaft.spiral', 'group', `${base}A`),
  p(`${base}A2`, 'fracture.adult.pattern.shaft.oblique', 'group', `${base}A`),
  p(`${base}A3`, 'fracture.adult.pattern.shaft.transverse', 'group', `${base}A`),
  p(`${base}B`, 'fracture.adult.pattern.shaft.wedge', 'type'),
  p(`${base}B2`, 'fracture.adult.pattern.shaft.intactWedge', 'group', `${base}B`),
  p(`${base}B3`, 'fracture.adult.pattern.shaft.fragmentaryWedge', 'group', `${base}B`),
  p(`${base}C`, 'fracture.adult.pattern.shaft.multifragmentary', 'type'),
  p(`${base}C2`, 'fracture.adult.pattern.shaft.intactSegmental', 'group', `${base}C`),
  p(`${base}C3`, 'fracture.adult.pattern.shaft.fragmentarySegmental', 'group', `${base}C`),
];

export const adultFractureAreas: readonly Readonly<{
  id: AdultFractureArea;
  labelKey: string;
}>[] = [
  { id: 'upperLimb', labelKey: 'fracture.adult.area.upperLimb' },
  { id: 'pelvisLowerLimb', labelKey: 'fracture.adult.area.pelvisLowerLimb' },
  { id: 'handFoot', labelKey: 'fracture.adult.area.handFoot' },
  { id: 'axial', labelKey: 'fracture.adult.area.axial' },
];

export const adultFractureRegions: readonly AdultFractureRegion[] = [
  {
    id: 'humerusProximal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.humerusProximal',
    baseCode: '11',
    patterns: [
      p('11A', 'fracture.adult.pattern.humerusProximal.11A', 'type'),
      p('11A1', 'fracture.adult.pattern.humerusProximal.11A1', 'group', '11A'),
      p('11A1.1', 'fracture.adult.pattern.humerusProximal.11A11', 'subgroup', '11A1'),
      p('11A1.2', 'fracture.adult.pattern.humerusProximal.11A12', 'subgroup', '11A1'),
      p('11A2', 'fracture.adult.pattern.humerusProximal.11A2', 'group', '11A'),
      p('11A2.1', 'fracture.adult.pattern.humerusProximal.11A21', 'subgroup', '11A2'),
      p('11A2.2', 'fracture.adult.pattern.humerusProximal.11A22', 'subgroup', '11A2'),
      p('11A2.3', 'fracture.adult.pattern.humerusProximal.11A23', 'subgroup', '11A2'),
      p('11A3', 'fracture.adult.pattern.humerusProximal.11A3', 'group', '11A'),
      p('11B', 'fracture.adult.pattern.humerusProximal.11B', 'type'),
      p('11B1', 'fracture.adult.pattern.humerusProximal.11B1', 'group', '11B'),
      p('11B1.1', 'fracture.adult.pattern.humerusProximal.11B11', 'subgroup', '11B1'),
      p('11B1.2', 'fracture.adult.pattern.humerusProximal.11B12', 'subgroup', '11B1'),
      p('11C', 'fracture.adult.pattern.humerusProximal.11C', 'type'),
      p('11C1', 'fracture.adult.pattern.humerusProximal.11C1', 'group', '11C'),
      p('11C1.1', 'fracture.adult.pattern.humerusProximal.11C11', 'subgroup', '11C1'),
      p('11C1.3', 'fracture.adult.pattern.humerusProximal.11C13', 'subgroup', '11C1'),
      p('11C3', 'fracture.adult.pattern.humerusProximal.11C3', 'group', '11C'),
      p('11C3.1', 'fracture.adult.pattern.humerusProximal.11C31', 'subgroup', '11C3'),
      p('11C3.2', 'fracture.adult.pattern.humerusProximal.11C32', 'subgroup', '11C3'),
      p('11C3.3', 'fracture.adult.pattern.humerusProximal.11C33', 'subgroup', '11C3'),
    ],
  },
  {
    id: 'humerusShaft',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.humerusShaft',
    baseCode: '12',
    supportsThirds: true,
    patterns: shaftPatterns('12'),
  },
  {
    id: 'humerusDistal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.humerusDistal',
    baseCode: '13',
    patterns: [
      p('13A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('13A1', 'fracture.adult.pattern.humerusDistal.13A1', 'group', '13A'),
      p('13A2', 'fracture.adult.pattern.end.simple', 'group', '13A'),
      p('13A3', 'fracture.adult.pattern.end.wedgeOrMultifragmentary', 'group', '13A'),
      p('13B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('13B1', 'fracture.adult.pattern.humerusDistal.13B1', 'group', '13B'),
      p('13B2', 'fracture.adult.pattern.humerusDistal.13B2', 'group', '13B'),
      p('13B3', 'fracture.adult.pattern.humerusDistal.13B3', 'group', '13B'),
      p('13C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('13C1', 'fracture.adult.pattern.end.completeSimpleSimple', 'group', '13C'),
      p('13C2', 'fracture.adult.pattern.end.completeSimpleComplexMeta', 'group', '13C'),
      p('13C3', 'fracture.adult.pattern.end.completeMultifragmentary', 'group', '13C'),
    ],
  },
  {
    id: 'radiusProximal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.radiusProximal',
    baseCode: '2R1',
    patterns: [
      p('2R1A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('2R1A1', 'fracture.adult.pattern.radiusProximal.2R1A1', 'group', '2R1A'),
      p('2R1A2', 'fracture.adult.pattern.radiusProximal.2R1A2', 'group', '2R1A'),
      p('2R1A3', 'fracture.adult.pattern.radiusProximal.2R1A3', 'group', '2R1A'),
      p('2R1B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('2R1B1', 'fracture.adult.pattern.radiusProximal.2R1B1', 'group', '2R1B'),
      p('2R1B3', 'fracture.adult.pattern.radiusProximal.2R1B3', 'group', '2R1B'),
      p('2R1C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('2R1C1', 'fracture.adult.pattern.radiusProximal.2R1C1', 'group', '2R1C'),
      p('2R1C3', 'fracture.adult.pattern.radiusProximal.2R1C3', 'group', '2R1C'),
    ],
  },
  {
    id: 'radiusShaft',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.radiusShaft',
    baseCode: '2R2',
    supportsThirds: true,
    noteKey: 'fracture.adult.note.galeazzi',
    patterns: shaftPatterns('2R2'),
  },
  {
    id: 'radiusDistal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.radiusDistal',
    baseCode: '2R3',
    patterns: [
      p('2R3A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('2R3A1', 'fracture.adult.pattern.radiusDistal.2R3A1', 'group', '2R3A'),
      p('2R3A2', 'fracture.adult.pattern.end.simple', 'group', '2R3A'),
      p('2R3A2.1', 'fracture.adult.pattern.radiusDistal.2R3A21', 'subgroup', '2R3A2'),
      p('2R3A2.2', 'fracture.adult.pattern.radiusDistal.2R3A22', 'subgroup', '2R3A2'),
      p('2R3A2.3', 'fracture.adult.pattern.radiusDistal.2R3A23', 'subgroup', '2R3A2'),
      p('2R3A3', 'fracture.adult.pattern.end.wedgeOrMultifragmentary', 'group', '2R3A'),
      p('2R3B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('2R3B1', 'fracture.adult.pattern.radiusDistal.2R3B1', 'group', '2R3B'),
      p('2R3B2', 'fracture.adult.pattern.radiusDistal.2R3B2', 'group', '2R3B'),
      p('2R3B3', 'fracture.adult.pattern.radiusDistal.2R3B3', 'group', '2R3B'),
      p('2R3C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('2R3C1', 'fracture.adult.pattern.radiusDistal.2R3C1', 'group', '2R3C'),
      p('2R3C2', 'fracture.adult.pattern.radiusDistal.2R3C2', 'group', '2R3C'),
      p('2R3C3', 'fracture.adult.pattern.radiusDistal.2R3C3', 'group', '2R3C'),
    ],
  },
  {
    id: 'ulnaProximal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.ulnaProximal',
    baseCode: '2U1',
    patterns: [
      p('2U1A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('2U1A1', 'fracture.adult.pattern.ulnaProximal.2U1A1', 'group', '2U1A'),
      p('2U1A2', 'fracture.adult.pattern.ulnaProximal.2U1A2', 'group', '2U1A'),
      p('2U1A3', 'fracture.adult.pattern.ulnaProximal.2U1A3', 'group', '2U1A'),
      p('2U1B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('2U1B1', 'fracture.adult.pattern.ulnaProximal.2U1B1', 'group', '2U1B'),
      p('2U1B2', 'fracture.adult.pattern.ulnaProximal.2U1B2', 'group', '2U1B'),
      p('2U1C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('2U1C3', 'fracture.adult.pattern.ulnaProximal.2U1C3', 'group', '2U1C'),
    ],
  },
  {
    id: 'ulnaShaft',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.ulnaShaft',
    baseCode: '2U2',
    supportsThirds: true,
    noteKey: 'fracture.adult.note.monteggia',
    patterns: shaftPatterns('2U2'),
  },
  {
    id: 'ulnaDistal',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.ulnaDistal',
    baseCode: '2U3',
    patterns: [
      p('2U3A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('2U3A1', 'fracture.adult.pattern.ulnaDistal.2U3A1', 'group', '2U3A'),
      p('2U3A2', 'fracture.adult.pattern.end.simple', 'group', '2U3A'),
      p('2U3A3', 'fracture.adult.pattern.shaft.multifragmentary', 'group', '2U3A'),
      p('2U3B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('2U3C', 'fracture.adult.pattern.end.completeArticular', 'type'),
    ],
  },
  {
    id: 'scapula',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.scapula',
    baseCode: '14',
    patterns: [
      p('14A', 'fracture.adult.pattern.scapula.14A', 'type'),
      p('14A1', 'fracture.adult.pattern.scapula.14A1', 'group', '14A'),
      p('14A2', 'fracture.adult.pattern.scapula.14A2', 'group', '14A'),
      p('14A3', 'fracture.adult.pattern.scapula.14A3', 'group', '14A'),
      p('14B', 'fracture.adult.pattern.scapula.14B', 'type'),
      p('14B1', 'fracture.adult.pattern.scapula.14B1', 'group', '14B'),
      p('14B2', 'fracture.adult.pattern.scapula.14B2', 'group', '14B'),
      p('14F', 'fracture.adult.pattern.scapula.14F', 'type'),
      p('14F0', 'fracture.adult.pattern.scapula.14F0', 'group', '14F'),
      p('14F1', 'fracture.adult.pattern.scapula.14F1', 'group', '14F'),
      p('14F2', 'fracture.adult.pattern.scapula.14F2', 'group', '14F'),
    ],
  },
  {
    id: 'clavicle',
    area: 'upperLimb',
    labelKey: 'fracture.adult.region.clavicle',
    baseCode: '15',
    patterns: [
      p('15.1A', 'fracture.adult.pattern.clavicle.medialExtra', 'type'),
      p('15.1B', 'fracture.adult.pattern.clavicle.medialPartial', 'type'),
      p('15.1C', 'fracture.adult.pattern.clavicle.medialComplete', 'type'),
      p('15.2A', 'fracture.adult.pattern.clavicle.shaftSimple', 'type'),
      p('15.2B', 'fracture.adult.pattern.clavicle.shaftWedge', 'type'),
      p('15.2C', 'fracture.adult.pattern.clavicle.shaftMulti', 'type'),
      p('15.3A', 'fracture.adult.pattern.clavicle.lateralExtra', 'type'),
      p('15.3B', 'fracture.adult.pattern.clavicle.lateralPartial', 'type'),
      p('15.3C', 'fracture.adult.pattern.clavicle.lateralComplete', 'type'),
    ],
  },
  {
    id: 'femurProximal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.femurProximal',
    baseCode: '31',
    patterns: [
      p('31A', 'fracture.adult.pattern.femurProximal.31A', 'type'),
      p('31A1', 'fracture.adult.pattern.femurProximal.31A1', 'group', '31A'),
      p('31A2', 'fracture.adult.pattern.femurProximal.31A2', 'group', '31A'),
      p('31A3', 'fracture.adult.pattern.femurProximal.31A3', 'group', '31A'),
      p('31B', 'fracture.adult.pattern.femurProximal.31B', 'type'),
      p('31B1', 'fracture.adult.pattern.femurProximal.31B1', 'group', '31B'),
      p('31B2', 'fracture.adult.pattern.femurProximal.31B2', 'group', '31B'),
      p('31B3', 'fracture.adult.pattern.femurProximal.31B3', 'group', '31B'),
      p('31C', 'fracture.adult.pattern.femurProximal.31C', 'type'),
      p('31C1', 'fracture.adult.pattern.femurProximal.31C1', 'group', '31C'),
      p('31C2', 'fracture.adult.pattern.femurProximal.31C2', 'group', '31C'),
    ],
  },
  {
    id: 'femurShaft',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.femurShaft',
    baseCode: '32',
    supportsThirds: true,
    patterns: shaftPatterns('32'),
  },
  {
    id: 'femurDistal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.femurDistal',
    baseCode: '33',
    patterns: [
      p('33A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('33A1', 'fracture.adult.pattern.femurDistal.33A1', 'group', '33A'),
      p('33A2', 'fracture.adult.pattern.end.simple', 'group', '33A'),
      p('33A3', 'fracture.adult.pattern.end.wedgeOrMultifragmentary', 'group', '33A'),
      p('33B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('33B1', 'fracture.adult.pattern.femurDistal.33B1', 'group', '33B'),
      p('33B2', 'fracture.adult.pattern.femurDistal.33B2', 'group', '33B'),
      p('33B3', 'fracture.adult.pattern.femurDistal.33B3', 'group', '33B'),
      p('33C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('33C1', 'fracture.adult.pattern.end.completeSimpleSimple', 'group', '33C'),
      p('33C2', 'fracture.adult.pattern.end.completeSimpleComplexMeta', 'group', '33C'),
      p('33C3', 'fracture.adult.pattern.end.completeMultifragmentary', 'group', '33C'),
    ],
  },
  {
    id: 'patella',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.patella',
    baseCode: '34',
    patterns: [
      p('34A', 'fracture.adult.pattern.patella.34A', 'type'),
      p('34A1', 'fracture.adult.pattern.patella.34A1', 'group', '34A'),
      p('34B', 'fracture.adult.pattern.patella.34B', 'type'),
      p('34B1', 'fracture.adult.pattern.patella.34B1', 'group', '34B'),
      p('34B2', 'fracture.adult.pattern.patella.34B2', 'group', '34B'),
      p('34C', 'fracture.adult.pattern.patella.34C', 'type'),
      p('34C1', 'fracture.adult.pattern.patella.34C1', 'group', '34C'),
      p('34C2', 'fracture.adult.pattern.patella.34C2', 'group', '34C'),
      p('34C3', 'fracture.adult.pattern.patella.34C3', 'group', '34C'),
    ],
  },
  {
    id: 'tibiaProximal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.tibiaProximal',
    baseCode: '41',
    patterns: [
      p('41A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('41A1', 'fracture.adult.pattern.tibiaProximal.41A1', 'group', '41A'),
      p('41A2', 'fracture.adult.pattern.end.simple', 'group', '41A'),
      p('41A3', 'fracture.adult.pattern.end.wedgeOrMultifragmentary', 'group', '41A'),
      p('41B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('41B1', 'fracture.adult.pattern.tibiaProximal.41B1', 'group', '41B'),
      p('41B2', 'fracture.adult.pattern.tibiaProximal.41B2', 'group', '41B'),
      p('41B3', 'fracture.adult.pattern.tibiaProximal.41B3', 'group', '41B'),
      p('41C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('41C1', 'fracture.adult.pattern.end.completeSimpleSimple', 'group', '41C'),
      p('41C2', 'fracture.adult.pattern.end.completeSimpleComplexMeta', 'group', '41C'),
      p('41C3', 'fracture.adult.pattern.tibiaProximal.41C3', 'group', '41C'),
    ],
  },
  {
    id: 'tibiaShaft',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.tibiaShaft',
    baseCode: '42',
    supportsThirds: true,
    patterns: shaftPatterns('42'),
  },
  {
    id: 'tibiaDistal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.tibiaDistal',
    baseCode: '43',
    patterns: [
      p('43A', 'fracture.adult.pattern.end.extraarticular', 'type'),
      p('43A1', 'fracture.adult.pattern.end.simple', 'group', '43A'),
      p('43A2', 'fracture.adult.pattern.tibiaDistal.43A2', 'group', '43A'),
      p('43A3', 'fracture.adult.pattern.tibiaDistal.43A3', 'group', '43A'),
      p('43B', 'fracture.adult.pattern.end.partialArticular', 'type'),
      p('43B1', 'fracture.adult.pattern.tibiaDistal.43B1', 'group', '43B'),
      p('43B2', 'fracture.adult.pattern.tibiaDistal.43B2', 'group', '43B'),
      p('43B3', 'fracture.adult.pattern.tibiaDistal.43B3', 'group', '43B'),
      p('43C', 'fracture.adult.pattern.end.completeArticular', 'type'),
      p('43C1', 'fracture.adult.pattern.end.completeSimpleSimple', 'group', '43C'),
      p('43C2', 'fracture.adult.pattern.end.completeSimpleComplexMeta', 'group', '43C'),
      p('43C3', 'fracture.adult.pattern.end.completeMultifragmentary', 'group', '43C'),
    ],
  },
  {
    id: 'fibulaProximal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.fibulaProximal',
    baseCode: '4F1',
    patterns: [
      p('4F1A', 'fracture.adult.pattern.fibula.simple', 'type'),
      p('4F1B', 'fracture.adult.pattern.fibula.multifragmentary', 'type'),
    ],
  },
  {
    id: 'fibulaShaft',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.fibulaShaft',
    baseCode: '4F2',
    supportsThirds: true,
    patterns: [
      p('4F2A', 'fracture.adult.pattern.fibula.simple', 'type'),
      p('4F2B', 'fracture.adult.pattern.fibula.wedgeOrMultifragmentary', 'type'),
    ],
  },
  {
    id: 'fibulaDistal',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.fibulaDistal',
    baseCode: '4F3',
    noteKey: 'fracture.adult.note.fibulaVsMalleolar',
    patterns: [
      p('4F3A', 'fracture.adult.pattern.fibula.simple', 'type'),
      p('4F3B', 'fracture.adult.pattern.fibula.wedgeOrMultifragmentary', 'type'),
    ],
  },
  {
    id: 'malleolar',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.malleolar',
    baseCode: '44',
    patterns: [
      p('44A', 'fracture.adult.pattern.malleolar.44A', 'type'),
      p('44A1', 'fracture.adult.pattern.malleolar.44A1', 'group', '44A'),
      p('44A2', 'fracture.adult.pattern.malleolar.44A2', 'group', '44A'),
      p('44A3', 'fracture.adult.pattern.malleolar.44A3', 'group', '44A'),
      p('44B', 'fracture.adult.pattern.malleolar.44B', 'type'),
      p('44B1', 'fracture.adult.pattern.malleolar.44B1', 'group', '44B'),
      p('44B2', 'fracture.adult.pattern.malleolar.44B2', 'group', '44B'),
      p('44B3', 'fracture.adult.pattern.malleolar.44B3', 'group', '44B'),
      p('44C', 'fracture.adult.pattern.malleolar.44C', 'type'),
      p('44C1', 'fracture.adult.pattern.malleolar.44C1', 'group', '44C'),
      p('44C2', 'fracture.adult.pattern.malleolar.44C2', 'group', '44C'),
      p('44C3', 'fracture.adult.pattern.malleolar.44C3', 'group', '44C'),
    ],
  },
  {
    id: 'pelvicRing',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.pelvicRing',
    baseCode: '61',
    patterns: [
      p('61A', 'fracture.adult.pattern.pelvicRing.61A', 'type'),
      p('61A1', 'fracture.adult.pattern.pelvicRing.61A1', 'group', '61A'),
      p('61A2', 'fracture.adult.pattern.pelvicRing.61A2', 'group', '61A'),
      p('61A3', 'fracture.adult.pattern.pelvicRing.61A3', 'group', '61A'),
      p('61B', 'fracture.adult.pattern.pelvicRing.61B', 'type'),
      p('61B1', 'fracture.adult.pattern.pelvicRing.61B1', 'group', '61B'),
      p('61B2', 'fracture.adult.pattern.pelvicRing.61B2', 'group', '61B'),
      p('61B3', 'fracture.adult.pattern.pelvicRing.61B3', 'group', '61B'),
      p('61C', 'fracture.adult.pattern.pelvicRing.61C', 'type'),
      p('61C1', 'fracture.adult.pattern.pelvicRing.61C1', 'group', '61C'),
      p('61C2', 'fracture.adult.pattern.pelvicRing.61C2', 'group', '61C'),
      p('61C3', 'fracture.adult.pattern.pelvicRing.61C3', 'group', '61C'),
    ],
  },
  {
    id: 'acetabulum',
    area: 'pelvisLowerLimb',
    labelKey: 'fracture.adult.region.acetabulum',
    baseCode: '62',
    patterns: [
      p('62A', 'fracture.adult.pattern.acetabulum.62A', 'type'),
      p('62A1', 'fracture.adult.pattern.acetabulum.62A1', 'group', '62A'),
      p('62A2', 'fracture.adult.pattern.acetabulum.62A2', 'group', '62A'),
      p('62A3', 'fracture.adult.pattern.acetabulum.62A3', 'group', '62A'),
      p('62B', 'fracture.adult.pattern.acetabulum.62B', 'type'),
      p('62B1', 'fracture.adult.pattern.acetabulum.62B1', 'group', '62B'),
      p('62B2', 'fracture.adult.pattern.acetabulum.62B2', 'group', '62B'),
      p('62B3', 'fracture.adult.pattern.acetabulum.62B3', 'group', '62B'),
      p('62C', 'fracture.adult.pattern.acetabulum.62C', 'type'),
      p('62C1', 'fracture.adult.pattern.acetabulum.62C1', 'group', '62C'),
      p('62C2', 'fracture.adult.pattern.acetabulum.62C2', 'group', '62C'),
      p('62C3', 'fracture.adult.pattern.acetabulum.62C3', 'group', '62C'),
    ],
  },
  {
    id: 'handCarpus',
    area: 'handFoot',
    labelKey: 'fracture.adult.region.handCarpus',
    baseCode: '7',
    noteKey: 'fracture.adult.note.handIdentifiers',
    patterns: [
      p('71A/B/C', 'fracture.adult.pattern.hand.lunate', 'type'),
      p('72A/B/C', 'fracture.adult.pattern.hand.scaphoid', 'type'),
      p('73A/B/C', 'fracture.adult.pattern.hand.capitate', 'type'),
      p('74A/B/C', 'fracture.adult.pattern.hand.hamate', 'type'),
      p('75A/B/C', 'fracture.adult.pattern.hand.trapezium', 'type'),
      p('76.__.A/B/C', 'fracture.adult.pattern.hand.otherCarpal', 'type'),
      p('77.__.1A/B/C', 'fracture.adult.pattern.hand.metacarpalProximal', 'type'),
      p('77.__.2A/B/C', 'fracture.adult.pattern.hand.metacarpalShaft', 'type'),
      p('77.__.3A/B/C', 'fracture.adult.pattern.hand.metacarpalDistal', 'type'),
      p('78.__.__.__A/B/C', 'fracture.adult.pattern.hand.phalanx', 'type'),
      p('79', 'fracture.adult.pattern.hand.crush', 'type'),
    ],
  },
  {
    id: 'foot',
    area: 'handFoot',
    labelKey: 'fracture.adult.region.foot',
    baseCode: '8',
    noteKey: 'fracture.adult.note.footIdentifiers',
    patterns: [
      p('81.1.A/B/C', 'fracture.adult.pattern.foot.talusBody', 'type'),
      p('81.2.A-D', 'fracture.adult.pattern.foot.talusNeck', 'type'),
      p('81.3.A/B/C', 'fracture.adult.pattern.foot.talusHead', 'type'),
      p('82A', 'fracture.adult.pattern.foot.calcaneusExtra', 'type'),
      p('82B', 'fracture.adult.pattern.foot.calcaneusTongue', 'type'),
      p('82C', 'fracture.adult.pattern.foot.calcaneusArticular', 'type'),
      p('83A/B/C', 'fracture.adult.pattern.foot.navicular', 'type'),
      p('84A/B/C', 'fracture.adult.pattern.foot.cuboid', 'type'),
      p('85.__.A/B/C', 'fracture.adult.pattern.foot.cuneiform', 'type'),
      p('87.__.__A/B/C', 'fracture.adult.pattern.foot.metatarsal', 'type'),
      p('88.__.__.__A/B/C', 'fracture.adult.pattern.foot.phalanx', 'type'),
      p('89A/B/C', 'fracture.adult.pattern.foot.crush', 'type'),
    ],
  },
  {
    id: 'cervicalSpine',
    area: 'axial',
    labelKey: 'fracture.adult.region.cervicalSpine',
    baseCode: '51',
    noteKey: 'fracture.adult.note.spineVertebralIdentifier',
    patterns: [
      p('51.__.X', 'fracture.adult.pattern.spine.upperCervicalGeneric', 'type'),
      p('51.__.A', 'fracture.adult.pattern.spine.compression', 'type'),
      p('51.__.A0', 'fracture.adult.pattern.spine.A0', 'group', '51.__.A'),
      p('51.__.A1', 'fracture.adult.pattern.spine.A1', 'group', '51.__.A'),
      p('51.__.A2', 'fracture.adult.pattern.spine.A2', 'group', '51.__.A'),
      p('51.__.A3', 'fracture.adult.pattern.spine.A3', 'group', '51.__.A'),
      p('51.__.A4', 'fracture.adult.pattern.spine.A4', 'group', '51.__.A'),
      p('51.__.B', 'fracture.adult.pattern.spine.tensionBand', 'type'),
      p('51.__.B1', 'fracture.adult.pattern.spine.B1', 'group', '51.__.B'),
      p('51.__.B2', 'fracture.adult.pattern.spine.B2', 'group', '51.__.B'),
      p('51.__.B3', 'fracture.adult.pattern.spine.B3', 'group', '51.__.B'),
      p('51.__.C', 'fracture.adult.pattern.spine.translation', 'type'),
    ],
  },
  {
    id: 'thoracolumbarSpine',
    area: 'axial',
    labelKey: 'fracture.adult.region.thoracolumbarSpine',
    baseCode: '52/53',
    noteKey: 'fracture.adult.note.spineVertebralIdentifier',
    patterns: [
      p('52/53.__.A', 'fracture.adult.pattern.spine.compression', 'type'),
      p('52/53.__.A0', 'fracture.adult.pattern.spine.A0', 'group', '52/53.__.A'),
      p('52/53.__.A1', 'fracture.adult.pattern.spine.A1', 'group', '52/53.__.A'),
      p('52/53.__.A2', 'fracture.adult.pattern.spine.A2', 'group', '52/53.__.A'),
      p('52/53.__.A3', 'fracture.adult.pattern.spine.A3', 'group', '52/53.__.A'),
      p('52/53.__.A4', 'fracture.adult.pattern.spine.A4', 'group', '52/53.__.A'),
      p('52/53.__.B', 'fracture.adult.pattern.spine.tensionBand', 'type'),
      p('52/53.__.B1', 'fracture.adult.pattern.spine.B1', 'group', '52/53.__.B'),
      p('52/53.__.B2', 'fracture.adult.pattern.spine.B2', 'group', '52/53.__.B'),
      p('52/53.__.B3', 'fracture.adult.pattern.spine.B3', 'group', '52/53.__.B'),
      p('52/53.__.C', 'fracture.adult.pattern.spine.translation', 'type'),
    ],
  },
  {
    id: 'sacrum',
    area: 'axial',
    labelKey: 'fracture.adult.region.sacrum',
    baseCode: '54',
    patterns: [
      p('54A', 'fracture.adult.pattern.sacrum.54A', 'type'),
      p('54A1', 'fracture.adult.pattern.sacrum.54A1', 'group', '54A'),
      p('54A2', 'fracture.adult.pattern.sacrum.54A2', 'group', '54A'),
      p('54A3', 'fracture.adult.pattern.sacrum.54A3', 'group', '54A'),
      p('54B', 'fracture.adult.pattern.sacrum.54B', 'type'),
      p('54B1', 'fracture.adult.pattern.sacrum.54B1', 'group', '54B'),
      p('54B2', 'fracture.adult.pattern.sacrum.54B2', 'group', '54B'),
      p('54B3', 'fracture.adult.pattern.sacrum.54B3', 'group', '54B'),
      p('54C', 'fracture.adult.pattern.sacrum.54C', 'type'),
      p('54C0', 'fracture.adult.pattern.sacrum.54C0', 'group', '54C'),
      p('54C1', 'fracture.adult.pattern.sacrum.54C1', 'group', '54C'),
      p('54C2', 'fracture.adult.pattern.sacrum.54C2', 'group', '54C'),
      p('54C3', 'fracture.adult.pattern.sacrum.54C3', 'group', '54C'),
    ],
  },
  {
    id: 'ribs',
    area: 'axial',
    labelKey: 'fracture.adult.region.ribs',
    baseCode: '16._._._',
    noteKey: 'fracture.adult.note.ribIdentifiers',
    patterns: [
      p('16._._.1A', 'fracture.adult.pattern.rib.posteriorExtra', 'type'),
      p('16._._.1B', 'fracture.adult.pattern.rib.posteriorPartial', 'type'),
      p('16._._.1C', 'fracture.adult.pattern.rib.posteriorComplete', 'type'),
      p('16._._.2A', 'fracture.adult.pattern.rib.shaftSimple', 'type'),
      p('16._._.2B', 'fracture.adult.pattern.rib.shaftWedge', 'type'),
      p('16._._.2C', 'fracture.adult.pattern.rib.shaftSegmental', 'type'),
      p('16._._.3A', 'fracture.adult.pattern.rib.anteriorSimple', 'type'),
      p('16._._.3B', 'fracture.adult.pattern.rib.anteriorWedge', 'type'),
      p('16._._.3C', 'fracture.adult.pattern.rib.anteriorMulti', 'type'),
    ],
  },
  {
    id: 'sternum',
    area: 'axial',
    labelKey: 'fracture.adult.region.sternum',
    baseCode: '16.3',
    patterns: [
      p('16.3.1.A', 'fracture.adult.pattern.sternum.manubriumTransverse', 'type'),
      p('16.3.1.B', 'fracture.adult.pattern.sternum.manubriumOblique', 'type'),
      p('16.3.1.C', 'fracture.adult.pattern.sternum.manubriumMulti', 'type'),
      p('16.3.2.A', 'fracture.adult.pattern.sternum.bodyTransverse', 'type'),
      p('16.3.2.B', 'fracture.adult.pattern.sternum.bodyOblique', 'type'),
      p('16.3.2.C', 'fracture.adult.pattern.sternum.bodyMulti', 'type'),
      p('16.3.3.A', 'fracture.adult.pattern.sternum.xiphoidTransverse', 'type'),
      p('16.3.3.B', 'fracture.adult.pattern.sternum.xiphoidOblique', 'type'),
      p('16.3.3.C', 'fracture.adult.pattern.sternum.xiphoidMulti', 'type'),
    ],
  },
];

export function regionsForAdultArea(area: AdultFractureArea): readonly AdultFractureRegion[] {
  return adultFractureRegions.filter((region) => region.area === area);
}

export function adultRegionById(id: AdultFractureRegion['id']): AdultFractureRegion {
  const region = adultFractureRegions.find((candidate) => candidate.id === id);
  if (!region) throw new Error(`Unknown adult fracture region: ${id}`);
  return region;
}

export function adultPatternsAtLevel(
  region: AdultFractureRegion,
  level: AdultPatternLevel,
  parent?: string,
): readonly AdultFracturePattern[] {
  return region.patterns.filter((pattern) => pattern.level === level && pattern.parent === parent);
}

function incomplete(key: string): AdultFractureResult {
  return {
    code: '—',
    title: msg('result.incomplete'),
    recommendation: msg(key),
    notes: [msg('fracture.adult.note.completeInformation')],
    severity: 'neutral',
  };
}

export function classifyAdultFracture(input: AdultFractureInput): AdultFractureResult {
  const region = adultRegionById(input.regionId);
  const type = region.patterns.find((pattern) => pattern.code === input.typeCode && pattern.level === 'type');
  if (!type) return incomplete('fracture.adult.validation.type');

  let selected = type;
  if (input.groupCode) {
    const group = region.patterns.find(
      (pattern) => pattern.code === input.groupCode && pattern.level === 'group' && pattern.parent === type.code,
    );
    if (!group) return incomplete('fracture.adult.validation.group');
    selected = group;
  }
  if (input.subgroupCode) {
    const subgroup = region.patterns.find(
      (pattern) => pattern.code === input.subgroupCode
        && pattern.level === 'subgroup'
        && pattern.parent === selected.code,
    );
    if (!subgroup) return incomplete('fracture.adult.validation.subgroup');
    selected = subgroup;
  }

  const qualification = region.supportsThirds && input.shaftThird !== 'none'
    ? `(${input.shaftThird})`
    : '';
  const code = `${selected.code}${qualification}`;
  const typeLetter = selected.code.match(/[ABCX](?!.*[ABCX])/)?.[0] ?? 'A';
  const severity: ClinicalResult['severity'] = typeLetter === 'C'
    ? 'high'
    : typeLetter === 'B'
      ? 'moderate'
      : 'low';

  return {
    code,
    regionId: region.id,
    selectedLevel: selected.level,
    title: msg('fracture.adult.result.title'),
    recommendation: msg(selected.labelKey),
    notes: [
      msg('fracture.adult.result.code', { code }),
      msg(region.labelKey),
      ...(region.noteKey ? [msg(region.noteKey)] : []),
      msg('fracture.adult.note.qualificationsAndModifiers'),
      msg('fracture.adult.note.coverage'),
    ],
    severity,
  };
}
