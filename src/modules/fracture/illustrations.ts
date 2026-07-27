import type { ImageSourcePropType } from 'react-native';
import type {
  AdultFractureRegion,
  DislocationJoint,
  PediatricSubsegment,
  UcpfJoint,
} from './domain';

/**
 * Plates extracted from the AO/OTA 2018 compendium by
 * `scripts/extract-fracture-illustrations.py`, which frames each one around the
 * artwork itself — the drawing, its callouts and its classification codes, with
 * the surrounding page text stripped. Aspect ratios come from
 * `assets/fracture/aoota-2018/plates.json`; rerun the script after changing the
 * manifest so both stay in sync.
 */
export type FractureIllustrationSource = Readonly<{
  image: ImageSourcePropType;
  /** Printed supplement page (the PDF has three unnumbered pages before S1). */
  sourcePage: number;
  /** Pixel aspect ratio (width / height) of the extracted plate. */
  aspectRatio: number;
}>;

const adultIllustrations: Readonly<Record<AdultFractureRegion['id'], FractureIllustrationSource>> = {
  humerusProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-proximal.png'),
    sourcePage: 11,
    aspectRatio: 3.203,
  },
  humerusShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-shaft.png'),
    sourcePage: 15,
    aspectRatio: 2.821,
  },
  humerusDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-distal.png'),
    sourcePage: 17,
    aspectRatio: 3.579,
  },
  radiusProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-radius-proximal.png'),
    sourcePage: 21,
    aspectRatio: 4.878,
  },
  radiusShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-radius-shaft.png'),
    sourcePage: 24,
    aspectRatio: 2.757,
  },
  radiusDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-radius-distal.png'),
    sourcePage: 28,
    aspectRatio: 4.5,
  },
  ulnaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-ulna-proximal.png'),
    sourcePage: 21,
    aspectRatio: 3.854,
  },
  ulnaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-ulna-shaft.png'),
    sourcePage: 24,
    aspectRatio: 2.683,
  },
  ulnaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-ulna-distal.png'),
    sourcePage: 28,
    aspectRatio: 4.018,
  },
  scapula: {
    image: require('../../../assets/fracture/aoota-2018/adult-scapula.png'),
    sourcePage: 101,
    aspectRatio: 2.287,
  },
  clavicle: {
    image: require('../../../assets/fracture/aoota-2018/adult-clavicle.png'),
    sourcePage: 105,
    aspectRatio: 6.593,
  },
  femurProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-proximal.png'),
    sourcePage: 33,
    aspectRatio: 3.571,
  },
  femurShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-shaft.png'),
    sourcePage: 37,
    aspectRatio: 2.143,
  },
  femurDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-distal.png'),
    sourcePage: 40,
    aspectRatio: 4.932,
  },
  patella: {
    image: require('../../../assets/fracture/aoota-2018/adult-patella.png'),
    sourcePage: 45,
    aspectRatio: 3.6,
  },
  tibiaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-proximal.png'),
    sourcePage: 49,
    aspectRatio: 4.147,
  },
  tibiaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-shaft.png'),
    sourcePage: 53,
    aspectRatio: 2.133,
  },
  tibiaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-distal.png'),
    sourcePage: 56,
    aspectRatio: 3.711,
  },
  fibulaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-proximal.png'),
    sourcePage: 61,
    aspectRatio: 2.829,
  },
  fibulaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-shaft.png'),
    sourcePage: 62,
    aspectRatio: 1.685,
  },
  fibulaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-distal.png'),
    sourcePage: 63,
    aspectRatio: 2.273,
  },
  malleolar: {
    image: require('../../../assets/fracture/aoota-2018/adult-malleolar.png'),
    sourcePage: 65,
    aspectRatio: 3.529,
  },
  pelvicRing: {
    image: require('../../../assets/fracture/aoota-2018/adult-pelvic-ring.png'),
    sourcePage: 71,
    aspectRatio: 4.369,
  },
  acetabulum: {
    image: require('../../../assets/fracture/aoota-2018/adult-acetabulum.png'),
    sourcePage: 77,
    aspectRatio: 3.22,
  },
  handCarpus: {
    image: require('../../../assets/fracture/aoota-2018/adult-hand-carpus.png'),
    sourcePage: 83,
    aspectRatio: 0.56,
  },
  foot: {
    image: require('../../../assets/fracture/aoota-2018/adult-foot.png'),
    sourcePage: 89,
    aspectRatio: 0.375,
  },
  cervicalSpine: {
    image: require('../../../assets/fracture/aoota-2018/adult-cervical-spine.png'),
    sourcePage: 146,
    aspectRatio: 2.731,
  },
  thoracolumbarSpine: {
    image: require('../../../assets/fracture/aoota-2018/adult-thoracolumbar-spine.png'),
    sourcePage: 151,
    aspectRatio: 3.516,
  },
  sacrum: {
    image: require('../../../assets/fracture/aoota-2018/adult-sacrum.png'),
    sourcePage: 155,
    aspectRatio: 1.841,
  },
  ribs: {
    image: require('../../../assets/fracture/aoota-2018/adult-ribs.png'),
    sourcePage: 161,
    aspectRatio: 3.321,
  },
  sternum: {
    image: require('../../../assets/fracture/aoota-2018/adult-sternum.png'),
    sourcePage: 163,
    aspectRatio: 0.887,
  },
};

const pediatricIllustrations: Readonly<Record<PediatricSubsegment, FractureIllustrationSource>> = {
  E: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-epiphyseal.png'),
    sourcePage: 119,
    aspectRatio: 3.173,
  },
  M: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-metaphyseal.png'),
    sourcePage: 119,
    aspectRatio: 2.848,
  },
  D: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-diaphyseal.png'),
    sourcePage: 120,
    aspectRatio: 3.622,
  },
};

const dislocationPlates = {
  110: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-110.png'),
    aspectRatio: 0.954,
  },
  111: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-111.png'),
    aspectRatio: 2.402,
  },
  112: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-112.png'),
    aspectRatio: 0.876,
  },
  113: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-113.png'),
    aspectRatio: 2.961,
  },
  114: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-114.png'),
    aspectRatio: 0.734,
  },
  115: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-115.png'),
    aspectRatio: 0.672,
  },
  116: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-116.png'),
    aspectRatio: 0.706,
  },
  117: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-117.png'),
    aspectRatio: 0.664,
  },
  118: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-118.png'),
    aspectRatio: 0.581,
  },
  119: {
    image: require('../../../assets/fracture/aoota-2018/dislocation-119.png'),
    aspectRatio: 1.158,
  },
} as const satisfies Readonly<Record<number, Omit<FractureIllustrationSource, 'sourcePage'>>>;

function dislocationPage(pdfPage: keyof typeof dislocationPlates): FractureIllustrationSource {
  return { ...dislocationPlates[pdfPage], sourcePage: pdfPage - 3 };
}

const dislocationIllustrations: Readonly<Record<DislocationJoint, FractureIllustrationSource>> = {
  '10A': dislocationPage(110),
  '10B': dislocationPage(110),
  '10C': dislocationPage(110),
  '10D': dislocationPage(110),
  '20A': dislocationPage(111),
  '20B': dislocationPage(111),
  '20C': dislocationPage(111),
  '30': dislocationPage(112),
  '40A': dislocationPage(113),
  '40B': dislocationPage(113),
  '40C': dislocationPage(113),
  '70A': dislocationPage(114),
  '70B': dislocationPage(114),
  '70C': dislocationPage(114),
  '70D': dislocationPage(115),
  '70E': dislocationPage(116),
  '80A': dislocationPage(117),
  '80B': dislocationPage(117),
  '80C': dislocationPage(117),
  '80D': dislocationPage(118),
  '80E': dislocationPage(119),
};

const periprostheticUpper: FractureIllustrationSource = {
  image: require('../../../assets/fracture/aoota-2018/periprosthetic-upper.png'),
  sourcePage: 142,
  aspectRatio: 0.964,
};

const periprostheticLower: FractureIllustrationSource = {
  image: require('../../../assets/fracture/aoota-2018/periprosthetic-lower.png'),
  sourcePage: 143,
  aspectRatio: 0.963,
};

export const openFractureIllustration: FractureIllustrationSource = {
  image: require('../../../assets/fracture/aoota-2018/open-fracture.png'),
  sourcePage: 106,
  aspectRatio: 1.057,
};

export function adultIllustration(regionId: AdultFractureRegion['id']): FractureIllustrationSource {
  return adultIllustrations[regionId];
}

export function pediatricIllustration(subsegment: PediatricSubsegment): FractureIllustrationSource {
  return pediatricIllustrations[subsegment];
}

export function dislocationIllustration(joint: DislocationJoint): FractureIllustrationSource {
  return dislocationIllustrations[joint];
}

export function periprostheticIllustration(joint: UcpfJoint): FractureIllustrationSource {
  return joint === 'I' || joint === 'II' || joint === 'III'
    ? periprostheticUpper
    : periprostheticLower;
}
