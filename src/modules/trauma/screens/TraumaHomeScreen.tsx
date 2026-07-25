import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section, type IconName } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('trauma');

const toolIcons: Readonly<Record<string, IconName>> = {
  solidOrgan: 'cross.case.fill',
  aastScales: 'list.number',
  traumaReferences: 'books.vertical.fill',
};

export function TraumaHomeScreen() {
  return (
    <Screen titleKey="module.trauma.title" subtitleKey="module.trauma.guidelines" large>
      <Banner titleKey="trauma.scope.title" textKey="trauma.scope.text" />
      <Section
        headerKey="trauma.home.toolsTitle"
        footerKey="trauma.home.toolsDescription"
        separatorInset={60}
      >
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'cross.case.fill'}
            accent="trauma"
          />
        ))}
      </Section>
      <Section headerKey="trauma.home.keyPointsTitle">
        <KeyPointList
          accent="trauma"
          itemKeys={[
            'trauma.home.keyPoint.anatomicGrade',
            'trauma.home.keyPoint.highestCriterion',
            'trauma.home.keyPoint.notManagement',
          ]}
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
