import { Banner, Disclaimer, KeyPointList, NavRow, Screen, Section } from '../../../components';
import { moduleById } from '../../../core/moduleRegistry';
import { toolIcons } from '../../../core/toolIcons';
import { useFavorites } from '../../../core/useFavorites';

const moduleDefinition = moduleById('lymph');

export function LymphHomeScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  return (
    <Screen titleKey="module.lymph.title" subtitleKey="module.lymph.guidelines" large>
      <Banner titleKey="lymph.scope.title" textKey="lymph.scope.text" />
      <Section headerKey="lymph.home.toolsTitle" footerKey="lymph.home.toolsDescription" separatorInset={60}>
        {moduleDefinition.tools.map((tool) => (
          <NavRow
            key={tool.id}
            titleKey={tool.titleKey}
            subtitleKey={tool.descriptionKey}
            route={tool.route}
            icon={toolIcons[tool.id] ?? 'list.number'}
            accent={moduleDefinition.accent}
            favorite={isFavorite(tool.route)}
            onToggleFavorite={() => toggleFavorite(tool.route)}
          />
        ))}
      </Section>
      <Section headerKey="lymph.home.keyPointsTitle">
        <KeyPointList accent={moduleDefinition.accent} itemKeys={[
          'lymph.point.size', 'lymph.point.context', 'lymph.point.recist',
        ]} />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
