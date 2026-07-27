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
  classifyPeriprostheticFracture,
  ucpfTypeKeys,
  type UcpfJoint,
  type UcpfType,
} from '../domain';
import { periprostheticIllustration } from '../illustrations';
import { FractureIllustration } from './FractureIllustration';

const jointOptions: readonly ChoiceOption<UcpfJoint>[] = ([
  'I', 'II', 'III', 'IV', 'V', 'VI',
] as const).map((value) => ({ value, labelKey: `fracture.periprosthetic.joint.${value}` }));

const typeOptions: readonly ChoiceOption<UcpfType>[] = ([
  'A1', 'A2', 'B1', 'B2', 'B3', 'C', 'D', 'E', 'F',
] as const).map((value) => ({ value, labelKey: ucpfTypeKeys[value] }));

export function PeriprostheticScreen() {
  const [joint, setJoint] = useState<UcpfJoint>('IV');
  const [type, setType] = useState<UcpfType>('B1');
  const result = useMemo(() => classifyPeriprostheticFracture({ joint, type }), [joint, type]);

  const reset = () => {
    setJoint('IV');
    setType('B1');
  };

  return (
    <Screen
      titleKey="fracture.tools.periprosthetic.title"
      subtitleKey="fracture.tools.periprosthetic.meta"
      switcher={<ToolSwitcher moduleId="fracture" current="/fracture/periprosthetic" />}
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
      <Banner titleKey="fracture.periprosthetic.scopeTitle" textKey="fracture.periprosthetic.scopeText" />
      <Section headerKey="fracture.periprosthetic.inputsTitle" infoKey="fracture.periprosthetic.inputsDescription">
        <ChoiceRow labelKey="fracture.periprosthetic.jointLabel" options={jointOptions} value={joint} onChange={setJoint} variant="chips" />
        <ChoiceRow labelKey="fracture.periprosthetic.typeLabel" options={typeOptions} value={type} onChange={setType} variant="menu" />
      </Section>
      <FractureIllustration
        illustration={periprostheticIllustration(joint)}
        selectedCode={`${joint}${type}`}
      />
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="fracture" />
      <Disclaimer />
    </Screen>
  );
}
