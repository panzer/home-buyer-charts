import { LegendProps } from '@nivo/legends';
import { getOrdinalColorScale, OrdinalColorScaleConfig } from '@nivo/colors';

type LegendWrappingOptions<T> = {
  itemsPerLine?: number | 'no-wrap';
  indexBy?: keyof T;
  legendProps?: Partial<LegendProps>;
  translateY?: number;
  translateX?: number;
  colors?: OrdinalColorScaleConfig;
};
const defaultLegendProps: LegendProps = {
  anchor: 'bottom',
  direction: 'row',
  itemWidth: 30,
  itemHeight: 12,
  itemsSpacing: 25,
};
type DataPoint = { [k: string]: string | number } & { color?: string };
export default function wrappedLegend<T extends DataPoint>(
  chartData: T[],
  options?: LegendWrappingOptions<T>,
): LegendProps[] {
  const {
    itemsPerLine = 3,
    indexBy = 'id',
    legendProps = {},
    translateX = 0,
    translateY = 0,
    colors = { scheme: 'nivo' },
  } = options ?? {};
  const lp: LegendProps = { ...defaultLegendProps, ...legendProps };

  if (itemsPerLine === 'no-wrap') {
    return [lp];
  }

  const getColor = getOrdinalColorScale(colors, 'id');

  const nItems = chartData.length;
  const nRows = Math.ceil(nItems / itemsPerLine);
  const yStep = (legendProps?.itemHeight ?? 18) + 4;
  const xStep = 0;
  return Array(nRows)
    .fill(0)
    .map((_, index) => ({
      ...lp,
      translateY: translateY + yStep * index,
      translateX: translateX + xStep * index,
      data: chartData
        .slice(itemsPerLine * index, itemsPerLine * (index + 1))
        .map((cur, j) => {
          const id = cur[indexBy as keyof T];
          const dataPoint = chartData[index * itemsPerLine + j];
          return {
            id: id,
            label: id,
            color: dataPoint.color ?? getColor(dataPoint),
          };
        }),
    }));
}
