import { useMemo, useState } from 'react';
import {
  ActionButton,
  AppScreen,
  ChoiceChips,
  Disclaimer,
  InfoBanner,
  NumberField,
  ResultCard,
  SectionCard,
  ToggleRow,
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
  const [lesionSize, setLesionSize] = useState('20');
  const [symptomatic, setSymptomatic] = useState(false);
  const [comorbidity, setComorbidity] = useState(false);
  const [targetableSolidComponent, setTargetableSolidComponent] = useState(false);

  const reset = () => {
    setCategory('IIF');
    setLesionSize('20');
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
    <AppScreen titleKey="renal.tools.management.title" subtitleKey="renal.tools.management.meta">
      <Disclaimer />
      <InfoBanner titleKey="renal.management.scopeTitle" textKey="renal.management.scopeText" />
      <SectionCard titleKey="common.inputs">
        <ChoiceChips labelKey="renal.management.category" options={categoryOptions} value={category} onChange={setCategory} columns={2} />
        {category === 'III' || category === 'IV' ? (
          <NumberField labelKey="renal.management.lesionSize" value={lesionSize} onChangeText={setLesionSize} unitKey="units.mm" />
        ) : null}
        <ToggleRow labelKey="renal.management.symptomatic" value={symptomatic} onValueChange={setSymptomatic} />
        {(category === 'III' || category === 'IV') ? (
          <>
            <ToggleRow
              labelKey="renal.management.comorbidity"
              descriptionKey="renal.management.comorbidityDescription"
              value={comorbidity}
              onValueChange={setComorbidity}
            />
            <ToggleRow
              labelKey="renal.management.targetableComponent"
              descriptionKey="renal.management.targetableComponentDescription"
              value={targetableSolidComponent}
              onValueChange={setTargetableSolidComponent}
            />
          </>
        ) : null}
      </SectionCard>
      <ResultCard
        badge={category === 'notApplicable' ? 'N/A' : category === 'incomplete' ? '—' : category}
        title={msg('renal.management.resultTitle')}
        primary={result.primary}
        {...(result.followUp === undefined ? {} : { secondary: result.followUp })}
        severity={severity}
        notes={[...result.notes, result.evidence]}
      />
      <ActionButton labelKey="common.resetForm" onPress={reset} tone="renal" />
      <InfoBanner textKey="renal.management.sharedDecisionReminder" tone="warning" />
    </AppScreen>
  );
}
