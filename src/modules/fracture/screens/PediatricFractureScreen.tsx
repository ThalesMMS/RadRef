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
  allowedPediatricPatterns,
  allowedSubsegments,
  classifyPediatricFracture,
  pediatricPatternKeys,
  type PediatricBone,
  type PediatricPattern,
  type PediatricQualification,
  type PediatricSegment,
  type PediatricSeverity,
  type PediatricSubsegment,
} from '../domain';
import { pediatricIllustration } from '../illustrations';
import { FractureIllustration } from './FractureIllustration';

const boneOptions: readonly ChoiceOption<PediatricBone>[] = [
  { value: 'humerus', labelKey: 'fracture.pediatric.bone.humerus' },
  { value: 'radius', labelKey: 'fracture.pediatric.bone.radius' },
  { value: 'ulna', labelKey: 'fracture.pediatric.bone.ulna' },
  { value: 'femur', labelKey: 'fracture.pediatric.bone.femur' },
  { value: 'tibia', labelKey: 'fracture.pediatric.bone.tibia' },
  { value: 'fibula', labelKey: 'fracture.pediatric.bone.fibula' },
];

const segmentOptions: readonly ChoiceOption<PediatricSegment>[] = [
  { value: 'proximal', labelKey: 'fracture.pediatric.segment.proximal' },
  { value: 'diaphyseal', labelKey: 'fracture.pediatric.segment.diaphyseal' },
  { value: 'distal', labelKey: 'fracture.pediatric.segment.distal' },
];

const severityOptions: readonly ChoiceOption<PediatricSeverity>[] = [
  { value: '1', labelKey: 'fracture.pediatric.severity.1', descriptionKey: 'fracture.pediatric.severity.1Description' },
  { value: '2', labelKey: 'fracture.pediatric.severity.2', descriptionKey: 'fracture.pediatric.severity.2Description' },
];

const qualificationOptions: readonly ChoiceOption<PediatricQualification>[] = [
  { value: 'none', labelKey: 'fracture.pediatric.qualification.none' },
  { value: 'I', labelKey: 'fracture.pediatric.qualification.I' },
  { value: 'II', labelKey: 'fracture.pediatric.qualification.II' },
  { value: 'III', labelKey: 'fracture.pediatric.qualification.III' },
  { value: 'IV', labelKey: 'fracture.pediatric.qualification.IV' },
];

export function PediatricFractureScreen() {
  const [bone, setBone] = useState<PediatricBone>('humerus');
  const [segment, setSegment] = useState<PediatricSegment>('proximal');
  const [subsegment, setSubsegment] = useState<PediatricSubsegment>('E');
  const [pattern, setPattern] = useState<PediatricPattern>('E1');
  const [severity, setSeverity] = useState<PediatricSeverity>('1');
  const [qualification, setQualification] = useState<PediatricQualification>('none');

  const subsegmentOptions = useMemo<readonly ChoiceOption<PediatricSubsegment>[]>(
    () => allowedSubsegments(segment).map((value) => ({
      value,
      labelKey: `fracture.pediatric.subsegment.${value}`,
    })),
    [segment],
  );
  const patternOptions = useMemo<readonly ChoiceOption<PediatricPattern>[]>(
    () => allowedPediatricPatterns(subsegment).map((value) => ({ value, labelKey: pediatricPatternKeys[value] })),
    [subsegment],
  );

  const result = useMemo(() => classifyPediatricFracture({
    bone,
    segment,
    subsegment,
    pattern,
    severity,
    qualification,
  }), [bone, pattern, qualification, segment, severity, subsegment]);

  const selectSegment = (next: PediatricSegment) => {
    const nextSubsegment = allowedSubsegments(next)[0] ?? 'E';
    const nextPattern = allowedPediatricPatterns(nextSubsegment)[0] ?? 'E1';
    setSegment(next);
    setSubsegment(nextSubsegment);
    setPattern(nextPattern);
  };

  const selectSubsegment = (next: PediatricSubsegment) => {
    setSubsegment(next);
    setPattern(allowedPediatricPatterns(next)[0] ?? 'E1');
  };

  const reset = () => {
    setBone('humerus');
    setSegment('proximal');
    setSubsegment('E');
    setPattern('E1');
    setSeverity('1');
    setQualification('none');
  };

  return (
    <Screen titleKey="fracture.tools.pediatric.title" subtitleKey="fracture.tools.pediatric.meta">
      <Banner titleKey="fracture.pediatric.scopeTitle" textKey="fracture.pediatric.scopeText" />
      <Section headerKey="fracture.pediatric.locationTitle" footerKey="fracture.pediatric.locationDescription">
        <ChoiceRow labelKey="fracture.pediatric.boneLabel" options={boneOptions} value={bone} onChange={setBone} variant="chips" />
        <ChoiceRow labelKey="fracture.pediatric.segmentLabel" options={segmentOptions} value={segment} onChange={selectSegment} variant="chips" />
        <ChoiceRow labelKey="fracture.pediatric.subsegmentLabel" options={subsegmentOptions} value={subsegment} onChange={selectSubsegment} variant="segmented" />
      </Section>
      <FractureIllustration
        illustration={pediatricIllustration(subsegment)}
        selectedCode={pattern}
      />
      <Section headerKey="fracture.pediatric.patternTitle" footerKey="fracture.pediatric.patternDescription">
        <ChoiceRow labelKey="fracture.pediatric.patternLabel" options={patternOptions} value={pattern} onChange={setPattern} variant="list" />
        <ChoiceRow labelKey="fracture.pediatric.severityLabel" options={severityOptions} value={severity} onChange={setSeverity} variant="list" />
        <ChoiceRow labelKey="fracture.pediatric.qualificationLabel" options={qualificationOptions} value={qualification} onChange={setQualification} variant="chips" />
      </Section>
      <ResultCard
        badge={result.code}
        title={result.title}
        primary={result.recommendation}
        severity={result.severity}
        notes={result.notes}
        {...(result.warnings ? { warnings: result.warnings } : {})}
      />
      <Button labelKey="common.resetForm" onPress={reset} variant="plain" accent="fracture" />
      <Disclaimer />
    </Screen>
  );
}
