import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  DataGrid,
  GridActionsCellItem,
  useGridApiContext,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { ForgeSelect } from './ForgeForm';
import { GridRowModes } from '@mui/x-data-grid';

import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    border: 'none',
    outline: 'none',
  },
  '& .MuiInputBase-root.Mui-focused': {
    border: 'none',
  },
}));

function StartDateEditCell(props) {
  const { id, value, field, hasFocus, minDate } = props;
  const [localVal, setLocalVal] = useState(dayjs(value));
  const apiRef = useGridApiContext();

  //const ref = useRef(null);
  // useEnhancedEffect(() => {
  //   if (hasFocus && ref.current) {
  //     const input = ref.current.querySelector(`input[value="${value}"]`);
  //     input?.focus();
  //   }
  // }, [hasFocus, value]);
  const handleChange = (newValue) => {
    setLocalVal(newValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue.format('MMMM YYYY'),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        minDate={minDate}
        views={['year', 'month']}
        value={localVal || null}
        onChange={handleChange}
        slots={{
          textField: CustomInput,
        }}
      />
    </LocalizationProvider>
  );
}

function ModeEditCell(props) {
  const { id, value, field, hasFocus, minDate } = props;
  const [localVal, setLocalVal] = useState(value);
  const apiRef = useGridApiContext();

  //const ref = useRef(null);
  // useEnhancedEffect(() => {
  //   if (hasFocus && ref.current) {
  //     const input = ref.current.querySelector(`input[value="${value}"]`);
  //     input?.focus();
  //   }
  // }, [hasFocus, value]);
  const handleChange = (e) => {
    const newValue = e.target.value;
    console.log('newValue', newValue);
    setLocalVal(newValue);
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <>
      <ForgeSelect
        name='mode'
        value={value}
        onChange={handleChange}
        list={['Auto', 'Manual']}
      />
    </>
  );
}
const renderStartDateEditCell = (minDate) => (params) => {
  return <StartDateEditCell minDate={minDate} {...params} />;
};

const renderModeEditCell = (params) => {
  return <ModeEditCell {...params} />;
};

export const ForgeScheduleDataGrid = ({
  minDate,
  rows,
  rowModesModel,
  handleDeleteClick,
  processRowUpdate,
}) => {
  const commonOptions = {
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 8,
      ...commonOptions,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
      ...commonOptions,
    },
    {
      field: 'mode',
      headerName: 'Mode',
      minWidth: 56,
      editable: true,
      renderEditCell: renderModeEditCell,
      ...commonOptions,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      type: 'number',
      minWidth: 50,
      editable: true,
      ...commonOptions,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      type: 'string',
      minWidth: 160,
      editable: true,
      renderEditCell: renderStartDateEditCell(minDate),
      ...commonOptions,
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      type: 'string',
      minWidth: 160,
      editable: false,
      ...commonOptions,
    },
    {
      field: 'related_task',
      headerName: 'Related Task',
      type: 'number',
      minWidth: 120,
      editable: true,
      ...commonOptions,
    },
    {
      field: 'related_type',
      headerName: 'Related Type',
      minWidth: 120,
      editable: true,
      ...commonOptions,
    },
    {
      field: 'lag',
      headerName: 'Lag',
      minWidth: 46,
      width: 46,
      editable: true,
      ...commonOptions,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      getActions: (params) => {
        const id = params.id;
        // const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        return [
          <GridActionsCellItem
            key={nanoid()}
            icon={<DeleteIcon />}
            onClick={() => handleDeleteClick(id)}
            label='Delete'
          />,
        ];
      },
    },
  ];

  return (
    <Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode='cell'
        showCellVerticalBorder={true}
        showColumnVerticalBorder={true}
        sortable={false}
        rowModesModel={rowModesModel}
        initialState={{
          pagination: false,
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        sx={{
          '& .MuiInputBase-input': {
            color: 'primary.main',
            fontWeight: 'bold',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '8px',
            outline: 'none',
          },
          '& .MuiInputBase-input:focus-within': {
            outline: 'none',
            border: 'none',
          },
          '& .MuiInputBase-input:focus': {
            outline: 'none',
          },
          '.MuiDataGrid-cell:focus': {
            outline: 'none', // Change border color for focused cell
            outlineOffset: '-1px',
          },
        }}
        processRowUpdate={processRowUpdate}
      />
    </Grid>
  );
};
