import { Outlet, useNavigate } from 'react-router-dom';
import ProjectCard from './ScenarioCard';
import { Button, List, ListItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, use, useEffect, Suspense } from 'react';
import { AppContext } from '../../contexts/AppContext'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { createScenarioFromScratchApi, getScenariosApi } from '../../configs/api';

function ParentComponent({ unit, setUnit }) {
  console.log('here')
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
        <Typography variant='h2'>Scenarios</Typography>
        <Typography>List of Scenarios</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {[1].map((item) => (
          <ProjectCard key={item} id={item} />
        ))}
      </Box>
    </Box>
  );
}

export default function Scenarios() {
  const [unit, setUnit] = useState('metric'); // metric, imperial
  const [scenarios, setScenarios] = useState([]); // metric, imperial
  const navigate = useNavigate();
  
  
  useEffect( () =>{
    async function fetchScenarios(){
      const response = await getScenariosApi();
      const scenarioResponse = Array.isArray(response.data) ? response.data : [] ;
      setScenarios(scenarioResponse);
    }

    fetchScenarios()
  }, [])
  
  async function handleScenarioCreation()
  {
    const response = await createScenarioFromScratchApi();
    const scenarioId = response.data.id;
    console.log(response.data)
    navigate(`/scenario/${scenarioId}`);
  }

  return (
    <Box>
      <Button onClick={handleScenarioCreation}>From Scratch</Button>
      <List>
          {scenarios.map(scenario =>
            <ListItem key={scenario.id} value={scenario.id}>
              <Box>
                {scenario.name}
                <Button onClick={() => navigate(`/scenario/${scenario.id}/overview`)}>View</Button>
              </Box>
            </ListItem>
          )}
      </List>
    </Box>
  )
}
