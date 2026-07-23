import { AppScreen, Disclaimer, InfoBanner, KeyPointList, SectionCard, ToolCard } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('lung');

export function LungHomeScreen() {
  return (
    <AppScreen titleKey="module.lung.title" subtitleKey="module.lung.guidelines">
      <Disclaimer />
      <InfoBanner titleKey="lung.scope.title" textKey="lung.scope.text" />
      <SectionCard titleKey="lung.home.toolsTitle" descriptionKey="lung.home.toolsDescription">
        {moduleDefinition.tools.map((tool) => (
          <ToolCard
            key={tool.id}
            titleKey={tool.titleKey}
            descriptionKey={tool.descriptionKey}
            route={tool.route}
            {...(tool.metaKey === undefined ? {} : { metaKey: tool.metaKey })}
            accent="lung"
          />
        ))}
      </SectionCard>
      <SectionCard titleKey="lung.home.keyPointsTitle">
        <KeyPointList itemKeys={[
          'lung.home.keyPoint.incidentalVsScreening',
          'lung.home.keyPoint.measurement',
          'lung.home.keyPoint.local',
        ]} />
      </SectionCard>
    </AppScreen>
  );
}
