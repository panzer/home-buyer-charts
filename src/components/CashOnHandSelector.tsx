import * as React from "react";
import DollarInput from "./DollarInput";

interface CashOnHandSelectorProps {
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  onSelect: (x: number) => void;
}

export default function CashOnHandSelector(props: CashOnHandSelectorProps) {
  return (
    <DollarInput
      id="savings-entry"
      label="Cash Saved"
      defaultValue={props.defaultValue
        ?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      helpText="Liquid assets, saved for down payment and emergencies in thousands."
      step={1000}
      onChange={props.onSelect}
      outlinedInputProps={{
        inputProps: {
          // Format the value with commas as thousands separators
          pattern: "\\d{1,3}(,\\d{3})*",
        },
      }}
    />
  );
}
