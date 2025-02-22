import React from 'react';
import { Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import { TooltipProps } from '@nivo/heatmap';
import { PointTooltipProps } from '@nivo/line';
import { BarTooltipProps } from '@nivo/bar';

type CustomTooltipProps = {
  formattedValue?: string | null;
  color: string;
  bgImage?: string;
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  formattedValue,
  color,
  bgImage,
}) => (
  <Tooltip title={formattedValue} placement="top" arrow>
    <Paper
      sx={{ px: 1, py: 0.5 }}
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="12" height="12" style={{ marginRight: 4 }}>
        <rect
          width="12"
          height="12"
          rx={0}
          ry={0}
          fill={bgImage ?? color}
          strokeWidth={0}
          stroke={color}
          focusable="false"
        />
      </svg>
      {formattedValue}
    </Paper>
  </Tooltip>
);

type NTProp =
  | TooltipProps<{ x: number | string; y: number }>
  | PointTooltipProps
  | BarTooltipProps<unknown>;

function NivoTooltip<T extends NTProp>(props: T): React.ReactNode {
  console.log('tooltip', props);
  if ('cell' in props) {
    const { x, y, color, value, formattedValue } = props.cell;
    return <CustomTooltip formattedValue={formattedValue} color={color} />;
  }
  if ('point' in props) {
    console.log('point', props.point);
    const { serieColor, data, serieId } = props.point;
    return (
      <CustomTooltip
        formattedValue={`${serieId} | ${data.yFormatted}`}
        color={serieColor}
      />
    );
  }
  return (
    <CustomTooltip
      formattedValue={`${props.id} | ${props.formattedValue}`}
      color={props.color}
      bgImage={props.fill}
    />
  );
}

export default NivoTooltip;
