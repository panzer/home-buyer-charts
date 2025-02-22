import React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import PercentagePie, { PercentagePieProps } from '../PercentagePie';
import { Typography } from '@mui/material';

type BudgetTableRowProps = {
  name: string;
  value: string;
  percentage?: number;
  percentageProps?: Partial<PercentagePieProps>;
};

const BudgetTableRow: React.FC<BudgetTableRowProps> = ({
  name,
  value,
  percentage,
  percentageProps,
}) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row" size="small">
        {name}
      </TableCell>
      <TableCell align="right">
        <Box
          sx={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Typography fontFamily="monospace" variant="body2">
            {value}
          </Typography>
          {percentage !== undefined && (
            <>
              &nbsp;
              <PercentagePie percentage={percentage} {...percentageProps} />
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default BudgetTableRow;
