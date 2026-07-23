import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section, type IconName } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('renal');

const toolIcons: Readonly<Record<string, IconName>> = {
  bosniak: 'list.number',
  enhancement: 'circle.lefthalf.filled',
  management: 'arrow.triangle.branch',
  renalReferences: 'books.vertical.fill',
};

export function RenalHomeScreen() {
  return (
    <Screen titleKey="module.renal.title" subtitleKey="module.renal.guidelines" large>
      <Banner titleKey="renal.scope.title" textKey="renal.scope.text" />
      <Section
        headerKey="renal.home.toolsTitle"
        footerKey="renal.home.toolsDescription"
        separatorInset={58}
      >
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'list.number'}
            accent="renal"
          />
        ))}
      </Section>
      <Section headerKey="renal.home.keyPointsTitle">
        <KeyPointList
          accent="renal"
          itemKeys={[
            'renal.home.keyPoint.enhancement',
            'renal.home.keyPoint.cysticDefinition',
            'renal.home.keyPoint.management',
          ]}
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
