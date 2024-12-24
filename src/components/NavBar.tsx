import React from "react";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import CottageIcon from "@mui/icons-material/Cottage";
import QueryStats from "@mui/icons-material/QueryStats";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <CottageIcon sx={{ m: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
            }}
          >
            Home Buyer Charts
          </Typography>
          <Button color="inherit" title="Explorer" href="/explore">
            <QueryStats sx={{ m: 1 }} />
            Explore
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
