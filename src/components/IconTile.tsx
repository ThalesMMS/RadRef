import { StyleSheet, View } from 'react-native';
import { radii, surfaceTint, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

type IconTileProps = Readonly<{
  name: IconName;
  color: string;
  /** Outer tile size in points. */
  size?: number;
}>;

/** Accent glyph on a softly tinted rounded tile — calmer than a saturated fill. */
export function IconTile({ name, color, size = 32 }: IconTileProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size <= 32 ? radii.sm + 1 : radii.md,
          backgroundColor: surfaceTint(theme, color),
        },
      ]}
    >
      <Icon name={name} size={Math.round(size * 0.52)} color={color} weight="medium" />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
