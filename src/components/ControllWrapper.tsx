import React, { FC, PropsWithChildren } from "react";
import Box from "@mui/material/Box";

const ControlWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ width: 300, textAlign: "left", margin: 1 }}>{children}</Box>
  );
};

export default ControlWrapper;
