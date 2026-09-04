import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section, type IconName } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';
import { useFavorites } from '../../../core/useFavorites';

const moduleDefinition = moduleById('liver');

const toolIcons: Readonly<Record<string, IconName>> = {
  liRads: 'list.number',
  treatmentResponse: 'arrow.triangle.branch',
  liverReferences: 'books.vertical.fill',
};

export function LiverHomeScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Screen titleKey="module.liver.title" subtitleKey="module.liver.guidelines" large>
      <Banner titleKey="liver.scope.title" textKey="liver.scope.text" />
      <Section
        headerKey="liver.home.toolsTitle"
        footerKey="liver.home.toolsDescription"
        separatorInset={60}
      >
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'list.number'}
            accent="liver"
            favorite={isFavorite(tool.route)}
            onToggleFavorite={() => toggleFavorite(tool.route)}
          />
        ))}
      </Section>
      <Section headerKey="liver.home.keyPointsTitle">
        <KeyPointList
          accent="liver"
          itemKeys={[
            'liver.home.keyPoint.highRisk',
            'liver.home.keyPoint.majorFeatures',
            'liver.home.keyPoint.ancillary',
            'liver.home.keyPoint.tra',
          ]}
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
