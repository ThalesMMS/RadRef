import { useMemo, useState } from 'react';
import {
  Banner,
  Button,
  ChoiceRow,
  Disclaimer,
  ResultCard,
  Screen,
  Section,
  type ChoiceOption,
} from '../../../components';
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

  return (
    <Screen titleKey="trauma.tools.solidOrgan.title" subtitleKey="trauma.tools.solidOrgan.meta">
      <Banner titleKey="trauma.solidOrgan.scopeTitle" textKey="trauma.solidOrgan.scopeText" />
      <Section headerKey="trauma.solidOrgan.inputsTitle" footerKey="trauma.solidOrgan.inputsDescription">
        <ChoiceRow labelKey="trauma.solidOrgan.organLabel" options={organOptions} value={organ} onChange={selectOrgan} variant="segmented" />
        <ChoiceRow labelKey="trauma.solidOrgan.criterionLabel" options={criterionOptions} value={criterionId} onChange={setCriterionId} variant="list" />
      </Section>
      <ResultCard
        badge={result.code}
        title={result.title}
        primary={result.recommendation}
        severity={result.severity}
        notes={result.notes}
        {...(result.warnings ? { warnings: result.warnings } : {})}
      />
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="trauma" />
      <Banner textKey="trauma.solidOrgan.protocolReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
