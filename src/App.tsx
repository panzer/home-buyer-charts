import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

import Heatmaps from "./pages/Heatmaps";
import HomePage from "./pages/HomePage";
import MyResponsiveBar from "./pages/NivoTester";
import AffordabilityReport from "./pages/AffordabilityReport";
import PageWithNavBar from "./pages/PageWithNavBar";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: blueGrey[500],
          },
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [prefersDarkMode]
  );

  return (
    <div className="App">
      {/* <NavBar />
      <Outlet /> */}
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageWithNavBar />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<Heatmaps />} />
              <Route path="/nivo" element={<MyResponsiveBar />} />
              <Route path="/report" element={<AffordabilityReport />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
