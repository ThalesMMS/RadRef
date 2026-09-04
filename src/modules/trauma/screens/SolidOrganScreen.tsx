import { useMemo, useState } from 'react';
import {
  Banner,
  ChoiceRow,
  Disclaimer,
  ReportActions,
  ResultCard,
  Screen,
  Section,
  ToolSwitcher,
  type ChoiceOption,
} from '../../../components';
import { useI18n } from '../../../core/i18n';
import {
  classifySolidOrganCriterion,
  criteriaForSolidOrgan,
  type SolidOrgan,
} from '../domain';

const organOptions: readonly ChoiceOption<SolidOrgan>[] = [
  { value: 'spleen', labelKey: 'trauma.solidOrgan.organ.spleen' },
  { value: 'liver', labelKey: 'trauma.solidOrgan.organ.liver' },
  { value: 'kidney', labelKey: 'trauma.solidOrgan.organ.kidney' },
];

export function SolidOrganScreen() {
  const { t, tx } = useI18n();
  const [organ, setOrgan] = useState<SolidOrgan>('spleen');
  const [criterionId, setCriterionId] = useState('spleen-g1Hematoma');

  const criteria = useMemo(() => criteriaForSolidOrgan(organ), [organ]);
  const criterionOptions: readonly ChoiceOption<string>[] = criteria.map((criterion) => ({
    value: criterion.id,
    labelKey: criterion.labelKey,
    descriptionKey: `trauma.solidOrgan.grade.${criterion.grade}`,
  }));
  const result = useMemo(
    () => classifySolidOrganCriterion(organ, criterionId),
    [criterionId, organ],
  );

  const selectOrgan = (next: SolidOrgan) => {
    setOrgan(next);
    setCriterionId(criteriaForSolidOrgan(next)[0]?.id ?? '');
  };

  const reset = () => {
    setOrgan('spleen');
    setCriterionId('spleen-g1Hematoma');
  };

  const reportText = `${t('trauma.tools.solidOrgan.title')}\n`
    + `${tx(result.title)} (${result.code})\n`
    + `${tx(result.recommendation)}\n`
    + (result.notes.length > 0 ? `\n${t('result.notes')}:\n${result.notes.map((n) => `• ${tx(n)}`).join('\n')}\n` : '')
    + `\n${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="trauma.tools.solidOrgan.title"
      subtitleKey="trauma.tools.solidOrgan.meta"
      switcher={<ToolSwitcher moduleId="trauma" current="/trauma/solid-organ" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.code}
          title={result.title}
          primary={result.recommendation}
          severity={result.severity}
          notes={result.notes}
          {...(result.warnings ? { warnings: result.warnings } : {})}
        />
      )}
    >
      <Banner titleKey="trauma.solidOrgan.scopeTitle" textKey="trauma.solidOrgan.scopeText" />
      <Section headerKey="trauma.solidOrgan.inputsTitle" infoKey="trauma.solidOrgan.inputsDescription">
        <ChoiceRow labelKey="trauma.solidOrgan.organLabel" options={organOptions} value={organ} onChange={selectOrgan} variant="segmented" />
        <ChoiceRow labelKey="trauma.solidOrgan.criterionLabel" options={criterionOptions} value={criterionId} onChange={setCriterionId} variant="menu" />
      </Section>
      <ReportActions reportText={reportText} shareTitle={t('trauma.tools.solidOrgan.title')} accent="trauma" onReset={reset} />
      <Banner textKey="trauma.solidOrgan.protocolReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
