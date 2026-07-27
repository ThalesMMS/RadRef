import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useI18n } from '../core/i18n';
import { moduleById, switchableTools, type RadiologyModule } from '../core/moduleRegistry';
import { accentSolid, font, radii, useTheme } from '../theme';

type ToolSwitcherProps = Readonly<{
  moduleId: RadiologyModule['id'];
  /** Route of the screen currently on display, as declared in the module registry. */
  current: string;
}>;

/**
 * Segmented switcher between the sibling tools of a module, so comparing two
 * classifications on the same case costs one tap instead of a round trip through the hub.
 * Scrolls horizontally when the module has more tools than fit.
 */
export function ToolSwitcher({ moduleId, current }: ToolSwitcherProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { colors } = useTheme();
  const tools = switchableTools(moduleId);
  if (tools.length < 2) return null;

  const selectedFill = accentSolid(colors, moduleById(moduleId).accent);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel={t('common.tools')}
      contentContainerStyle={[styles.track, { backgroundColor: colors.segmentTrack }]}
    >
      {tools.map((tool) => {
        const selected = tool.route === current;
        return (
          <Pressable
            key={tool.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            // react-native-web does not map accessibilityState.selected for tabs.
            aria-selected={selected}
            onPress={() => {
              if (!selected) router.replace(tool.route as Href);
            }}
            style={({ pressed }) => [
              styles.segment,
              selected && [styles.segmentSelected, { backgroundColor: selectedFill }],
              pressed && !selected && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                selected ? font.subheadBold : font.subhead,
                { color: selected ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {t(tool.titleKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  track: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 3,
    gap: 3,
  },
  segment: {
    minHeight: 34,
    flexGrow: 1,
    flexShrink: 1,
    borderRadius: radii.sm + 1,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  segmentSelected: {
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.18)',
  },
  pressed: { opacity: 0.55 },
});
