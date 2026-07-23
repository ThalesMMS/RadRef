import { AppScreen, Disclaimer, ModuleCard, SectionCard, ToolCard } from '../components';
import { radiologyModules } from '../core/moduleRegistry';

export function HomeScreen() {
  return (
    <AppScreen titleKey="app.name" subtitleKey="app.tagline" showBack={false} testID="home-screen">
      <SectionCard titleKey="home.availableModules" descriptionKey="home.availableModulesDescription">
        {radiologyModules.map((module) => <ModuleCard key={module.id} module={module} />)}
      </SectionCard>
      <Disclaimer />
      <ToolCard
        titleKey="about.title"
        descriptionKey="about.cardDescription"
        route="/about"
        metaKey="about.cardMeta"
      />
    </AppScreen>
  );
}
