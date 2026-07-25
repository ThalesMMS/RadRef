import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section, type IconName } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('lung');

const toolIcons: Readonly<Record<string, IconName>> = {
  fleischner: 'calendar.badge.clock',
  lungRads: 'chart.bar.doc.horizontal',
  brock: 'percent',
  lungReferences: 'books.vertical.fill',
};

export function LungHomeScreen() {
  return (
    <Screen titleKey="module.lung.title" subtitleKey="module.lung.guidelines" large>
      <Banner titleKey="lung.scope.title" textKey="lung.scope.text" />
      <Section
        headerKey="lung.home.toolsTitle"
        footerKey="lung.home.toolsDescription"
        separatorInset={60}
      >
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'chart.bar.doc.horizontal'}
            accent="lung"
          />
        ))}
      </Section>
      <Section headerKey="lung.home.keyPointsTitle">
        <KeyPointList
          accent="lung"
          itemKeys={[
            'lung.home.keyPoint.incidentalVsScreening',
            'lung.home.keyPoint.measurement',
            'lung.home.keyPoint.local',
          ]}
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
