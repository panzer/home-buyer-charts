import * as React from "react";
import NumericValueSelector from "./NumericValueSelector";

interface CashOnHandSelectorProps {
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  onSelect: (x: number) => void;
}

export default function CashOnHandSelector(props: CashOnHandSelectorProps) {
  return (
    <NumericValueSelector
      title="Cash On Hand"
      valuePrefix="$"
      minValue={30_000}
      maxValue={300_000}
      step={2_000}
      defaultValue={props.defaultValue}
      onSelect={props.onSelect}
    />
  );
}
