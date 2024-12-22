import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function valuetext(value: number) {
  return `${value}°C`;
}

interface DownPaymentSelectorProps {
  minValue?: number;
  maxValue?: number;
  defaultLowerValue: number;
  defaultUpperValue: number;
  onSelectLower: (x: number) => void;
  onSelectUpper: (x: number) => void;
}

export default function DownPaymentSelector(props: DownPaymentSelectorProps) {
  const [value, setValue] = React.useState<number[]>([
    props.defaultLowerValue,
    props.defaultUpperValue,
  ]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue != "number") {
      setValue(newValue);
      props.onSelectLower?.(newValue[0] * 1000);
      props.onSelectUpper?.(newValue[1] * 1000);
    }
  };

  return (
    <Box sx={{ width: 300, textAlign: "left", margin: 4 }}>
      <Typography id="input-slider" gutterBottom>
        Down Payment: ${value[0]}-{value[1]}k
      </Typography>
      <Slider
        aria-label="Down Payment (thousands of dollars)"
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={props.minValue || 50}
        max={props.maxValue || 500}
      />
    </Box>
  );
}
