import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Controller } from "react-hook-form";

const filter = createFilterOptions();

export default function FreeSoloCreateOption({
  name,
  control,
  label,
  // disableOption,
  isOnBlur,
  freeSolo,
  options,
  width,
  onChange: _onChange
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => {
        const handleChange = (event, newValue) => {
          if (typeof newValue === 'object' && newValue !== null)
            onChange(newValue.label);
          else
            onChange(newValue);
          _onChange();
        };
        return (
          <Autocomplete
            size="small"
            value={value}
            onBlur={isOnBlur ? handleChange : null}
            onChange={isOnBlur ? null : handleChange}
            id="free-solo-with-text-demo"
            options={options}
            clearOnBlur={freeSolo ? false : false}
            clearOnEscape={freeSolo ? false : true}
            sx={{ width: width }}
            freeSolo={freeSolo}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (freeSolo) {
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                  filtered.push(`${inputValue}`);
                }
              }
              return filtered;

            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ margin: 0 }}
                margin="normal"
                label={label}
              />
            )}
          />
        );
      }}
    />
  );
}
