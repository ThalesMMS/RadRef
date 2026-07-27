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
import { parseLocalizedNumber } from '../../../core/numbers';
import { calculateEnhancement, type EnhancementModality } from '../domain';

const modalityOptions: readonly ChoiceOption<EnhancementModality>[] = [
  { value: 'ct', labelKey: 'renal.enhancement.modality.ct' },
  { value: 'mri', labelKey: 'renal.enhancement.modality.mri' },
];

export function EnhancementScreen() {
  const [modality, setModality] = useState<EnhancementModality>('ct');
  const [visuallyUnequivocal, setVisuallyUnequivocal] = useState(false);
  const [preContrast, setPreContrast] = useState('20');
  const [postContrast, setPostContrast] = useState('40');

  const reset = () => {
    setModality('ct');
    setVisuallyUnequivocal(false);
    setPreContrast('20');
    setPostContrast('40');
  };

  const result = useMemo(() => {
    const pre = parseLocalizedNumber(preContrast);
    const post = parseLocalizedNumber(postContrast);
    return calculateEnhancement({
      modality,
      visuallyUnequivocal,
      ...(pre === undefined ? {} : { preContrast: pre }),
      ...(post === undefined ? {} : { postContrast: post }),
    });
  }, [modality, postContrast, preContrast, visuallyUnequivocal]);

  return (
    <Screen
      titleKey="renal.tools.enhancement.title"
      subtitleKey="renal.tools.enhancement.meta"
      switcher={<ToolSwitcher moduleId="renal" current="/renal/enhancement" />}
      result={(
        <ResultCard
          variant="hero"
          badge={result.metric}
          title={result.title}
          primary={result.interpretation}
          severity={result.severity}
        />
      )}
    >
      <Banner titleKey="renal.enhancement.scopeTitle" textKey="renal.enhancement.scopeText" />
      <Section headerKey="common.inputs">
        <ChoiceRow
          labelKey="renal.enhancement.modality"
          options={modalityOptions}
          value={modality}
          onChange={setModality}
          variant="segmented"
        />
        <SwitchRow
          labelKey="renal.enhancement.visuallyUnequivocal"
          infoKey="renal.enhancement.visuallyUnequivocalDescription"
          value={visuallyUnequivocal}
          onValueChange={setVisuallyUnequivocal}
        />
        {!visuallyUnequivocal ? (
          <InputRow
            labelKey="renal.enhancement.preContrast"
            value={preContrast}
            onChangeText={setPreContrast}
            unitKey={modality === 'ct' ? 'units.hu' : 'units.signal'}
          />
        ) : null}
        {!visuallyUnequivocal ? (
          <InputRow
            labelKey="renal.enhancement.postContrast"
            value={postContrast}
            onChangeText={setPostContrast}
            unitKey={modality === 'ct' ? 'units.hu' : 'units.signal'}
          />
        ) : null}
      </Section>
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="renal" />
      <Banner textKey="renal.enhancement.thresholdReminder" tone="warning" />
      <Disclaimer />
    </Screen>
  );
}
