import { Disclaimer, ModuleCard, NavRow, Screen, Section } from '../components';
import { radiologyModules } from '../core/moduleRegistry';

export function HomeScreen() {
  return (
    <Screen titleKey="app.name" subtitleKey="app.tagline" large testID="home-screen">
      <Section
        headerKey="home.availableModules"
        footerKey="home.availableModulesDescription"
        plain
      >
        {radiologyModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </Section>
      <Section footerKey="about.cardMeta" separatorInset={60}>
        <NavRow
          titleKey="about.title"
          subtitleKey="about.cardDescription"
          route="/about"
          icon="info.circle.fill"
        />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
