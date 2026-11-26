import type { Color } from '@annotorious/react';

// https://spectrum.adobe.com/page/color-for-data-visualization/
export const AdobeCategorical12: Color[] = [
  '#11b5ae', // cyan
  '#4046ca', // dark blue
  '#f68512', // orange
  '#f22483', // pink
  '#7e84fa', // light blue
  '#72e06a', // green
  '#167af3', // blue
  '#7326d3', // purple
  '#e8c600', // yellow
  '#cb5d02', // brown
  '#008f5d', // dark green
  '#bce931', // mint
];

export const createPalette = (palette: Color[]) => {
  const assignedColors = new Map<string, Color>();

  let nextIndex = 0;

  const getColor = (key: string) => {
    const assigned = assignedColors.get(key);
    if (assigned) return assigned;

    // Assign next free color
    const nextColor = palette[nextIndex];

    assignedColors.set(key, nextColor);

    nextIndex = (nextIndex + 1) % palette.length;

    return nextColor;
  };

  return {
    getColor,
  };
};
