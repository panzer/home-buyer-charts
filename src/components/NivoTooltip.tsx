import React from 'react';
import { Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import { TooltipProps } from '@nivo/heatmap';
import { PointTooltipProps } from '@nivo/line';

type CustomTooltipProps = {
  formattedValue?: string | null;
  color: string;
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  formattedValue,
  color,
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
      <span
        style={{
          display: 'block',
          width: '12px',
          height: '12px',
          backgroundColor: color,
          margin: '4px',
        }}
      ></span>
      {formattedValue}
    </Paper>
  </Tooltip>
);

type NTProp =
  | TooltipProps<{ x: number | string; y: number }>
  | PointTooltipProps;

function NivoTooltip<T extends NTProp>(props: T): React.ReactNode {
  if ('cell' in props) {
    const { x, y, color, value, formattedValue } = props.cell;
    return <CustomTooltip formattedValue={formattedValue} color={color} />;
  }
  if ('point' in props) {
    const { color, data, serieId } = props.point;
    return (
      <CustomTooltip
        formattedValue={`${serieId} | ${data.yFormatted}`}
        color={color}
      />
    );
  }
}

export default NivoTooltip;
