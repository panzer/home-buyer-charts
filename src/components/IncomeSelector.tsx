import React from "react";
import TextField from "@mui/material/TextField";

interface IncomeSelectorProps {
  defaultValue: number;
  onSelect: (x: number) => void;
}

export default function IncomeSelector(props: IncomeSelectorProps) {
  return (
    <TextField
      id="income-entry"
      label="Annual Income ($)"
      type="number"
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      defaultValue={props.defaultValue}
      onChange={(event) => props?.onSelect(Number(event.target.value))}
    />
  );
}
