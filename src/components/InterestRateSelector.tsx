import * as React from "react";
import NumericValueSelector from "./NumericValueSelector";

interface InterestRateSelectorProps {
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  onSelect: (x: number) => void;
}

export default function InterestRateSelector(props: InterestRateSelectorProps) {
  return (
    <NumericValueSelector
      title="Interest Rate"
      valueSuffix="%"
      minValue={3}
      maxValue={8}
      step={0.1}
      defaultValue={props.defaultValue}
      onSelect={props.onSelect}
    />
  );
}
