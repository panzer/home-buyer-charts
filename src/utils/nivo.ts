import { LegendProps } from "@nivo/legends";

type LegendWrappingOptions<T> = {
    itemsPerLine?: number,
    indexBy?: keyof T,
    legendProps?: Partial<LegendProps>,
    translateY?: number,
    translateX?: number;
}
const defaultLegendProps: LegendProps = {
    anchor: "bottom", direction: "row", itemWidth: 30, itemHeight: 12,
    itemsSpacing: 25,
}
export function wrappedLegend<T extends {[k: string]: string | number}>(chartData: T[], options?: LegendWrappingOptions<T>): LegendProps[] {
    const {itemsPerLine = 3, indexBy = "id", legendProps = {}, translateX = 0, translateY = 0} = options ?? {};
    const lp: LegendProps= {...defaultLegendProps, ...legendProps};

    const nItems = chartData.length;
    const nRows = Math.ceil(nItems / itemsPerLine);
    const yStep = (legendProps?.itemHeight ?? 18) + 4;
    const xStep = 0;
    return Array(nRows).fill(0).map(
        (_, index) => (
            {...lp, translateY: translateY + (yStep * index), translateX: translateX + (xStep * index),
                data: chartData.slice(itemsPerLine * index, itemsPerLine * (index + 1))
                .map((cur, i) => {
                    const id = cur[indexBy as keyof T];
                    return {id: id, label: id, color: "#fff"}
                })
            }
        ))
}