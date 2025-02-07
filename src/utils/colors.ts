import { useTheme, Palette, PaletteColor } from '@mui/material/styles';

// type MaterialColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
// Type that defines, keys of Palette where the value of that key is PaletteColor. Without hard coding specific keys
type MaterialColor = {
  [K in keyof Palette]: Palette[K] extends PaletteColor ? K : never;
}[keyof Palette];

/**
 * A hook that returns a hex color value from either a Material UI theme color or a direct hex value
 * @param color - Material UI color key or hex color string
 * @returns hex color string
 */
export const useThemeColor = (color: MaterialColor | string) => {
  const theme = useTheme();
  // type predicate for MaterialColor
  const isMaterialColor = (color: string): color is MaterialColor => {
    return (
      Object.keys(theme.palette).includes(color) &&
      theme.palette[color as MaterialColor] instanceof Object
    );
  };
  if (isMaterialColor(color)) {
    try {
      return theme.palette[color].main;
    } catch (error) {}
  }
  return color;
};
