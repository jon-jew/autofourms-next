import React from 'react';
import { Controller } from "react-hook-form";

import TextField from '@mui/material/TextField';

const FormTextField = ({
  name,
  control,
  label,
  width,
  rules,
  type,
  disabled,
  multiline,
  isOnBlur,
  onChange: _onChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => {
        const handleChange = _onChange ? _onChange : onChange;
        return (
          <TextField
            helperText={error ? error.message : null}
            sx={{ width: width }}
            disabled={disabled}
            type={type}
            size="small"
            error={!!error}
            onChange={isOnBlur ? null : handleChange}
            onBlur={isOnBlur ? handleChange : null}
            defaultValue={value}
            multiline={multiline}
            label={label}
            variant="outlined"
          />
        )
      }}
    />
  );
};

export default FormTextField;
