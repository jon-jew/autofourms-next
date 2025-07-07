import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Controller } from "react-hook-form";

const filter = createFilterOptions();

interface FreeSolo {
  name: string,
  control: any,
  label: string,
  isOnBlur?: boolean,
  freeSolo?: boolean,
  options: string[],
  width?: number,
  onChange?: any,
};

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
}: FreeSolo) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => {
        const handleChange = (event: any, newValue: any) => {
          if (typeof event.target.value === 'object' && event.target.value !== null)
            onChange(event.target.value.label);
          else
            onChange(event.target.value);
          _onChange();
        };
        return (
          <Autocomplete
            size="small"
            value={value}
            //@ts-ignore
            onBlur={isOnBlur ? handleChange : undefined}
            onChange={isOnBlur ? undefined : handleChange}
            id={name}
            options={options}
            clearOnBlur={freeSolo ? false : false}
            clearOnEscape={freeSolo ? false : true}
            sx={{ width: width }}
            freeSolo={freeSolo}
            //@ts-ignore
            filterOptions={(options, params) => {
              //@ts-ignore
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
