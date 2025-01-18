import React from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/system";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  innerSx?: SxProps<Theme>;
}

export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, innerSx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: 1 }, ...innerSx }}>{children}</Box>
      )}
    </div>
  );
}
