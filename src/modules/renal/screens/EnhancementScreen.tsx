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
    <AppScreen titleKey="renal.tools.enhancement.title" subtitleKey="renal.tools.enhancement.meta">
      <Disclaimer />
      <InfoBanner titleKey="renal.enhancement.scopeTitle" textKey="renal.enhancement.scopeText" />
      <SectionCard titleKey="common.inputs">
        <ChoiceChips labelKey="renal.enhancement.modality" options={modalityOptions} value={modality} onChange={setModality} />
        <ToggleRow
          labelKey="renal.enhancement.visuallyUnequivocal"
          descriptionKey="renal.enhancement.visuallyUnequivocalDescription"
          value={visuallyUnequivocal}
          onValueChange={setVisuallyUnequivocal}
        />
        {!visuallyUnequivocal ? (
          <>
            <NumberField
              labelKey="renal.enhancement.preContrast"
              value={preContrast}
              onChangeText={setPreContrast}
              unitKey={modality === 'ct' ? 'units.hu' : 'units.signal'}
            />
            <NumberField
              labelKey="renal.enhancement.postContrast"
              value={postContrast}
              onChangeText={setPostContrast}
              unitKey={modality === 'ct' ? 'units.hu' : 'units.signal'}
            />
          </>
        ) : null}
      </SectionCard>
      <ResultCard
        badge={result.metric}
        title={result.title}
        primary={result.interpretation}
        severity={result.severity}
      />
      <ActionButton labelKey="common.resetForm" onPress={reset} tone="renal" />
      <InfoBanner textKey="renal.enhancement.thresholdReminder" tone="warning" />
    </AppScreen>
  );
}
