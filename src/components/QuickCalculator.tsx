import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import IncomeSelector from './IncomeSelector';
import CashOnHandSelector from './CashOnHandSelector';
import StateZipSelector from './StateZipSelector';

const QuickCalculator = () => {
  const navigate = useNavigate();
  const [annualIncome, setAnnualIncome] = useState('');
  const [cashAvailable, setCashAvailable] = useState('');
  const [stateOrZip, setStateOrZip] = useState('');
  const [openHelper, setOpenHelper] = useState(false);
  const [helperText, setHelperText] = useState('');

  const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualIncome(event.target.value.replace(/[^0-9]/g, ''));
  };

  const handleCashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCashAvailable(event.target.value.replace(/[^0-9]/g, ''));
  };

  const handleStateOrZipChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStateOrZip(event.target.value);
  };

  const handleHelperOpen = (text: string) => {
    setHelperText(text);
    // setOpenHelper(true);
  };

  const handleHelperClose = () => {
    setOpenHelper(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <TextField
        label="Annual Income (in thousands)"
        value={annualIncome}
        onChange={handleIncomeChange}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
        helperText="Enter your total annual income before taxes."
        onFocus={() =>
          handleHelperOpen(
            "Your annual income helps us determine how much you can afford to spend on a home."
          )
        }
      /> */}
      <IncomeSelector onSelect={x => setAnnualIncome(String(x))} />
      {/* <TextField
        label="Cash Available"
        value={cashAvailable}
        onChange={handleCashChange}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
        helperText="Enter the total amount of cash you have available for the down payment."
        onFocus={() =>
          handleHelperOpen(
            "The cash available for a down payment affects your loan options and interest rates."
          )
        }
      /> */}
      <CashOnHandSelector onSelect={x => setCashAvailable(String(x))} />

      {/* <StateZipSelector onSelect={(x) => setStateOrZip(x)} /> */}
      <div style={{ width: 'auto' }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: theme =>
              `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
          }}
          onClick={() =>
            navigate(`/report?i=${annualIncome}&c=${cashAvailable}`)
          }
        >
          Get Your Results
        </Button>
      </div>

      <Dialog open={openHelper} onClose={handleHelperClose}>
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <DialogContentText>{helperText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelperClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default QuickCalculator;
