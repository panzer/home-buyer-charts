import React from "react";
import { Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import { TooltipProps } from "@nivo/heatmap";

const NivoTooltip: React.FC<
  TooltipProps<{ x: number | string; y: number }>
> = ({ cell }) => {
  const { x, y, color, value, formattedValue } = cell;
  return (
    <Tooltip title={formattedValue} placement="top" arrow>
      <Paper
        sx={{ px: 1, py: 0.5 }}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "block",
            width: "12px",
            height: "12px",
            backgroundColor: color,
            margin: "4px",
          }}
        ></span>
        {formattedValue}
      </Paper>
    </Tooltip>
  );
};

export default NivoTooltip;
