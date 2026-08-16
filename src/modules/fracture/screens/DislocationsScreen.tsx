import { useMemo, useState } from 'react';
import {
  Banner,
  Button,
  ChoiceRow,
  Disclaimer,
  ResultCard,
  Screen,
  Section,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import {
  classifyDislocation,
  dislocationDirectionKeys,
  dislocationJointKeys,
  type DislocationDirection,
  type DislocationJoint,
} from '../domain';

const jointOptions = (Object.entries(dislocationJointKeys) as readonly [DislocationJoint, string][])
  .map(([value, labelKey]) => ({ value, labelKey })) satisfies readonly ChoiceOption<DislocationJoint>[];

const directionOptions = (Object.entries(dislocationDirectionKeys) as readonly [DislocationDirection, string][])
  .map(([value, labelKey]) => ({ value, labelKey })) satisfies readonly ChoiceOption<DislocationDirection>[];

export function DislocationsScreen() {
  const [joint, setJoint] = useState<DislocationJoint>('10A');
  const [direction, setDirection] = useState<DislocationDirection>('5a');
  const result = useMemo(() => classifyDislocation({ joint, direction }), [direction, joint]);

  const reset = () => {
    setJoint('10A');
    setDirection('5a');
  };

  return (
    <Screen
      titleKey="fracture.tools.dislocations.title"
      subtitleKey="fracture.tools.dislocations.meta"
      switcher={<ToolSwitcher moduleId="fracture" current="/fracture/dislocations" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.code}
          title={result.title}
          primary={result.recommendation}
          severity={result.severity}
          notes={result.notes}
        />
      )}
    >
      <Banner titleKey="fracture.dislocation.scopeTitle" textKey="fracture.dislocation.scopeText" />
      <Section headerKey="fracture.dislocation.inputsTitle" infoKey="fracture.dislocation.inputsDescription">
        <ChoiceRow labelKey="fracture.dislocation.jointLabel" options={jointOptions} value={joint} onChange={setJoint} variant="menu" />
        <ChoiceRow labelKey="fracture.dislocation.directionLabel" options={directionOptions} value={direction} onChange={setDirection} variant="chips" />
      </Section>
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="fracture" />
      <Disclaimer />
    </Screen>
  );
}
