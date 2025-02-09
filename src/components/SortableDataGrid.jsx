import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridRow, GridCell, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SCHEDULING_MODE_AUTO, SCHEDULING_MODES } from '../constants/ScheduleTab';
import { Alert, Box, Chip, FormControl, InputLabel, MenuItem, Modal, OutlinedInput, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';

import { _ } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { getScenarioTasksApi, updateTaskApi } from '../configs/api';
import dayjs from 'dayjs';

const CustomRowWrapper = ({ row, index, ...rest }) => {
  const rowStyle = {
    padding: '8px',
    margin: '4px 0',
    backgroundColor: 'red',
    border: '5px solid black',
  };

  return (
    <Draggable
      key={`row-${row.id}`}
      draggableId={`row-${row.id}`}
      index={index}
    >
      {(provided, snapshot) => (
        <GridRow
          index={index}
          row={row}
          {...rest}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            ...provided.draggableProps.style,
            ...rowStyle,
            backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'inherit',
          }}
        >
          <GridCell>{row.id}</GridCell>
          <GridCell>{row.name}</GridCell>
          <GridCell>{row.age}</GridCell>
        </GridRow>
      )}
    </Draggable>
  );
};

function DeleteModal(props) {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
            position: "absolute",
            width: "50%",
            mt: "15%",
            ml: "25%",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default function SortableDataGrid ({rows, setRows, scenarioId}) {
    const [rowModesModel, setRowModesModel] = useState({});

    const [open, setOpen] = useState(false);
    const handleOpen = (e, data) => {
      setRowData(data);
      setOpen(true);
    };
    const handleClose = () => setOpen(false);

    async function getScenarioTasks()
    {
      const response = await getScenarioTasksApi(scenarioId);
      setRows(response.data);
    }

    const columns = [
        {
            // field: 'displayId',
            headerName: '',
            width: 8  

        },
        {
            field: 'id',
            headerName: 'ID',
            width: 8
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true
        },
        {
            field: 'mode',
            headerName: 'Mode',
            minWidth: 56,
            editable: true,
            type: 'singleSelect',
            valueOptions: SCHEDULING_MODES
        //   renderEditCell: renderModeEditCell
        },
        {
            field: 'duration',
            headerName: 'Duration (month)',
            type: 'number',
            minWidth: 150,
            editable: true,
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            type: 'date',
            valueGetter: params => new Date(params),
            minWidth: 160,
            editable: true,
        //   renderEditCell: renderStartDateEditCell(minDate)
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            type: 'date',
            valueGetter: params => new Date(params),
            minWidth: 160,
            editable: false
        },
        {
            field: 'predecessors',
            headerName: 'Predecessors',
            type: 'string',
            minWidth: 120,
            // valueGetter: params => params.map(param => param.id).join(','),
            valueGetter: params => params.join(','),
            editable: true
            // valueOptions: [...new Set(rows.map((o) => o.predecessors).flat())],
            // renderCell: (params) => {
            //   const value = params.row.predecessors.map(predecessor => predecessor.id).join(',')
            //   return (
            //     <TextField
            //       defaultValue={ value }
            //     />
            //   )
            // }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
              // if (isInEditMode) {
              //   return [
              //     <GridActionsCellItem
              //       icon={<SaveIcon />}
              //       label="Save"
              //       sx={{
              //         color: 'primary.main',
              //       }}
              //       // onClick={handleSaveClick(id)}
              //       onClick={handleOpen}
              //       key="save"
              //     />,
              //     <GridActionsCellItem
              //       icon={<CancelIcon />}
              //       label="Cancel"
              //       className="textPrimary"
              //       onClick={handleCancelClick(id)}
              //       color="inherit"
              //       key="cancel"
              //     />,
              //   ];
              // }
      
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                  key="edit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                  key="delete"
                />,
              ];
            },
          },
    ];

    const [reorderedRows, setReorderedRows] = useState(rows);
    const [snackbar, setSnackbar] = useState(null);

    useEffect(() => {
        setReorderedRows(rows);
    }, [rows]);

    const onDragEnd = (result) => {
        // const taskDisplayIds = result
// console.log(result?.destination.index)
    if (!result.destination) {
      return;
    }

    const newReorderedItems = Array.from(reorderedRows);
    const [removed] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, removed);
    setReorderedRows(newReorderedItems);
  };

  const [sortModel, setSortModel] = useState([
    {
      field: 'displayId'
    },
  ]);

  const handleRowModesModelChange = (newRowModesModel) => {
    // setRowModesModel(newRowModesModel);
    console.log('==== 2')

  };

  const handleRowEditStop = (params, event) => {
    console.log('==== 1')

    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = id => () => {
    console.log(id)

    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    console.log('==== 4')

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    console.log('==== 5')

    // setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    console.log('==== 6')

    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  
  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error)
    console.log(error.response.data.exception)
    if(error.response.data.exception == "App\\Exceptions\\IncompatibleTaskMode")
    {
        setSnackbar({ children: "Please First Delete Predecessors.", severity: 'error' });
    }
    else if('message' in error.response.data)
    {
      setSnackbar({ children: error.response.data.message, severity: 'error' });
    }
    else
    {
        setSnackbar({ children: error.message, severity: 'error' });
    }
  }, []);

  const handleCloseSnackbar = () => setSnackbar(null);


  async function processRowUpdate(newRow) {
    // check predecessor change
    const predecessors = newRow.predecessors.split(",").map(pred => Number(pred) || null);
    newRow = {...newRow, predecessors };

    const updatedRow = { ...newRow, isNew: false};
    const oldRow = rows.filter(row => row.id === newRow.id)[0];
        
    if(_.isEqual(newRow, oldRow)) {
        return updatedRow;
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    const oldKeys = Object.keys(oldRow)
    const changedAttribute = oldKeys.filter(key => oldRow[key] != newRow[key])[0];
    const newValue = [];
    newValue[changedAttribute] = newRow[changedAttribute];
    await updateTaskApi(oldRow.id, changedAttribute, {...newValue});
    await getScenarioTasks()
    // return updatedRow;

  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="data-grid">
            {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <DataGrid
                    sortModel={sortModel}
                    onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                    rows={reorderedRows}
                    columns={columns}
                    slots={{
                        row: CustomRowWrapper,
                    }}
                    handleDeleteClick={() => {}}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                />
                {provided.placeholder}
            </div>
            )}
        </Droppable>
      </DragDropContext>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {/* <DeleteModal open={open} handleClose={handleClose} data={'rowData'} /> */}
    </>
  );
};
