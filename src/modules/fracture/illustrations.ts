import type { ImageSourcePropType } from 'react-native';
import type {
  AdultFractureRegion,
  DislocationJoint,
  PediatricSubsegment,
  UcpfJoint,
} from './domain';

export type FractureIllustrationSource = Readonly<{
  image: ImageSourcePropType;
  /** Printed supplement page (the PDF has three unnumbered pages before S1). */
  sourcePage: number;
  /** Pixel aspect ratio of the extracted plate. Most adult type plates use 1104 × 500. */
  aspectRatio?: number;
}>;

const adultIllustrations: Readonly<Record<AdultFractureRegion['id'], FractureIllustrationSource>> = {
  humerusProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-proximal.jpg'),
    sourcePage: 11,
  },
  humerusShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-shaft.jpg'),
    sourcePage: 15,
  },
  humerusDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-humerus-distal.jpg'),
    sourcePage: 17,
  },
  radiusProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-proximal.jpg'),
    sourcePage: 21,
  },
  radiusShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-shaft.jpg'),
    sourcePage: 24,
  },
  radiusDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-distal.jpg'),
    sourcePage: 28,
  },
  ulnaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-proximal.jpg'),
    sourcePage: 21,
  },
  ulnaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-shaft.jpg'),
    sourcePage: 24,
  },
  ulnaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-forearm-distal.jpg'),
    sourcePage: 28,
  },
  scapula: {
    image: require('../../../assets/fracture/aoota-2018/adult-scapula.jpg'),
    sourcePage: 101,
  },
  clavicle: {
    image: require('../../../assets/fracture/aoota-2018/adult-clavicle.jpg'),
    sourcePage: 105,
  },
  femurProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-proximal.jpg'),
    sourcePage: 33,
  },
  femurShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-shaft.jpg'),
    sourcePage: 37,
  },
  femurDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-femur-distal.jpg'),
    sourcePage: 40,
  },
  patella: {
    image: require('../../../assets/fracture/aoota-2018/adult-patella.jpg'),
    sourcePage: 45,
  },
  tibiaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-proximal.jpg'),
    sourcePage: 49,
  },
  tibiaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-shaft.jpg'),
    sourcePage: 53,
  },
  tibiaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-tibia-distal.jpg'),
    sourcePage: 56,
  },
  fibulaProximal: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-proximal.jpg'),
    sourcePage: 61,
  },
  fibulaShaft: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-shaft.jpg'),
    sourcePage: 62,
  },
  fibulaDistal: {
    image: require('../../../assets/fracture/aoota-2018/adult-fibula-distal.jpg'),
    sourcePage: 63,
  },
  malleolar: {
    image: require('../../../assets/fracture/aoota-2018/adult-malleolar.jpg'),
    sourcePage: 65,
  },
  pelvicRing: {
    image: require('../../../assets/fracture/aoota-2018/adult-pelvic-ring.jpg'),
    sourcePage: 71,
  },
  acetabulum: {
    image: require('../../../assets/fracture/aoota-2018/adult-acetabulum.jpg'),
    sourcePage: 77,
  },
  handCarpus: {
    image: require('../../../assets/fracture/aoota-2018/adult-hand-carpus.jpg'),
    sourcePage: 83,
    aspectRatio: 900 / 720,
  },
  foot: {
    image: require('../../../assets/fracture/aoota-2018/adult-foot.jpg'),
    sourcePage: 89,
    aspectRatio: 900 / 720,
  },
  cervicalSpine: {
    image: require('../../../assets/fracture/aoota-2018/adult-cervical-spine.jpg'),
    sourcePage: 146,
  },
  thoracolumbarSpine: {
    image: require('../../../assets/fracture/aoota-2018/adult-thoracolumbar-spine.jpg'),
    sourcePage: 151,
  },
  sacrum: {
    image: require('../../../assets/fracture/aoota-2018/adult-sacrum.jpg'),
    sourcePage: 155,
    aspectRatio: 900 / 720,
  },
  ribs: {
    image: require('../../../assets/fracture/aoota-2018/adult-ribs.jpg'),
    sourcePage: 161,
  },
  sternum: {
    image: require('../../../assets/fracture/aoota-2018/adult-sternum.jpg'),
    sourcePage: 163,
  },
};

const pediatricIllustrations: Readonly<Record<PediatricSubsegment, FractureIllustrationSource>> = {
  E: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-epiphyseal.jpg'),
    sourcePage: 119,
    aspectRatio: 920 / 610,
  },
  M: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-metaphyseal.jpg'),
    sourcePage: 119,
    aspectRatio: 920 / 540,
  },
  D: {
    image: require('../../../assets/fracture/aoota-2018/pediatric-diaphyseal.jpg'),
    sourcePage: 120,
    aspectRatio: 920 / 560,
  },
};

const dislocationImages = {
  110: require('../../../assets/fracture/aoota-2018/dislocation-110.jpg'),
  111: require('../../../assets/fracture/aoota-2018/dislocation-111.jpg'),
  112: require('../../../assets/fracture/aoota-2018/dislocation-112.jpg'),
  113: require('../../../assets/fracture/aoota-2018/dislocation-113.jpg'),
  114: require('../../../assets/fracture/aoota-2018/dislocation-114.jpg'),
  115: require('../../../assets/fracture/aoota-2018/dislocation-115.jpg'),
  116: require('../../../assets/fracture/aoota-2018/dislocation-116.jpg'),
  117: require('../../../assets/fracture/aoota-2018/dislocation-117.jpg'),
  118: require('../../../assets/fracture/aoota-2018/dislocation-118.jpg'),
  119: require('../../../assets/fracture/aoota-2018/dislocation-119.jpg'),
} as const satisfies Readonly<Record<number, ImageSourcePropType>>;

function dislocationPage(pdfPage: keyof typeof dislocationImages): FractureIllustrationSource {
  return {
    image: dislocationImages[pdfPage],
    sourcePage: pdfPage - 3,
    aspectRatio: 900 / 760,
  };
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
  image: require('../../../assets/fracture/aoota-2018/periprosthetic-upper.jpg'),
  sourcePage: 142,
  aspectRatio: 920 / 820,
};

const periprostheticLower: FractureIllustrationSource = {
  image: require('../../../assets/fracture/aoota-2018/periprosthetic-lower.jpg'),
  sourcePage: 143,
  aspectRatio: 920 / 820,
};

export const openFractureIllustration: FractureIllustrationSource = {
  image: require('../../../assets/fracture/aoota-2018/open-fracture.jpg'),
  sourcePage: 106,
  aspectRatio: 920 / 690,
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
