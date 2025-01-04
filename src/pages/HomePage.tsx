import React from "react";

import { styled, keyframes, alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import QuickCalculator from "../components/QuickCalculator";
import * as Math from "../utils/math";

const shimmer = keyframes`
    from, 0% {
      background-position-x: 100%;
    }
    to, 100% {
      background-position-x: -100%;
    }
`;

const shimmerUp = keyframes`
from, 0% {
  background-position-y: 100%;
}
to, 100% {
  background-position-y: -100%;
}
`;

const ShimmerText = styled(Typography)(({ theme }) => {
  const color = theme.palette.success.light;
  const edgeShimmerColor = alpha(color, 0.7);
  const shimmerColor = alpha(color, 1);
  return {
    background: `linear-gradient(to right, ${edgeShimmerColor} 0%, ${shimmerColor} 50%, ${edgeShimmerColor} 100%)`,
    backgroundClip: "text",
    textFillColor: "transparent",
    backgroundSize: "200% auto",
    animation: `${shimmer} 4s linear infinite`,
  };
});

const ShimmerTextError = styled(Typography)(({ theme }) => {
  const color = theme.palette.primary.contrastText;
  const edgeShimmerColor = alpha(color, 0.7);
  const shimmerColor = alpha(theme.palette.error.light, 1);
  return {
    // backgroundImage: "url(https://i.makeagif.com/media/5-12-2017/GPeW0-.gif)",
    // backgroundSize: "cover",
    background: `linear-gradient(to top, ${edgeShimmerColor} 0%, ${shimmerColor} 50%, ${edgeShimmerColor} 100%)`,
    backgroundClip: "text",
    textFillColor: "transparent",
    // backgroundPositionY: -54,
    // textShadow: `0px 0px 1px ${alpha(theme.palette.common.white, 0.3)}`,
    // WebkitTextStroke: `0.2px ${theme.palette.common.white}`,
    // backgroundBlendMode: "",
    backgroundSize: "auto 200%",
    animation: `${shimmerUp} 4s linear infinite`,
  };
});

export default function HomePage() {
  return (
    <Stack direction={"column"}>
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        padding={2}
        sx={{
          background: (theme) =>
            `linear-gradient(${theme.palette.primary.dark}, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
          color: "primary.contrastText",
          width: "100%",
          minHeight: "60vh",
          pt: "128px",
        }}
        component={"section"}
      >
        <Typography variant="h4">
          Don't let your <ShimmerText as="span">Dream Home </ShimmerText>
          become a{" "}
          <ShimmerTextError as="span">Financial Nightmare</ShimmerTextError>
        </Typography>
        <Typography variant="body1">
          In just <i>30 seconds</i>, get a clear picture of your true home
          buying power - because lenders won't tell you when to stop.
        </Typography>
        <Paper sx={{ p: 2, m: 2, width: "md" }}>
          <QuickCalculator />
        </Paper>
      </Stack>
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          backgroundColor: "primary.light",
          color: "primary.contrastText",
          width: "100%",
          minHeight: "60vh",
          pt: "64px",
        }}
      >
        <Paper sx={{ p: 3, m: 3, width: "md", textAlign: "left" }}>
          <Typography variant="h4">What should my Down Payment be?</Typography>
          <Typography variant="body1">Explanation here</Typography>
        </Paper>
      </Stack>
      <Stack
        direction={"column"}
        alignItems="start"
        justifyContent="start"
        padding={2}
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          color: (theme) => theme.palette.text.primary,
          width: "100%",
          minHeight: "60vh",
          pt: "64px",
        }}
      >
        <Typography variant="h5" textAlign="left">
          What should my Down Payment be?
        </Typography>
        <Typography variant="body2">Explanation here</Typography>
      </Stack>
    </Stack>
  );
}
