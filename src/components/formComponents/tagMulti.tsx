import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";


const values = [
    {
        'name': 'K Swap',
        'count': 2
    },
    {
        'name': 'B Swap',
        'count': 24
    },
    {
        'name': 'Rotary',
        'count': 25
    },
];

export default function TagMulti(
    { name, control, label, option }:
        {
            name: string,
            control: any,
            label: string,
            option?: string[],
        }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => {
                return (

                    <Autocomplete
                        multiple
                        id="tags-filled"
                        options={values.map((value) => value.name)}
                        onChange={(event, newValue) => onChange(newValue)}
                        fullWidth
                        sx={{ maxWidth: '642px', minWidth: '300px' }}
                        value={value}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            <div style={{ flexBasis: '100%' }}>
                                {value.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({ index });
                                    return (
                                        <Chip variant="outlined" label={option} key={key} {...tagProps} />
                                    )
                                })}
                            </div>
                        }
                        renderOption={(props, option, state) =>
                            <li {...props}>
                                <Chip label={values[state.index].count} size="small" />
                                {option}
                            </li>
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                label={<span><LocalOfferIcon /> Tags</span>}
                                placeholder="Enter Tags"
                            />
                        )}
                    />
                )
            }}
        />
    );
}

