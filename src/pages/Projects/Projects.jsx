import { Outlet, useLocation } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

function ParentComponent({ unit, setUnit }) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          position: 'fixed',
          right: '100px',
          flexDirection: 'row',
          px: 12,
        }}
      >
        <FormControl>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            name='radio-buttons-group'
            row
          >
            <FormControlLabel
              value='imperial'
              control={<Radio />}
              label='Imperial ( sf )'
            />
            <FormControlLabel
              value='metric'
              control={<Radio />}
              label='Metric (m^2)'
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Outlet context={unit} />
    </>
  );
}

function NoChildComponent({ unit }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Typography variant='h2'>Project</Typography>
        <Typography>List of Scenarios</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <ProjectCard key={item} id={item} />
        ))}
      </Box>
    </Box>
  );
}

export default function Projects() {
  const [unit, setUnit] = useState('metric'); // metric, imperial

  const location = useLocation();
  const hasChildren = location.pathname.includes('scenario');
  return hasChildren ? (
    <ParentComponent setUnit={setUnit} unit={unit} />
  ) : (
    <NoChildComponent unit={unit} />
  );
}
