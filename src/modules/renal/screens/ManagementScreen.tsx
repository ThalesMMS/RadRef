import { useMemo, useState } from 'react';
import {
  Banner,
  Button,
  ChoiceRow,
  Disclaimer,
  InputRow,
  ResultCard,
  Screen,
  Section,
  SwitchRow,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import { msg } from '../../../core/domain';
import { parseLocalizedNumber } from '../../../core/numbers';
import { calculateBosniakManagement, type BosniakCategory } from '../domain';

const categoryOptions: readonly ChoiceOption<BosniakCategory>[] = [
  { value: 'I', labelKey: 'renal.bosniak.title.I' },
  { value: 'II', labelKey: 'renal.bosniak.title.II' },
  { value: 'IIF', labelKey: 'renal.bosniak.title.IIF' },
  { value: 'III', labelKey: 'renal.bosniak.title.III' },
  { value: 'IV', labelKey: 'renal.bosniak.title.IV' },
  { value: 'incomplete', labelKey: 'renal.bosniak.title.incomplete' },
  { value: 'notApplicable', labelKey: 'renal.bosniak.title.notApplicable' },
];

export function ManagementScreen() {
  const [category, setCategory] = useState<BosniakCategory>('IIF');
  const [lesionSize, setLesionSize] = useState('30');
  const [symptomatic, setSymptomatic] = useState(false);
  const [comorbidity, setComorbidity] = useState(false);
  const [targetableSolidComponent, setTargetableSolidComponent] = useState(false);

  const reset = () => {
    setCategory('IIF');
    setLesionSize('30');
    setSymptomatic(false);
    setComorbidity(false);
    setTargetableSolidComponent(false);
  };

  const result = useMemo(() => {
    const lesionSizeMm = parseLocalizedNumber(lesionSize);
    return calculateBosniakManagement({
      category,
      ...(lesionSizeMm === undefined ? {} : { lesionSizeMm }),
      symptomatic,
      significantComorbidityOrLimitedLifeExpectancy: comorbidity,
      targetableSolidComponent,
    });
  }, [category, comorbidity, lesionSize, symptomatic, targetableSolidComponent]);

  const severity = category === 'I' || category === 'II'
    ? 'low'
    : category === 'IIF'
      ? 'moderate'
      : category === 'III'
        ? 'high'
        : category === 'IV'
          ? 'critical'
          : 'neutral';

  return (
    <Screen
      titleKey="renal.tools.management.title"
      subtitleKey="renal.tools.management.meta"
      switcher={<ToolSwitcher moduleId="renal" current="/renal/management" />}
      result={(
        <ResultCard
          variant="hero"
          badge={category === 'notApplicable' ? 'N/A' : category === 'incomplete' ? '—' : category}
          title={msg('renal.management.resultTitle')}
          primary={result.primary}
          {...(result.followUp === undefined ? {} : { secondary: result.followUp })}
          severity={severity}
          notes={[...result.notes, result.evidence]}
        />
      )}
    >
      <Banner titleKey="renal.management.scopeTitle" textKey="renal.management.scopeText" />
      <Section headerKey="common.inputs">
        <ChoiceRow
          labelKey="renal.management.category"
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          variant="menu"
        />
        {category === 'III' || category === 'IV' ? (
          <InputRow labelKey="renal.management.lesionSize" value={lesionSize} onChangeText={setLesionSize} unitKey="units.mm" />
        ) : null}
        <SwitchRow labelKey="renal.management.symptomatic" value={symptomatic} onValueChange={setSymptomatic} />
        {category === 'III' || category === 'IV' ? (
          <SwitchRow
            labelKey="renal.management.comorbidity"
            infoKey="renal.management.comorbidityDescription"
            value={comorbidity}
            onValueChange={setComorbidity}
          />
        ) : null}
        {category === 'III' || category === 'IV' ? (
          <SwitchRow
            labelKey="renal.management.targetableComponent"
            infoKey="renal.management.targetableComponentDescription"
            value={targetableSolidComponent}
            onValueChange={setTargetableSolidComponent}
          />
        ) : null}
      </Section>
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="renal" />
      <Banner textKey="renal.management.sharedDecisionReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
