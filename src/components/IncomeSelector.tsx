import React from 'react';

import DollarInput from './DollarInput';

interface IncomeSelectorProps {
  defaultValue?: number;
  onSelect?: (x: number) => void;
}

export default function IncomeSelector(props: IncomeSelectorProps) {
  const handleFormattedChange = (value: string) => {
    // Remove non-numeric characters for processing
    const numericValue = value.replace(/[^0-9]/g, '');
    props.onSelect?.(parseInt(numericValue, 10));
  };

  return (
    <DollarInput
      id="income-entry"
      label="Annual Income"
      defaultValue={props.defaultValue
        ?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      helpText="Your household, pre-tax income"
      step={1000}
      onChange={props.onSelect}
      outlinedInputProps={{
        inputProps: {
          // Format the value with commas as thousands separators
          pattern: '\\d{1,3}(,\\d{3})*',
        },
      }}
    />
  );
}
