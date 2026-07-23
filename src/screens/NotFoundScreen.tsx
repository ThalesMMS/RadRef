import { AppScreen, InfoBanner, ToolCard } from '../components';

export function NotFoundScreen() {
  return (
    <AppScreen titleKey="notFound.title" subtitleKey="notFound.subtitle" showBack={false}>
      <InfoBanner titleKey="notFound.bannerTitle" textKey="notFound.bannerText" tone="warning" />
      <ToolCard
        titleKey="notFound.homeTitle"
        descriptionKey="notFound.homeDescription"
        route="/"
      />
    </AppScreen>
  );
}
