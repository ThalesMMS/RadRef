import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Banner, Disclaimer, NavRow, Screen, Section } from '../../components';
import { useI18n } from '../../core/i18n';
import { moduleById } from '../../core/moduleRegistry';
import { useFavorites } from '../../core/useFavorites';
import { font, radii, spacing, useTheme } from '../../theme';
import {
  examKey, examRoute, measurementKey, searchUltrasoundMeasurements,
  ultrasoundSources, ultrasoundSourceById,
  type UltrasoundExamId, type UltrasoundMeasurement, type UltrasoundSourceId,
} from './catalog';

function SourceLink({ sourceId }: Readonly<{ sourceId: UltrasoundSourceId }>) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const source = ultrasoundSourceById(sourceId);
  const label = `${source.title} (${source.year})`;
  return (
    <View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={label}
        onPress={() => {
          setFailed(false);
          void Linking.openURL(source.url).catch(() => setFailed(true));
        }}
        style={({ pressed }) => [styles.source, pressed && { opacity: 0.6 }]}
      >
        <Text style={[styles.link, { color: colors.tint }]}>{label}</Text>
      </Pressable>
      {failed ? <Text accessibilityLiveRegion="polite" style={[styles.note, { color: colors.textSecondary }]}>{t('ultrasound.linkError')}</Text> : null}
    </View>
  );
}

function MeasurementCard({ item }: Readonly<{ item: UltrasoundMeasurement }>) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <Section>
      <View style={styles.measurement} testID={`ultrasound-measurement-${item.id}`}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>{t(measurementKey(item.id, 'name'))}</Text>
        <Text style={[styles.note, { color: colors.textSecondary }]}>{t(`ultrasound.kind.${item.kind}`)}</Text>
        <Text selectable style={[styles.value, { color: colors.renal }]}>{t(measurementKey(item.id, 'value'))}</Text>
        {(['population', 'method', 'caution'] as const).map((field) => (
          <View key={field} style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{t(`ultrasound.${field}`)}</Text>
            <Text selectable style={[styles.body, { color: colors.textSecondary }]}>{t(measurementKey(item.id, field))}</Text>
          </View>
        ))}
        <Text style={[styles.label, { color: colors.text }]}>{t('ultrasound.sources')}</Text>
        {item.sourceIds.map((id) => <SourceLink key={id} sourceId={id} />)}
      </View>
    </Section>
  );
}

function SearchField({ value, onChange }: Readonly<{ value: string; onChange: (value: string) => void }>) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={styles.searchWrap}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t('ultrasound.search')}
        accessibilityLabel={t('ultrasound.search')}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        testID="ultrasound-search"
        style={[styles.search, { color: colors.text, backgroundColor: colors.card, borderColor: colors.separator }]}
      />
      {value.length > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('ultrasound.clear')} onPress={() => onChange('')} style={styles.source}>
          <Text style={[styles.link, { color: colors.tint }]}>{t('ultrasound.clear')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Shared renderer; route wrappers keep exam selection typed and deep-linkable. */
function UltrasoundBrowser({ examId }: Readonly<{ examId?: UltrasoundExamId }>) {
  const { t, language } = useI18n();
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const items = useMemo(() => searchUltrasoundMeasurements(query, language, examId), [query, language, examId]);
  const module = moduleById('ultrasound');
  const showMeasurements = examId !== undefined || query.trim().length > 0;
  return (
    <Screen
      titleKey={examId === undefined ? 'module.ultrasound.title' : examKey(examId, 'title')}
      subtitleKey={examId === undefined ? 'module.ultrasound.guidelines' : examKey(examId, 'description')}
      large={examId === undefined}
      testID={examId === undefined ? 'ultrasound-home' : `ultrasound-exam-${examId}`}
    >
      <Banner titleKey="ultrasound.scope.title" textKey="ultrasound.scope.text" />
      <SearchField value={query} onChange={setQuery} />
      {examId === undefined ? (
        <Section headerKey="ultrasound.exams" separatorInset={60}>
          {module.tools.filter((tool) => tool.kind !== 'reference' && (!query.trim() || items.some((item) => examRoute(item.examId) === tool.route))).map((tool) => (
            <NavRow key={tool.id} titleKey={tool.titleKey} subtitleKey={tool.descriptionKey} route={tool.route}
              icon="chart.bar.doc.horizontal" accent="renal" favorite={isFavorite(tool.route)}
              onToggleFavorite={() => toggleFavorite(tool.route)} />
          ))}
        </Section>
      ) : null}
      {showMeasurements ? (
        <>
          <Text accessibilityLiveRegion="polite" style={[styles.body, { color: colors.textSecondary }]}>{t('ultrasound.results', { count: items.length })}</Text>
          {items.length === 0 ? <Text style={[styles.body, { color: colors.textSecondary }]}>{t('ultrasound.empty')}</Text> : null}
          {items.map((item) => <MeasurementCard key={item.id} item={item} />)}
        </>
      ) : null}
      <Section separatorInset={60}>
        <NavRow titleKey="ultrasound.references.title" subtitleKey="ultrasound.references.description" route="/ultrasound/references" icon="books.vertical.fill" accent="renal" />
      </Section>
      <Disclaimer />
    </Screen>
  );
}
export function UltrasoundHomeScreen() { return <UltrasoundBrowser />; }
export function UltrasoundExamScreen({ examId }: Readonly<{ examId: UltrasoundExamId }>) {
  return <UltrasoundBrowser key={examId} examId={examId} />;
}
export function UltrasoundReferencesScreen() {
  return (
    <Screen titleKey="ultrasound.references.title" subtitleKey="ultrasound.references.note">
      <Banner titleKey="ultrasound.scope.title" textKey="ultrasound.scope.text" />
      <Section headerKey="ultrasound.sources">
        {ultrasoundSources.map((source) => <View key={source.id} style={styles.referenceRow}><SourceLink sourceId={source.id} /></View>)}
      </Section>
      <Disclaimer />
    </Screen>
  );
}
const styles = StyleSheet.create({
  measurement: { padding: spacing.md, gap: spacing.xs },
  title: { ...font.headline },
  value: { ...font.title3, marginVertical: spacing.xxs },
  note: { ...font.footnote },
  label: { ...font.footnoteBold },
  body: { ...font.subhead },
  field: { gap: spacing.xxs, marginBottom: spacing.xxs },
  link: { ...font.footnote, textDecorationLine: 'underline' },
  source: { minHeight: 44, justifyContent: 'center', paddingVertical: spacing.xs },
  searchWrap: { gap: spacing.xxs },
  search: { ...font.body, minHeight: 48, borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  referenceRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.xxs },
});
