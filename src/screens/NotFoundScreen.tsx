import { Banner, NavRow, Screen, Section } from '../components';

export function NotFoundScreen() {
  return (
    <Screen titleKey="notFound.title" subtitleKey="notFound.subtitle">
      <Banner titleKey="notFound.bannerTitle" textKey="notFound.bannerText" tone="warning" />
      <Section separatorInset={58}>
        <NavRow
          titleKey="notFound.homeTitle"
          subtitleKey="notFound.homeDescription"
          route="/"
          icon="house.fill"
        />
      </Section>
    </Screen>
  );
}
