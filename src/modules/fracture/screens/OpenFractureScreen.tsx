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
import { classifyOpenFracture, type OtaOfcGrade } from '../domain';

type GradeValue = '1' | '2' | '3';
type ComponentName = 'skin' | 'muscle' | 'arterial' | 'contamination' | 'boneLoss';

function options(component: ComponentName): readonly ChoiceOption<GradeValue>[] {
  return ([1, 2, 3] as const).map((grade) => ({
    value: String(grade) as GradeValue,
    labelKey: `fracture.open.grade.${grade}`,
    descriptionKey: `fracture.open.${component}.${grade}`,
  }));
}

function grade(value: GradeValue): OtaOfcGrade {
  return Number(value) as OtaOfcGrade;
}

export function OpenFractureScreen() {
  const { t, tx } = useI18n();
  const [skin, setSkin] = useState<GradeValue>('1');
  const [muscle, setMuscle] = useState<GradeValue>('1');
  const [arterial, setArterial] = useState<GradeValue>('1');
  const [contamination, setContamination] = useState<GradeValue>('1');
  const [boneLoss, setBoneLoss] = useState<GradeValue>('1');

  const result = useMemo(() => classifyOpenFracture({
    skin: grade(skin),
    muscle: grade(muscle),
    arterial: grade(arterial),
    contamination: grade(contamination),
    boneLoss: grade(boneLoss),
  }), [arterial, boneLoss, contamination, muscle, skin]);

  const reset = () => {
    setSkin('1');
    setMuscle('1');
    setArterial('1');
    setContamination('1');
    setBoneLoss('1');
  };

  const reportText = `${t('fracture.tools.open.title')}\n`
    + `${tx(result.title)} (${result.code})\n`
    + `${tx(result.recommendation)}\n`
    + (result.notes.length > 0 ? `\n${t('result.notes')}:\n${result.notes.map((n) => `• ${tx(n)}`).join('\n')}\n` : '')
    + `\n${t('disclaimer.short')}`;

  return (
    <Screen
      titleKey="fracture.tools.open.title"
      subtitleKey="fracture.tools.open.meta"
      switcher={<ToolSwitcher moduleId="fracture" current="/fracture/open" />}
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
      <Banner titleKey="fracture.open.scopeTitle" textKey="fracture.open.scopeText" />
      <Section headerKey="fracture.open.componentsTitle" infoKey="fracture.open.componentsDescription">
        <ChoiceRow labelKey="fracture.open.component.skin" options={options('skin')} value={skin} onChange={setSkin} variant="menu" />
        <ChoiceRow labelKey="fracture.open.component.muscle" options={options('muscle')} value={muscle} onChange={setMuscle} variant="menu" />
        <ChoiceRow labelKey="fracture.open.component.arterial" options={options('arterial')} value={arterial} onChange={setArterial} variant="menu" />
        <ChoiceRow labelKey="fracture.open.component.contamination" options={options('contamination')} value={contamination} onChange={setContamination} variant="menu" />
        <ChoiceRow labelKey="fracture.open.component.boneLoss" options={options('boneLoss')} value={boneLoss} onChange={setBoneLoss} variant="menu" />
      </Section>
      <ReportActions reportText={reportText} shareTitle={t('fracture.tools.open.title')} accent="fracture" onReset={reset} />
      <Banner textKey="fracture.open.surgicalReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
