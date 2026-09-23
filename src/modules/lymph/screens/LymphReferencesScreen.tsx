import { Banner, Disclaimer, KeyPointList, ReferenceList, Screen, Section } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';
import { lymphSources } from '../domain/referenceData';

export function LymphReferencesScreen() {
  return (
    <Screen titleKey="lymph.references.title" subtitleKey="lymph.references.subtitle">
      <Banner textKey="lymph.references.externalNotice" />
      <Section headerKey="lymph.home.keyPointsTitle">
        <KeyPointList accent={moduleById('lymph').accent} itemKeys={[
          'lymph.point.size', 'lymph.point.context', 'lymph.point.recist',
        ]} />
      </Section>
      <Section headerKey="common.references" separatorInset={60}>
        <ReferenceList items={lymphSources} />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
