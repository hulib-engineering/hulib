import type { SelectChangeEvent } from '@mui/material';
import { MenuItem, Select } from '@mui/material';

const CustomSelect = ({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: string[];
}) => {
  return (
    <Select
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 200,
            overflowY: 'auto',
          },
        },
      }}
      sx={{
        '&.MuiInputBase-root': {
          borderRadius: '20px !important',
          color: '#0858FA',
          border: '1px solid #C7C9CB',
        },
        '.MuiSelect-select': {
          padding: '8px 12px',
          paddingRight: '32px !important',
        },
        '.MuiOutlinedInput-root': {
          borderRadius: '8px !important',
        },
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: 0,
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            border: 0,
          },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
