import React from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

interface IncomeSelectorProps {
  defaultValue: number;
  onSelect: (x: number) => void;
}

export default function IncomeSelector(props: IncomeSelectorProps) {
  const id = "income-entry";
  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel htmlFor={id}>Annual Income</InputLabel>
      <OutlinedInput
        id={id}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        label="Annual Income"
        defaultValue={props.defaultValue}
        onChange={(event) => props?.onSelect(Number(event.target.value))}
        slotProps={{ input: { step: 1000, type: "number" } }}
      />
    </FormControl>
    // <OutlinedInput
    //   id="income-entry"
    //   label="Annual Income ($)"
    //   type="number"
    //   slotProps={{
    //     inputLabel: {
    //       shrink: true,
    //     },
    //     htmlInput: {
    //       step: 1000,
    //     },
    //   }}
    //   startAdornment={}
    //   defaultValue={props.defaultValue}
    //   onChange={(event) => props?.onSelect(Number(event.target.value))}
    // />
  );
}
