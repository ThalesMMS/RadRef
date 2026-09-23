import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Banner, Disclaimer, NavRow, ReferenceList, Screen, Section, ToolSwitcher } from '../../../components';
import { useI18n } from '../../../core/i18n';
import { moduleById } from '../../../core/moduleRegistry';
import { accentColor, font, radii, spacing, useTheme } from '../../../theme';
import { chainsForRegion, normalizeLymphSearch, sourcesFor, type LymphRegion } from '../domain/referenceData';

const moduleDefinition = moduleById('lymph');

export function LymphRegionScreen({ region }: Readonly<{ region: LymphRegion }>) {
  const { t, language } = useI18n();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const normalizedQuery = normalizeLymphSearch(query);
  const chains = chainsForRegion(region).filter((item) =>
    normalizeLymphSearch(t(item.labelKey)).includes(normalizedQuery));
  const tint = accentColor(colors, moduleDefinition.accent);

  return (
    <Screen
      titleKey={`lymph.tools.${region}.title`}
      subtitleKey="module.lymph.guidelines"
      switcher={<ToolSwitcher moduleId="lymph" current={`/lymph/${region}`} />}
      testID={`lymph-${region}-screen`}
    >
      <Banner titleKey="lymph.scope.title" textKey="lymph.scope.text" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('lymph.search.placeholder')}
        accessibilityLabel={t('lymph.search.placeholder')}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={[styles.search, { color: colors.text, backgroundColor: colors.card }]}
        testID="lymph-chain-search"
      />
      {chains.length === 0 ? <Banner textKey="lymph.search.empty" /> : null}
      {chains.map((item) => (
        <Section key={item.id} headerKey={item.labelKey}>
          <View style={styles.measurement} testID={`lymph-chain-${item.id}`}>
            <Text style={[styles.kind, { color: colors.textSecondary }]}>
              {t(`lymph.kind.${item.measurement.kind}`)}
            </Text>
            <Text style={[styles.value, { color: tint }]}>
              {item.measurement.kind === 'typicalCT'
                ? t('lymph.measure.typicalCT', {
                  mean: item.measurement.meanMm.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US'),
                  min: item.measurement.minMm,
                  max: item.measurement.maxMm,
                })
                : t(`lymph.measure.${item.measurement.kind}`, {
                  mm: item.measurement.kind === 'qualitative' ? '' : item.measurement.shortAxisMm,
                })}
            </Text>
            <Text style={[styles.note, { color: colors.textSecondary }]}>{t(item.noteKey)}</Text>
          </View>
          <ReferenceList items={sourcesFor(item.sourceIds)} />
        </Section>
      ))}
      <Section separatorInset={60}>
        <NavRow titleKey="common.references" subtitleKey="lymph.references.subtitle"
          route="/lymph/references" icon="books.vertical.fill" accent={moduleDefinition.accent} />
      </Section>
      <Disclaimer />
    </Screen>
  );
}

export function CervicalNodesScreen() { return <LymphRegionScreen region="cervical" />; }
export function ThoracicNodesScreen() { return <LymphRegionScreen region="thoracic" />; }
export function AbdominalNodesScreen() { return <LymphRegionScreen region="abdominal" />; }

const styles = StyleSheet.create({
  search: { ...font.body, borderRadius: radii.lg, padding: spacing.sm, minHeight: 44 },
  measurement: { padding: spacing.md, gap: spacing.xs },
  kind: { ...font.footnoteBold },
  value: { ...font.title2 },
  note: { ...font.footnote },
});
