import React from "react";

import { Outlet } from "react-router";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import NavBar from "../components/NavBar";

function PageWithNavBar() {
  return (
    <Paper elevation={0} square>
      <Stack gap={3}>
        <NavBar position="static" />
        <Outlet />
      </Stack>
    </Paper>
  );
}

export default PageWithNavBar;
