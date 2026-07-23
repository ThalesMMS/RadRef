import { AppScreen, Disclaimer, InfoBanner, KeyPointList, SectionCard, ToolCard } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('renal');

export function RenalHomeScreen() {
  return (
    <AppScreen titleKey="module.renal.title" subtitleKey="module.renal.guidelines">
      <Disclaimer />
      <InfoBanner titleKey="renal.scope.title" textKey="renal.scope.text" />
      <SectionCard titleKey="renal.home.toolsTitle" descriptionKey="renal.home.toolsDescription">
        {moduleDefinition.tools.map((tool) => (
          <ToolCard
            key={tool.id}
            titleKey={tool.titleKey}
            descriptionKey={tool.descriptionKey}
            route={tool.route}
            {...(tool.metaKey === undefined ? {} : { metaKey: tool.metaKey })}
            accent="renal"
          />
        ))}
      </SectionCard>
      <SectionCard titleKey="renal.home.keyPointsTitle">
        <KeyPointList itemKeys={[
          'renal.home.keyPoint.enhancement',
          'renal.home.keyPoint.cysticDefinition',
          'renal.home.keyPoint.management',
        ]} />
      </SectionCard>
    </AppScreen>
  );
}
