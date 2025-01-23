import React from "react";

import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export type ItemRowType = {
    name: string;
    value: string;
    datum?: string;
    onClick?: () => void;
    subItems?: ItemRowType[];
    indent?: number;
  };

const ItemRow: React.FC<ItemRowType> = (itemRow: ItemRowType) => {
    const nameString = "   ".repeat(itemRow.indent ?? 0) + itemRow.name
    const name = itemRow.onClick ? (
      <Typography variant="body2" align="left">
        <Link component="button" color="info" onClick={itemRow.onClick}>
          {nameString}
        </Link>
      </Typography>
    ) : (
      <Typography variant="body2" align="left">
        {nameString}
      </Typography>
    );
    return (
    //   <Grid container columns={6} size={6} borderRadius={0.5} \>
    <>
        <Grid container size={6} columns={6} paddingX={{ xs: 1, md: 3 }} borderRadius={0.5}>
          <Grid size={3}>{name}</Grid>
          <Grid size={1}>
            <Typography variant="body2" align="right">
              {itemRow.value}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography
              variant="body2"
              align="right"
              fontStyle="italic"
              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              {itemRow.datum}
            </Typography>
          </Grid>
        </Grid>
        {itemRow.subItems?.map((subItemRow, index) =>
          <ItemRow { ...subItemRow} name={"↳ " + subItemRow.name} indent={subItemRow.indent ?? (itemRow.indent != undefined ? itemRow.indent + 1 : 0)} key={index}/>
        )}
        {/* </Grid> */}
        </>
    );
  }

  export default ItemRow;