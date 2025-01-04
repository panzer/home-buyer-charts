import React from "react";

import { styled, alpha } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import CottageIcon from "@mui/icons-material/Cottage";
import QueryStats from "@mui/icons-material/QueryStats";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

export default function NavBar(props: { position?: "fixed" | "static" }) {
  return (
    <AppBar
      position={props.position || "fixed"}
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 20px)",
      }}
    >
      <Container maxWidth="md">
        <StyledToolbar variant="dense">
          <Stack direction="row" alignItems="center" component="a" href="/">
            <CottageIcon color="info" sx={{ m: 1 }} />
            <Typography
              variant="h6"
              color="info"
              noWrap
              sx={{
                mr: 2,
              }}
            >
              Home Buyer Charts
            </Typography>
          </Stack>

          <Button title="Explorer" href="/explore" color="info" variant="text">
            <QueryStats sx={{ m: 1 }} />
            Explore
          </Button>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
