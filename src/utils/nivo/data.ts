import { Serie } from '@nivo/line';

import { lesserOf } from '../math';

export function minimumAcrossSeries(dataLine: Serie[]) {
  return dataLine.reduce((lowestOverall, series) => {
    const seriesLow = series.data.reduce((lowestInSeries, p) => {
      // Skip undefined or null values
      if (p.y === undefined || p.y === null) return lowestInSeries;
      // Ensure we're working with numbers
      const yValue = Number(p.y);
      return lesserOf(lowestInSeries, yValue);
    }, Number.MAX_VALUE);
    return lesserOf(lowestOverall, seriesLow);
  }, Number.MAX_VALUE);
}
