import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section, type IconName } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';

const moduleDefinition = moduleById('fracture');

const toolIcons: Readonly<Record<string, IconName>> = {
  adultAoOta: 'list.number',
  openFracture: 'bandage.fill',
  pediatricFracture: 'figure.child',
  periprosthetic: 'wrench.and.screwdriver.fill',
  dislocations: 'arrow.left.and.right',
  fractureReferences: 'books.vertical.fill',
};

export function FractureHomeScreen() {
  return (
    <Screen titleKey="module.fracture.title" subtitleKey="module.fracture.guidelines" large>
      <Banner titleKey="fracture.scope.title" textKey="fracture.scope.text" />
      <Section
        headerKey="fracture.home.toolsTitle"
        footerKey="fracture.home.toolsDescription"
        separatorInset={60}
      >
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'list.number'}
            accent="fracture"
          />
        ))}
      </Section>
      <Section headerKey="fracture.home.keyPointsTitle">
        <KeyPointList
          accent="fracture"
          itemKeys={[
            'fracture.home.keyPoint.completeInformation',
            'fracture.home.keyPoint.codeHierarchy',
            'fracture.home.keyPoint.separateSystems',
          ]}
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
