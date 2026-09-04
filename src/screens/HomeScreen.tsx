import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Disclaimer, Icon, ModuleCard, NavRow, Screen, Section } from '../components';
import { useI18n } from '../core/i18n';
import {
  allRegisteredTools,
  radiologyModules,
  toolByRoute,
  type RegisteredToolItem,
} from '../core/moduleRegistry';
import { toolIcons } from '../core/toolIcons';
import { useFavorites } from '../core/useFavorites';
import { font, radii, spacing, useTheme } from '../theme';

export function HomeScreen() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return allRegisteredTools().filter(({ tool, module }) => {
      const title = t(tool.titleKey).toLowerCase();
      const desc = t(tool.descriptionKey).toLowerCase();
      const meta = tool.metaKey ? t(tool.metaKey).toLowerCase() : '';
      const modTitle = t(module.titleKey).toLowerCase();
      const toolId = tool.id.toLowerCase();
      return (
        title.includes(normalizedQuery)
        || desc.includes(normalizedQuery)
        || meta.includes(normalizedQuery)
        || modTitle.includes(normalizedQuery)
        || toolId.includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, t]);

  const favoriteItems = useMemo(() => {
    return favorites
      .map((route) => toolByRoute(route))
      .filter((item): item is RegisteredToolItem => item !== undefined);
  }, [favorites]);

  const isSearching = normalizedQuery.length > 0;

  return (
    <Screen titleKey="app.name" subtitleKey="app.tagline" large testID="home-screen">
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Icon name="magnifyingglass" size={17} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          testID="home-search-input"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('home.clearSearch')}
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            testID="home-clear-search"
          >
            <Icon name="xmark" size={13} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {isSearching ? (
        searchResults.length > 0 ? (
          <Section
            headerKey="home.searchResults"
            footerText={t('home.searchResultsCount', { count: searchResults.length })}
            separatorInset={60}
          >
            {searchResults.map((item) => (
              <NavRow
                key={item.tool.route}
                titleKey={item.tool.titleKey}
                subtitleKey={item.tool.descriptionKey}
                route={item.tool.route}
                icon={toolIcons[item.tool.id] ?? 'chart.bar.doc.horizontal'}
                accent={item.module.accent}
                favorite={isFavorite(item.tool.route)}
                onToggleFavorite={() => toggleFavorite(item.tool.route)}
              />
            ))}
          </Section>
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Icon name="magnifyingglass" size={28} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('home.noResults', { query: searchQuery.trim() })}
            </Text>
          </View>
        )
      ) : (
        <>
          {favoriteItems.length > 0 ? (
            <Section
              headerKey="home.favoritesTitle"
              footerKey="home.favoritesDescription"
              separatorInset={60}
            >
              {favoriteItems.map((item) => (
                <NavRow
                  key={item.tool.route}
                  titleKey={item.tool.titleKey}
                  subtitleKey={item.tool.descriptionKey}
                  route={item.tool.route}
                  icon={toolIcons[item.tool.id] ?? 'chart.bar.doc.horizontal'}
                  accent={item.module.accent}
                  favorite={true}
                  onToggleFavorite={() => toggleFavorite(item.tool.route)}
                />
              ))}
            </Section>
          ) : null}

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
        </>
      )}

      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm + 2,
    height: 42,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...font.body,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...font.subhead,
    textAlign: 'center',
  },
});
