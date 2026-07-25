import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Text } from 'react-native';

export type IconName =
  | 'lungs.fill'
  | 'drop.fill'
  | 'bandage.fill'
  | 'cross.case.fill'
  | 'figure.child'
  | 'wrench.and.screwdriver.fill'
  | 'arrow.left.and.right'
  | 'calendar.badge.clock'
  | 'chart.bar.doc.horizontal'
  | 'percent'
  | 'books.vertical.fill'
  | 'list.number'
  | 'circle.lefthalf.filled'
  | 'arrow.triangle.branch'
  | 'info.circle.fill'
  | 'exclamationmark.triangle.fill'
  | 'exclamationmark.octagon.fill'
  | 'link'
  | 'arrow.up.right'
  | 'checkmark'
  | 'square.and.arrow.up'
  | 'chevron.right'
  | 'stethoscope'
  | 'house.fill';

/** Text stand-ins for Android/web, where SF Symbols are unavailable. */
const fallbackGlyphs: Readonly<Record<IconName, string>> = {
  'lungs.fill': '◉',
  'drop.fill': '◈',
  'bandage.fill': '▱',
  'cross.case.fill': '✚',
  'figure.child': '◌',
  'wrench.and.screwdriver.fill': '⚒',
  'arrow.left.and.right': '↔',
  'calendar.badge.clock': '▤',
  'chart.bar.doc.horizontal': '▥',
  percent: '%',
  'books.vertical.fill': '▤',
  'list.number': '≡',
  'circle.lefthalf.filled': '◐',
  'arrow.triangle.branch': '⑂',
  'info.circle.fill': 'ⓘ',
  'exclamationmark.triangle.fill': '⚠',
  'exclamationmark.octagon.fill': '⚠',
  link: '∞',
  'arrow.up.right': '↗',
  checkmark: '✓',
  'square.and.arrow.up': '⇧',
  'chevron.right': '›',
  stethoscope: '✚',
  'house.fill': '⌂',
};

type IconProps = Readonly<{
  name: IconName;
  size?: number;
  color: string;
  weight?: SymbolViewProps['weight'];
}>;

export function Icon({ name, size = 20, color, weight = 'regular' }: IconProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      fallback={
        <Text style={{ color, fontSize: size * 0.85, lineHeight: size, textAlign: 'center' }}>
          {fallbackGlyphs[name]}
        </Text>
      }
    />
  );
}
