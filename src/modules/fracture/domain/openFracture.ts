import { type ClinicalResult, msg } from '../../../core/domain.ts';

export type OtaOfcGrade = 1 | 2 | 3;

export type OpenFractureInput = Readonly<{
  skin: OtaOfcGrade;
  muscle: OtaOfcGrade;
  arterial: OtaOfcGrade;
  contamination: OtaOfcGrade;
  boneLoss: OtaOfcGrade;
}>;

export type OpenFractureResult = ClinicalResult & Readonly<{
  profile: string;
  highestComponent: OtaOfcGrade;
}>;

const componentKeys = {
  skin: 'fracture.open.component.skin',
  muscle: 'fracture.open.component.muscle',
  arterial: 'fracture.open.component.arterial',
  contamination: 'fracture.open.component.contamination',
  boneLoss: 'fracture.open.component.boneLoss',
} as const;

export function classifyOpenFracture(input: OpenFractureInput): OpenFractureResult {
  const profile = `S${input.skin}-M${input.muscle}-A${input.arterial}-C${input.contamination}-B${input.boneLoss}`;
  const highestComponent = Math.max(
    input.skin,
    input.muscle,
    input.arterial,
    input.contamination,
    input.boneLoss,
  ) as OtaOfcGrade;

  const severity: ClinicalResult['severity'] = input.arterial === 3
    ? 'critical'
    : highestComponent === 3
      ? 'high'
      : highestComponent === 2
        ? 'moderate'
        : 'low';

  const notes = (Object.keys(componentKeys) as readonly (keyof typeof componentKeys)[]).map((component) => {
    const grade = input[component];
    return msg(`fracture.open.${component}.${grade}`, {
      component: componentKeys[component],
      grade,
    });
  });

  return {
    code: profile,
    profile,
    highestComponent,
    title: msg('fracture.open.result.title'),
    recommendation: msg('fracture.open.result.profile', { profile }),
    notes: [
      ...notes,
      msg('fracture.open.result.noCompositeScore'),
      msg('fracture.open.result.initialDebridement'),
    ],
    severity,
  };
}
