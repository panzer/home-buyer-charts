import React from 'react';
import FormControl, {
  FormControlProps,
  useFormControl,
} from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

const FocusedFormHelperText: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { focused } = useFormControl() || {};

  const helperChildren = React.useMemo(() => {
    if (focused) {
      return children;
    }

    return undefined;
  }, [focused, children]);
  return <FormHelperText>{helperChildren}</FormHelperText>;
};

interface DollarInputProps {
  id: string;
  label: string;
  defaultValue?: string;
  step?: number;
  helpText?: string;
  onChange?: (value: number) => void;
  sx?: object;
  formControlProps?: FormControlProps;
  inputLabelProps?: InputLabelProps;
  outlinedInputProps?: Omit<
    OutlinedInputProps,
    'id' | 'label' | 'startAdornment'
  >;
}

const DollarInput: React.FC<DollarInputProps> = ({
  id,
  label,
  defaultValue,
  step,
  helpText,
  onChange,
  sx,
  formControlProps,
  inputLabelProps,
  outlinedInputProps,
}) => {
  return (
    <FormControl
      {...formControlProps}
      sx={{ m: 1, minWidth: '10ch', maxWidth: '20ch', ...sx }}
    >
      <InputLabel {...inputLabelProps} htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        // endAdornment={<InputAdornment position="end">k</InputAdornment>}
        label={label}
        defaultValue={defaultValue}
        onChange={event => {
          console.log('event', event.target.value);
          onChange?.(Number.parseFloat(event.target.value.replace(/,/g, '')));
        }}
        {...outlinedInputProps}
        inputProps={{
          step: step,
          type: 'text',
          inputMode: 'numeric',
          pattern: '[0-9]*',
          ...outlinedInputProps?.inputProps,
        }}
      />
      <FocusedFormHelperText>{helpText}</FocusedFormHelperText>
    </FormControl>
  );
};

export default DollarInput;
