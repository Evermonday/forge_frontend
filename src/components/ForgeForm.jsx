import { styled } from '@mui/material/styles';
import {
  Box,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { nanoid } from 'nanoid';
import { FormControl, Select, MenuItem, Stack } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ArrowDownward,
  BorderRight,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useEffect } from 'react';
export const ForgeFieldLabel = styled(Typography)({
  fontSize: '16px',
  color: '#6C757D',
  fontWeight: 400,
  marginBottom: '4px',
});

const CustomForgeToggle = styled(ToggleButtonGroup)({
  border: 'solid 1px #ABB5BE',
  borderRadius: '6px !important',
});
// const CustomToggleButton = styled(ToggleButton)(({}) => ({
//   padding: '8px 28px',
//   textTransform: 'capitalize',
// }));
const CustomToggleButton = styled(ToggleButton)(({ selected }) => ({
  padding: selected ? '10px 20px 10px 36px' : '10px 28px',
  textTransform: 'capitalize',
  backgroundColor: 'transparent !important',
  '&.Mui-selected': {
    backgroundColor: 'transparent !important',
    fontWeight: 600,
  },

  '&.MuiToggleButtonGroup-grouped': {
    border: 'none !important',
    borderRight: '1px solid #ABB5BE !important',
  },
  '&.MuiToggleButtonGroup-grouped:last-of-type': {
    border: 'none !important',
  },
}));

const CustomTextField = styled(TextField)({
  border: 'solid 1px #ABB5BE',
  borderRadius: '6px',
  marginBottom: 1,
  width: '100%',
  '& .MuiInputBase-root.Mui-disabled': {
    backgroundColor: '#e9ecef',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'League Spartan',
    padding: '10px 16px',
    fontSize: '18px',
    color: '#54595E',
    fontWeight: 600,
    '&.Mui-disabled': {
      color: '#abb5be',
      WebkitTextFillColor: '#abb5be',
    },
  },
});
const CustomTextArea = styled(TextField)({
  border: 'solid 1px #ABB5BE',
  borderRadius: '6px',
  marginBottom: 1,

  width: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-root': {
    padding: '0 ',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'League Spartan',
    padding: '14px 12px',
    fontSize: '18px',
    color: '#54595E',
    fontWeight: 500,
  },
});

const CustomSelect = styled(Select)({
  border: 'solid 1px #ABB5BE',
  borderRadius: '6px',
  width: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-root': {
    padding: '0 ',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'League Spartan',
    padding: '14px 16px 6px 16px',
    fontSize: '18px',
    color: '#54595E',
    fontWeight: 600,
  },
  '& .MuiSvgIcon-root': {
    // background: 'red',
    marginRight: '10px',
    fontSize: '29px',
  },
});

export const ForgeField = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  InputProps,
  disabled = false,
  textArea = false,
  placeholder = null,
}) => {
  return (
    <>
      <ForgeFieldLabel>{label}</ForgeFieldLabel>
      {textArea ? (
        <CustomTextArea
          type={type == 'decimal' ? 'number' : type}
          id={name}
          variant='outlined'
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          InputProps={InputProps}
          sx={{
            fontFamily: 'League Spartan',
          }}
          multiline
          rows={4}
          placeholder={placeholder}
        />
      ) : (
        <CustomTextField
          type={type == 'decimal' ? 'number' : type}
          id={name}
          variant='outlined'
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          InputProps={InputProps}
          sx={{
            fontFamily: 'League Spartan',
          }}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export const ForgeSelect = ({ label, name, onChange, value, list }) => {
  // useEffect(() => {
  //   if (list?.length && !value) {
  //     onChange({
  //       target: {
  //         name,
  //         value: typeof list[0] === 'object' ? list[0].value : list[0],
  //       },
  //     });
  //   }
  // }, [list]);
  return (
    <FormControl fullWidth>
      <ForgeFieldLabel>{label}</ForgeFieldLabel>
      <CustomSelect
        id={value.id}
        name={name}
        value={value}
        onChange={onChange}
        IconComponent={() => <KeyboardArrowDown sx={{ color: '#lightgray' }} />}
      >
          { list.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                sx={{
                  fontFamily: 'League Spartan',
                }}
              >
                {item.name}
              </MenuItem>
            ))
          }
      </CustomSelect>
    </FormControl>
  );
};

//TODO: Count the list, determine the type
export const EnumSelect = ({ label, onChange, selectedItem, list }) => {
  return (
    <FormControl fullWidth>
      <ForgeFieldLabel>{label}</ForgeFieldLabel>
      <CustomSelect
        // id={value.id}
        name={label}
        value={selectedItem}
        onChange={onChange}
        IconComponent={() => <KeyboardArrowDown sx={{ color: '#lightgray' }} />}
      >
          { list.map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{
                  fontFamily: 'League Spartan',
                }}
              >
                {item}
              </MenuItem>
            ))
          }
      </CustomSelect>
    </FormControl>
  );
};

export const ForgeToggle = ({
  label,
  name,
  onChange,
  value,
  list,
  confirmation = false,
}) => {
  useEffect(() => {
    if (!confirmation) {
      if (list?.length && !value) {
        onChange({ target: { name, value: list[0] } });
      }
    }
  }, [list]);

  return (
    <>
      <ForgeFieldLabel>{label}</ForgeFieldLabel>
      <CustomForgeToggle
        color='primary'
        value={value}
        exclusive
        onChange={onChange}
        onClick={() => console.log(value)}
      >
        {list.map((item) => (
          <CustomToggleButton
            name={name}
            value={item}
            key={nanoid()}
            selected={value === item}
          >
            <DoneIcon
              sx={{
                visibility: value === item ? 'visible' : 'hidden',
                fontSize: '15px',
                position: 'absolute',
                left: '17px',
                top: '14px',
              }}
            />

            {item}
          </CustomToggleButton>
        ))}
      </CustomForgeToggle>
    </>
  );
};

export const ForgeDivider = ({ align, children }) => {
  return (
    <Grid size={12}>
      <Divider
        textAlign={align}
        sx={{
          marginTop: '14px',
          '&.MuiDivider-root': {
            '&::before, &::after': {
              borderColor: '#5227CC',
            },
            '&::before': {
              width: '0',
            },
          },
        }}
      >
        <Typography
          sx={{ color: '#5227CC', fontWeight: 600, fontSize: '18px' }}
        >
          {children}
        </Typography>
      </Divider>
    </Grid>
  );
};
