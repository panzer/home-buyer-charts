import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { locationOptions } from "../utils/locations"; // Replace with the actual path to your data source

interface StateZipSelectorProps {
  onSelect: (value: string) => void;
  slotProps?: {
    textField?: object;
  };
}

const StateZipSelector: React.FC<StateZipSelectorProps> = ({
  onSelect,
  slotProps,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    setInputValue(value);
    // Filter for states or zip codes based on input
    const filteredOptions = locationOptions.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    );
    setOptions(filteredOptions);
  };

  const handleOptionSelected = (
    _event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value) {
      onSelect(value);
    }
  };

  const isValidUSAStateOrZip = (value: string): boolean => {
    // Implement validation logic for USA states and zip codes
    return locationOptions.includes(value);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleOptionSelected}
      renderInput={(params) => (
        <TextField
          {...params}
          {...slotProps?.textField}
          label="State or Zip Code"
          helperText="Enter the state or zip code where you plan to buy a home."
          error={!isValidUSAStateOrZip(inputValue)}
          FormHelperTextProps={{
            error: !isValidUSAStateOrZip(inputValue),
          }}
        />
      )}
    />
  );
};

export default StateZipSelector;
