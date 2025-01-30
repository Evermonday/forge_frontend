import { Outlet, useNavigate } from 'react-router-dom';
import ProjectCard from './ScenarioCard';
import { Button, List, ListItem, TextField, Typography } from '@mui/material';
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
import { createScenarioFromScratchApi, getProjectApi, getScenariosApi, updateProjectLandAreaApi } from '../../configs/api';
import { ForgeFieldLabel } from '../../components/ForgeForm';

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

export default function ProjectHome() {
  const [unit, setUnit] = useState('metric'); // metric, imperial
  const [scenarios, setScenarios] = useState([]);
  const [project, setProject] = useState({landArea: 0});
  const navigate = useNavigate();
  
  
  useEffect( () =>{
    async function fetchScenarios(){
      const response = await getScenariosApi();
      const scenarioResponse = Array.isArray(response.data) ? response.data : [] ;
      setScenarios(scenarioResponse);
    }

    fetchScenarios();
  }, []);

  useEffect( () =>{
    async function getProject(){
      const response = await getProjectApi();
      setProject(response.data);
    }

    getProject();
  }, [])

  async function handleScenarioCreation()
  {
    const response = await createScenarioFromScratchApi();
    const scenarioId = response.data.id;
    console.log(response.data)
    navigate(`/scenario/${scenarioId}`);
  }

  async function handleProjectLandAreaChange(landArea)
  {
    setProject({...project, landArea})
    await updateProjectLandAreaApi({landArea});
  }

  return (
    <Box>
      <Button onClick={handleScenarioCreation}>From Scratch</Button>
      <FormControl>
        <ForgeFieldLabel>{"Project's Land Area:"}</ForgeFieldLabel>
        <TextField
          value={project.landArea}
          onChange={e => handleProjectLandAreaChange(e.target.value)}
        />
      </FormControl>
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
