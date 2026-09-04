import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
  | 'info.circle'
  | 'info.circle.fill'
  | 'exclamationmark.triangle.fill'
  | 'exclamationmark.octagon.fill'
  | 'link'
  | 'arrow.up.right'
  | 'checkmark'
  | 'square.and.arrow.up'
  | 'chevron.right'
  | 'chevron.down'
  | 'chevron.up'
  | 'chevron.up.chevron.down'
  | 'xmark'
  | 'stethoscope'
  | 'house.fill'
  | 'magnifyingglass'
  | 'star'
  | 'star.fill'
  | 'doc.on.doc'
  | 'checkmark.circle.fill';

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

/** High-fidelity vector icons for Android/web where SF Symbols are unavailable. */
const vectorGlyphs: Readonly<Record<IconName, MaterialIconName>> = {
  'lungs.fill': 'lungs',
  'drop.fill': 'water',
  'bandage.fill': 'bandage',
  'cross.case.fill': 'medical-bag',
  'figure.child': 'human-child',
  'wrench.and.screwdriver.fill': 'tools',
  'arrow.left.and.right': 'swap-horizontal',
  'calendar.badge.clock': 'calendar-clock',
  'chart.bar.doc.horizontal': 'chart-box-outline',
  percent: 'percent',
  'books.vertical.fill': 'book-multiple',
  'list.number': 'format-list-numbered',
  'circle.lefthalf.filled': 'circle-half-full',
  'arrow.triangle.branch': 'source-branch',
  'info.circle': 'information-outline',
  'info.circle.fill': 'information',
  'exclamationmark.triangle.fill': 'alert',
  'exclamationmark.octagon.fill': 'alert-octagon',
  link: 'link-variant',
  'arrow.up.right': 'arrow-top-right',
  checkmark: 'check',
  'square.and.arrow.up': 'export-variant',
  'chevron.right': 'chevron-right',
  'chevron.down': 'chevron-down',
  'chevron.up': 'chevron-up',
  'chevron.up.chevron.down': 'unfold-more-horizontal',
  xmark: 'close',
  stethoscope: 'stethoscope',
  'house.fill': 'home',
  magnifyingglass: 'magnify',
  star: 'star-outline',
  'star.fill': 'star',
  'doc.on.doc': 'content-copy',
  'checkmark.circle.fill': 'check-circle',
};

type IconProps = Readonly<{
  name: IconName;
  size?: number;
  color: string;
  weight?: SymbolViewProps['weight'];
}>;

export function Icon({ name, size = 20, color, weight = 'regular' }: IconProps) {
  if (Platform.OS !== 'ios') {
    const vectorName = vectorGlyphs[name];
    return <MaterialCommunityIcons name={vectorName} size={size} color={color} />;
  }

  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      fallback={<MaterialCommunityIcons name={vectorGlyphs[name]} size={size} color={color} />}
    />
  );
}

