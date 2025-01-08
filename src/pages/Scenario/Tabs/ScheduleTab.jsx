import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Button, duration, Stack, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DialogActions, DialogContentText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  ForgeField,
  ForgeFieldLabel,
  ForgeSelect,
} from '../../../components/ForgeForm';

import dayjs from 'dayjs';
import { GridRowModes } from '@mui/x-data-grid';

import { ForgeScheduleDataGrid } from '../../../components/ForgeScheduleDataGrid';

const ModalDatePicker = ({
  name,
  label,
  value,
  onChange,
  minDate,
  disabled,
}) => {
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const [localValue, setLocalValue] = useState(value);
  const localOnChange = (newValue, context) => {
    const e = {
      target: {
        name: name,
        value: newValue,
        type: 'date',
      },
    };
    onChange(e);
    console.log('NEWVALUE', newValue);
    setLocalValue(newValue);
  };
  return (
    <>
      <ForgeFieldLabel>{label}</ForgeFieldLabel>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          name={name}
          minDate={minDate}
          value={localValue}
          views={['year', 'month']}
          onChange={localOnChange}
          disabled={disabled}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>
    </>
  );
};

const initialRows = [
  {
    id: 1,
    name: 'Building sample data',
    mode: 'auto',
    duration: 8,
    start_date: dayjs('2024-04-10 19:18:17.040+02:00').format('MMMM YYYY'),
    end_date: dayjs('2024-07-10 19:18:17.040+02:00').format('MMMM YYYY'),
    related_task: null,
    related_type: null,
    lag: 10,
  },
  {
    id: 2,
    name: 'Building sample data',
    mode: 'auto',
    duration: 8,
    start_date: dayjs('2024-06-18 19:18:17.040+02:00').format('MMMM YYYY'),
    end_date: dayjs('2024-09-18 19:18:17.040+02:00').format('MMMM YYYY'),
    related_task: null,
    related_type: null,
    lag: 10,
  },
  {
    id: 3,
    name: 'Building sample data',
    mode: 'edit',
    duration: 8,
    start_date: dayjs().format('MMMM YYYY'),
    end_date: dayjs().format('MMMM YYYY'),
    related_task: null,
    related_type: null,
    lag: 10,
  },
];

export function ScheduleTab({ unit }) {
  const [startDate, setStartDate] = useState();
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [lastId, setLastId] = useState(initialRows.length);
  const [newRowModalOpen, setNewRowModalOpen] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [newRowData, setNewRowData] = useState({
    name: '',
    mode: 'Auto',
    duration: null,
    start_date: startDate,
    end_date: startDate,
    related_task: null,
    related_type: 'SS',
    lag: null,
  });

  useEffect(() => {
    console.log('inside useEffect');

    return () => {
      console.log('return useeffect!');
    };
  });

  useEffect(() => {
    let new_end_date = newRowData.start_date;
    if (newRowData.duration > 0) {
      new_end_date = dayjs(newRowData.start_date, 'MMMM YYYY').add(
        newRowData.duration - 1,
        'month',
      );
    }
    console.log('new_end_date', typeof new_end_date);
    console.log('new_end_date', new_end_date);
    console.log(dayjs(new_end_date, 'MMMM YYYY'));
    setNewRowData({
      ...newRowData,
      end_date: new_end_date,
    });
  }, [newRowData.lag, newRowData.duration, newRowData.start_date]);

  const handleStartDateChange = (value, context) => {
    console.log('value context', value, context);
    //TODO: only set new date after changing both month and years
    setStartDate(value);
    setNewRowData({
      ...newRowData,
      start_date: value,
    });
  };

  const handleAddItem = () => {
    if (startDate) {
      setNewRowModalOpen(true);
    } else {
      alert('You must specify start date value');
    }
  };
  const handleNewRowModalClose = () => {
    const cfrm = confirm(
      'After Closing form entered data will be lost, Are you sure?',
    );
    if (cfrm) setNewRowModalOpen(false);
  };
  const handleNewRow = (newData) => {
    console.log('newData', newData);
    console.log(rows);
    setLastId(lastId + 1);
    setRows((oldRows) => [
      ...oldRows,
      {
        id: lastId + 1,
        name: newData.name,
        mode: newData.mode,
        duration: newData.duration,
        start_date: newData.start_date,
        end_date: newData.end_date,
        related_task: newData.related_task,
        related_type: newData.related_type,
        lag: newData.lag,
      },
    ]);
    setRowModesModel({ [lastId + 1]: { mode: GridRowModes.View } });
    setNewRowModalOpen(false);
    setNewRowData({
      name: '',
      mode: 'Auto',
      duration: null,
      start_date: startDate,
      end_date: startDate,
      related_task: null,
      related_type: 'FS',
      lag: null,
    });
  };

  const handleModalInput = (e) => {
    console.log('event', e);
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const fieldType = e.target.type;
    console.log('handleModalInput', fieldName, fieldValue, fieldType);

    switch (fieldName) {
      case 'mode':
        if (fieldValue == 'Auto') {
          if (newRowData.related_task && newRowData.related_type) {
            setNewRowData({
              ...newRowData,
              ['mode']: fieldValue,
              ['start_date']: 'Dec 100',
            });
          } else {
            setNewRowData({
              ...newRowData,
              ['mode']: fieldValue,
              ['start_date']: startDate,
            });
          }
        } else if (fieldValue == 'Manual') {
          setNewRowData({
            ...newRowData,
            ['mode']: fieldValue,
            ['start_date']: dayjs(),
          });
        }
        return;
      case 'related_task':
        if (!fieldValue) {
          setModalError(true);
          return;
        }
        const relatedTask = rows.find((task) => task['id'] == fieldValue);
        if (!relatedTask) {
          alert('To do limit');
          setModalError(true); // TODO: handle error
        } else {
          console.log('Record found:', relatedTask);

          if (newRowData.related_type == 'FS') {
            console.log('newRowData', newRowData);
            console.log(dayjs(relatedTask.end_date, 'MMMM YYYY'));
            console.log('lag', newRowData.lag);
            if (relatedTask.duration > 0) {
              // for none milestone tasks
              setNewRowData({
                ...newRowData,
                start_date: dayjs(relatedTask.end_date, 'MMMM YYYY').add(
                  newRowData.lag + 1,
                  'month',
                ),
                related_task: fieldValue,
              });
            } else if (duration == 0) {
              // duration = 0 means related task is milestone
              setNewRowData({
                ...newRowData,
                start_date: dayjs(relatedTask.end_date, 'MMMM YYYY').add(
                  newRowData.lag,
                  'month',
                ),
                related_task: fieldValue,
              });
            }
          } else if (newRowData.related_type == 'SS') {
            console.log('newRowData', newRowData);
            console.log(dayjs(relatedTask.start_date, 'MMMM YYYY'));
            console.log('lag', newRowData.lag);
            setNewRowData({
              ...newRowData,
              start_date: dayjs(relatedTask.start_date, 'MMMM YYYY').add(
                newRowData.lag,
                'month',
              ),
              related_task: fieldValue,
            });
          }
        }
        return;
      default:
        setNewRowData({
          ...newRowData,
          [fieldName]: fieldValue,
        });
    }
  };

  // const handleSaveClick = (id) => () => {
  //   console.log("handleSaveClick id", id);

  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  // };

  // const handleCancelClick = (id) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });

  //   const editedRow = rows.find((row) => row.id === id);
  //   if (editedRow.isNew) {
  //     setRows(rows.filter((row) => row.id !== id));
  //   }
  // };

  const handleRowDeleteClick = (rowId) => {
    alert(`TODO ${rowId}`);
  };

  const processRowUpdate = (newRow, oldRow) => {
    console.log('newRow', newRow);
    console.log('newRow start date', newRow.start_date);
    console.log('oldRow', oldRow);
    // if (newRow.quantity !== oldRow.quantity || newRow.price !== oldRow.price) {
    //   // Update the total when quantity or price changes
    //   newRow.total = newRow.quantity * newRow.price;
    // }

    const updatedData = rows.map((item) =>
      item.id === newRow.id
        ? {
            id: newRow.id,
            name: newRow.name,
            mode: newRow.mode,
            duration: newRow.duration,
            start_date: newRow.start_date,
            end_date: newRow.end_date,
            related_task: newRow.related_task,
            related_type: newRow.related_type,
            lag: newRow.lag,
          }
        : item,
    );
    console.log('updatedData', updatedData);
    setRows(updatedData);
    return newRow;
  };

  return (
    <Box>
      <Grid>
        <Grid>
          <Stack
            direction='row'
            spacing={2}
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Typography color='#54595E' variant='h3' gutterBottom>
              Schedule
            </Typography>
            <Button
              variant='text'
              sx={{ textTransform: 'none' }}
              onClick={handleAddItem}
              startIcon={<AddIcon />}
            >
              Add Item
            </Button>
          </Stack>
        </Grid>
        <Grid sx={{ mt: 4 }}>
          <ForgeFieldLabel sx={{ display: 'inline-block', mt: 2, mr: 2 }}>
            Start Date:
          </ForgeFieldLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={''}
              onChange={handleStartDateChange}
              views={['year', 'month']}
              value={startDate}
              minDate={dayjs('2022-01-01')}
            />
          </LocalizationProvider>
        </Grid>
        <ForgeScheduleDataGrid
          minDate={startDate}
          rows={rows}
          rowModesModel={rowModesModel}
          handleDeleteClick={handleRowDeleteClick}
          processRowUpdate={processRowUpdate}
        />
      </Grid>

      <Dialog
        open={newRowModalOpen}
        onClose={handleNewRowModalClose}
        fullWidth={true}
        maxWidth={'sm'}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            console.log(
              'CZCZ',
              newRowData.end_date,
              typeof newRowData.end_date,
            );
            newRowData.start_date = newRowData.start_date.format('MMMM YYYY');
            newRowData.end_date = newRowData.end_date.format('MMMM YYYY');
            // newRowData.end_date = newRowData.end_date;
            handleNewRow(newRowData);
          },
        }}
      >
        <DialogTitle>New Row</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Enter following fields data
          </DialogContentText> */}
          <ForgeField
            id='name'
            name='name'
            label='Name'
            type='text'
            value={newRowData.name}
            onChange={handleModalInput}
          />
          <ForgeSelect
            id='mode'
            name='mode'
            label='Mode'
            list={['Auto', 'Manual']}
            value={newRowData.mode}
            onChange={handleModalInput}
          />
          <ForgeField
            id='duration'
            name='duration'
            label='Duration'
            type='number'
            value={newRowData.duration}
            onChange={handleModalInput}
          />
          <ModalDatePicker
            id='start_date'
            name='start_date'
            label='Start Date'
            type='number'
            minDate={startDate}
            disabled={newRowData.mode === 'Auto'}
            value={newRowData.start_date}
            onChange={handleModalInput}
          />
          <ModalDatePicker
            id='end_date'
            name='end_date'
            label='End Date'
            type='number'
            minDate={startDate}
            disabled={true}
            value={newRowData.end_date}
            onChange={handleModalInput}
          />
          {newRowData.mode === 'Auto' && (
            <ForgeField
              id='related_task'
              name='related_task'
              label='Related Task'
              type='number'
              value={newRowData.related_task}
              onChange={handleModalInput}
            />
          )}
          {newRowData.mode === 'Auto' && (
            <ForgeSelect
              id='related_type'
              name='related_type'
              label='Related Type'
              type='number'
              value={newRowData.related_type}
              list={[
                { title: 'Start Together (SS)', value: 'SS' },
                { title: 'Start After (FS)', value: 'FS' },
              ]}
              onChange={handleModalInput}
            />
          )}
          <ForgeField
            id='lag'
            name='lag'
            label='Lag'
            type='number'
            onChange={handleModalInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewRowModalClose}>Cancel</Button>
          <Button type='submit'>Add Item</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
