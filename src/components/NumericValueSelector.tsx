import * as React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import ControlWrapper from "./ControllWrapper";

interface NumericValueSelectorProps {
  title: string;
  valuePrefix?: string;
  valueSuffix?: string;
  minValue: number;
  maxValue: number;
  step: number;
  defaultValue: number;
  onSelect: (x: number) => void;
}

export default function NumericValueSelector(props: NumericValueSelectorProps) {
  const [value, setValue] = React.useState<number>(props.defaultValue);

  function valuetext(value: number) {
    return `${props.valuePrefix}${value}${props.valueSuffix}`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
      props.onSelect?.(newValue);
    }
  };

  return (
    <ControlWrapper>
      <Typography id="input-slider" gutterBottom>
        {props.title}: {props.valuePrefix}
        {value}
        {props.valueSuffix}
      </Typography>
      <Slider
        aria-label={`${props.title}`}
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={props.step}
        marks
        min={props.minValue}
        max={props.maxValue}
      />
    </ControlWrapper>
  );
}
