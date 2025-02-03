import { useEffect, useState } from 'react';
import { DataGrid, GridRow, GridCell, GridActionsCellItem } from '@mui/x-data-grid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SCHEDULING_MODE_AUTO } from '../constants/ScheduleTab';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { nanoid } from 'nanoid';
import { Chip, Paper, Stack } from '@mui/material';


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

export default function SortableDataGrid ({rows}) {
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
        //   renderEditCell: renderModeEditCell
        },
        {
            field: 'duration',
            headerName: 'Duration',
            type: 'number',
            minWidth: 50,
            editable: true
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            type: 'string',
            minWidth: 160,
            editable: true,
        //   renderEditCell: renderStartDateEditCell(minDate)
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            type: 'string',
            minWidth: 160,
            editable: false
        },
        {
            field: 'mode',
            headerName: 'Mode',
            minWidth: 100,
            editable: true
        },
        {
            field: 'predecessors',
            headerName: 'Predecessors',
            type: 'number',
            minWidth: 120,
            valueOptions: [...new Set(rows.map((o) => o.predecessors).flat())],
            renderCell: (params) => (
              <Stack direction="row" spacing={0.25}>
                {params.row.predecessors.map((predecessor) => (
                  <>{predecessor.name}</>
                ))}
              </Stack>
            )
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

    const [reorderedRows, setReorderedRows] = useState(rows);

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

  return (
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
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
