import React from 'react';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled, darken, lighten } from '@mui/material/styles';

import ItemRow, { ItemRowType } from './ExpenseItemRow';

const AlternatingRowsContainer = styled(Grid)(
  ({ theme }) => `
    > div:nth-of-type(even) {
      background-color: ${
        theme.palette.mode === 'dark'
          ? lighten(theme.palette.background.paper, 0.03)
          : darken(theme.palette.background.paper, 0.05)
      };
    }
    > div:hover {
      transition: background-color 400ms 100ms;
      background-color: ${theme.palette.action.selected};
    }
    > div:hover button {
     transition: color 400ms 100ms;
      color: ${theme.palette.text.primary};
    }
  `,
);

const AssumptionSection: React.FC<{
  subtitle: string;
  rows: ItemRowType[];
}> = ({ subtitle, rows }) => {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
      }}
      columns={6}
      component={Paper}
      // container
      // variant="outlined"
      padding={1}
    >
      <Grid size={'grow'}>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Grid>

      <AlternatingRowsContainer container size="grow" columns={6}>
        {rows.map((itemRow, index) => (
          <ItemRow {...itemRow} key={index} />
        ))}
      </AlternatingRowsContainer>
    </Grid>
  );
};

export default AssumptionSection;
