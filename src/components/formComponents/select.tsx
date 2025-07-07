import { Controller } from "react-hook-form";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface SelectProps {
  name: string;
  control: any;
  label: string;
  options: string[] | number[] | { value: string | number, label: string | number }[];
  width?: number;
  disabled?: boolean;
  onChange?: any;
};

const FormSelectField = ({
  name,
  control,
  label,
  options,
  // getOptionDisabled,
  width,
  disabled,
  onChange: oc,
}: SelectProps) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <FormControl size="small">
          <InputLabel id="demo-select-small-label">{label}</InputLabel>
          <Select
            labelId="demo-select-small-label"
            size="small"
            sx={{ width: width, minWidth: "100px" }}
            id="demo-select-small"
            value={value}
            disabled={disabled}
            // getOptionDisabled={getOptionDisabled}
            error={!!error}
            label="Age"
            onChange={(newValue) => {
              if (typeof newValue.target === 'object' && newValue.target !== null)
                onChange(newValue.target.value);
              else
                onChange(newValue.target);
              if (oc) oc(newValue);
            }}
          >
            {options.map((option) => {
              if (typeof option === 'object')
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              else
                return <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
            })}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default FormSelectField;
