import { liverTreatmentResponseEn1 } from './treatmentResponseI18n.en1.ts';
import { liverTreatmentResponseEn2 } from './treatmentResponseI18n.en2.ts';
import { liverTreatmentResponseEn3 } from './treatmentResponseI18n.en3.ts';
import { liverTreatmentResponsePt1 } from './treatmentResponseI18n.pt1.ts';
import { liverTreatmentResponsePt2 } from './treatmentResponseI18n.pt2.ts';
import { liverTreatmentResponsePt3 } from './treatmentResponseI18n.pt3.ts';

export const liverTreatmentResponseEn: Readonly<Record<string, string>> = {
  ...liverTreatmentResponseEn1,
  ...liverTreatmentResponseEn2,
  ...liverTreatmentResponseEn3,
};

export const liverTreatmentResponsePt: Readonly<Record<string, string>> = {
  ...liverTreatmentResponsePt1,
  ...liverTreatmentResponsePt2,
  ...liverTreatmentResponsePt3,
};
