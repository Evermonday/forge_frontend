import { styled } from '@mui/material/styles';
import { Box, Button, FormControl, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Decimal from 'decimal.js';
import { ForgeField,  ForgeFieldLabel,  ForgeToggle } from '../../../components/ForgeForm';
import { ForgeSelect, ForgeDivider } from '../../../components/ForgeForm';
import {
  AREA_ALLOC_METHODS,
  DEVELOPMENT_STRATEGIES,
  DEVELOPMENT_TYPES,
  END_USES,
  GFA_CALC_METHODS,
  NFA_AREA_ALLOC_METHODS,
  UNIT_TYPES
} from '../../../constants/GeneralTab'
import { useEffect, useState } from 'react';
import { KeyboardArrowDown } from '@mui/icons-material';


// #TODO: toDecimalPlaces(2)

const SummaryBox = styled(Box)({
  position: 'fixed',
  width: '100%',
  bottom: 0,
  left: 0,
  backgroundColor: '#dfe6e9',
  padding: '24px 24px',
  borderRadius: '12px',
  marginTop: '32px',
});
const UnitInputAdornment = styled(InputAdornment)({
  color: '#adb5bd',
  fontSize: '14px',
  fontFamily: 'League Spartan',
  '& svg': {
    fontSize: '20px',
  },
});

export function GeneralTab( {initialState, handleScenarioSave} ) {
  const [state, setState] = useState(initialState) 
  
  useEffect(() => {
    setState(initialState)
  }, [initialState])

  // land_area Event Listener
  useEffect(() => {
    if (state.gfaCalcMethod == 'Manual'){
      const gfa = Number(state.gfa);
      const fsi = Decimal(gfa).dividedBy(state.landArea)
      setState(prevState => ({...prevState, fsi}) )
    }
  }, [state.gfaCalcMethod, state.gfa])

  // land_area Event Listener
  //#TODO: Why can't this listener change the state when residential_gfa_percentage listener is running?
  // useEffect(() => {
  //   if (state.gfaCalcMethod == 'Manual'){
  //     const gfa = Number(state.gfa);
  //     console.log('___state: 2');
  //     console.log(gfa)
  //     setState({...state, fsi: 2, landArea: gfa})
  //   }
  // }, [state.gfa])

  // fsi Event Listener
  // useEffect(() => {
  //   if (state.gfaCalcMethod == 'Manual'){
  //     const gfa = Number(state.gfa);   
  //     const landArea = Number(state.landArea)   
  //     const fsi = new Decimal(gfa).dividedBy(landArea);
  //     console.log('___state: X');
  // setState({...state, fsi})
  //   }
  // }, [state.gfa])

  // gfa Event Listener
  useEffect(() => {
    if (state.gfaCalcMethod == 'FSI-Based'){
      const landArea = Number(state.landArea);
      const fsi = Number(state.fsi);
      const gfa = new Decimal(landArea).times(fsi);
      console.log('___state: 3');
      setState(prevState => ({...prevState, gfa}))
    }
  }, [state.fsi, state.landArea, state.gfaCalcMethod])

  // residential_gfa_number
  useEffect(() => {
    if(state.areaAllocMethod != 'Manual' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const gfa = Number(state.gfa);
      const residentialGFAPercentage = Number(state.residentialGFAPercentage) / 100;
      const residentialGFANumber =  new Decimal(gfa).times(residentialGFAPercentage);
      console.log('___state: 4');
      setState(prevState => ({...prevState, residentialGFANumber}))

    }
  }, [state.residentialGFAPercentage, state.gfa])


  // residential_gfa_percentage
  // residential_gfa_number
  useEffect(() => {
    if (!(state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const commercialGFANumber = Number(state.commercialGFANumber) + Number(state.residentialGFANumber)
      console.log('___state: 5');
      // setState({...state, residentialGFANumber: 0, residentialGFAPercentage: 0, commercialGFANumber, commercialGFAPercentage: 100})
      const commercialGFAPercentage = (commercialGFANumber / Number(state.gfa)) * 100
      
      const commercialNFANumber = Number(state.commercialNFANumber) + Number(state.residentialNFANumber)
      console.log('___state: 5');
      // setState({...state, residentialNFANumber: 0, residentialNFAPercentage: 0, commercialNFANumber, commercialNFAPercentage: 100})
      const commercialNFAPercentage = (Number(state.commercialNFANumber) / commercialGFANumber) * 100

      setState(prevState => ({
        ...prevState,
        residentialNFANumber: 0,
        residentialNFAPercentage: 0,
        commercialNFANumber,
        commercialNFAPercentage,
        residentialGFANumber: 0,
        residentialGFAPercentage: 0,
        commercialGFANumber,
        commercialGFAPercentage
      }))
    }

    if (!(state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const residentialGFANumber = Number(state.commercialGFANumber) + Number(state.residentialGFANumber)
      console.log('___state: 15');
      // setState({...state, commercialGFANumber: 0, commercialGFAPercentage: 0, residentialGFANumber, residentialGFAPercentage: 100})
      const residentialGFAPercentage = (residentialGFANumber / Number(state.gfa)) * 100

      const residentialNFANumber = Number(state.commercialNFANumber) + Number(state.residentialNFANumber)
      console.log('___state: 15');
      // setState({...state, commercialNFANumber: 0, commercialNFAPercentage: 0, residentialNFANumber, residentialNFAPercentage: 100})
      const residentialNFAPercentage = (state.residentialNFANumber == 0 || residentialGFANumber == 0) ? 0 : (Number(state.residentialNFANumber) / residentialGFANumber) * 100

      setState(prevState => ({
        ...prevState,
        commercialGFANumber: 0,
        commercialGFAPercentage: 0,
        residentialGFANumber,
        residentialGFAPercentage,
        commercialNFANumber: 0,
        commercialNFAPercentage: 0,
        residentialNFANumber,
        residentialNFAPercentage
      }))
    }
  }, [state.endUse])

  // residential_gfa_percentage
  useEffect(() => {
    if(state.areaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const gfa = Number(state.gfa);
      const residentialGFANumber = Number(state.residentialGFANumber);
      const residentialGFAPercentage =  new Decimal(residentialGFANumber).dividedBy(gfa) * 100 || 0;
      console.log(gfa)
      console.log(state.landArea)
      console.log('___state: 6');
      setState(prevState => ({...prevState, residentialGFAPercentage}))

    }
  }, [state.residentialGFANumber, state.gfa])


  // commercial_gfa_number
  useEffect(() => {
    if(state.areaAllocMethod != 'Manual' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const gfa = Number(state.gfa);
      const commercialGFAPercentage = Number(state.commercialGFAPercentage) / 100;
      const commercialGFANumber =  new Decimal(gfa).times(commercialGFAPercentage);
      console.log('___state: 7');
      setState(prevState => ({...prevState, commercialGFANumber}))

    }
  }, [state.commercialGFAPercentage, state.gfa])

  // commercial_gfa_percentage
  useEffect(() => {
    if(state.areaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const gfa = Number(state.gfa);
      const commercialGFANumber = Number(state.commercialGFANumber);
      const commercialGFAPercentage =  new Decimal(commercialGFANumber).dividedBy(gfa) * 100;
      console.log('___state: 8');
      setState(prevState => ({...prevState, commercialGFAPercentage}))

    }
  }, [state.commercialGFANumber, state.gfa])

  useEffect(() =>
  {
    if(state.nfaAreaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const residentialGFANumber = Number(state.residentialGFANumber);
      const residentialNFANumber = Number(state.residentialNFANumber);
      const residentialNFAPercentage =  residentialGFANumber == 0 ? 0 :new Decimal(residentialNFANumber).dividedBy(residentialGFANumber) * 100;
      console.log('___state: 6');
      setState(prevState => ({...prevState, residentialNFAPercentage}))

    }
  }, [state.residentialNFANumber])
  
  useEffect(() =>
    {
      if(state.nfaAreaAllocMethod != 'Manual' &&
        (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
      {
        const residentialGFANumber = Number(state.residentialGFANumber);
        const residentialNFANumber =  new Decimal(residentialGFANumber).times(state.residentialNFAPercentage / 100);
        console.log('___state: 6');
        setState(prevState => ({...prevState, residentialNFANumber}))
  
      }
    }, [state.residentialNFAPercentage])

  useEffect(() =>
  {
    if(state.nfaAreaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const commercialGFANumber = Number(state.commercialGFANumber);
      const commercialNFANumber = Number(state.commercialNFANumber);
      const commercialNFAPercentage =  new Decimal(commercialNFANumber).dividedBy(commercialGFANumber) * 100;
      console.log('___state: 6');
      setState(prevState => ({...prevState, commercialNFAPercentage}))

    }
  }, [state.commercialNFANumber])

  useEffect(() =>
    {
      if(state.nfaAreaAllocMethod != 'Manual' &&
        (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
      {
        const commercialGFANumber = Number(state.commercialGFANumber);
        const commercialNFANumber =  new Decimal(commercialGFANumber).times(state.commercialNFAPercentage / 100);
        console.log('___state: 6');
        setState(prevState => ({...prevState, commercialNFANumber}))
  
      }
    }, [state.commercialNFAPercentage])

  function handleResidentialGFANumberChange(residentialGFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    const totalGFA = Number(residentialGFANumber) + Number(state.commercialGFANumber)
    if (totalGFA > state.gfa)
    {
      console.log('___state: 9');
      const maxAvailable = state.gfa - state.commercialGFANumber
      setState({...state, residentialGFANumber: maxAvailable})
      return;
    }

    console.log('___state: 10');
    setState({...state, residentialGFANumber})
  }

  function handleResidentialGFAPercentageChange(residentialGFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return
    const totalGFA = Number(residentialGFAPercentage) + Number(state.commercialGFAPercentage)
    if (totalGFA > 100)
    {
      console.log('___state: 40');
      const maxAvailable = 100 - state.commercialGFAPercentage
      setState({...state, residentialGFAPercentage: maxAvailable})
      return;
    }

    console.log('___state: 10');
    setState({...state, residentialGFAPercentage})
  }

  function handleCommercialGFANumberChange(commercialGFANumber)
  {
    // if (commercialGFANumber)
    // regex
      // return
    const totalGFA = Number(commercialGFANumber) + Number(state.residentialGFANumber)
    if (totalGFA > state.gfa)
    {
      console.log('___state: 44');
      const maxAvailable = state.gfa - state.commercialGFANumber
      setState({...state, commercialGFANumber: maxAvailable})
      return;
    }

    console.log('___state: 10');
    setState({...state, commercialGFANumber})
  }

  function handleCommercialGFAPercentageChange(commercialGFAPercentage)
  {
    // if (commercialGFAPercentage)
    // regex
      // return
    const totalGFA = Number(commercialGFAPercentage) + Number(state.residentialGFAPercentage)
    if (totalGFA > 100)
    {
      console.log('___state: 41');
      const maxAvailable = 100 - state.residentialGFAPercentage
      setState({...state, commercialGFAPercentage: maxAvailable})
      return;
    }

    console.log('___state: 10');
    setState({...state, commercialGFAPercentage})
  }

  function handleResidentialNFANumberChange(residentialNFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    if (Number(residentialNFANumber) > Number(state.residentialGFANumber))
    {
      setState({...state, residentialNFANumber: Number(state.residentialGFANumber)})
      return;
    }

    console.log('___state: 21');
    setState({...state, residentialNFANumber})
  }

  function handleResidentialNFAPercentageChange(residentialNFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return

    const newResidentialNFAPercentage = residentialNFAPercentage < 100 ? residentialNFAPercentage : 100;
    console.log('___state: 10');
    setState({...state, residentialNFAPercentage: newResidentialNFAPercentage})
  }

  function handleCommercialNFANumberChange(commercialNFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    if (Number(commercialNFANumber) > Number(state.commercialGFANumber))
    {
      setState({...state, commercialNFANumber: Number(state.commercialGFANumber)})
      return;
    }

    console.log('___state: 21');
    setState({...state, commercialNFANumber})
  }

  function handleCommercialNFAPercentageChange(commercialNFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return
      const newCommercialNFAPercentage = commercialNFAPercentage < 100 ? commercialNFAPercentage : 100;
      console.log('___state: 10');
      setState({...state, commercialNFAPercentage: newCommercialNFAPercentage})
  }

  const TextArea = styled(TextField)({
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

  const getUnit = () => {
    return state.measurementUnit == 'metric' ? (
      <span>
        m<sup>2</sup>
      </span>
    ) : (
      <span>SF</span>
    );
  };
  return (
    <Box>
      <Grid container spacing={2} sx={{ width: '500px' }}>
        <Grid size={12}>
          <Typography color='#54595E' variant='h3' gutterBottom>
            General Information
          </Typography>
        </Grid>
        <Grid size={12}>
          <TextField
            name='name'
            label='Scenario Name'
            // value={scenarioState.scenarioName}
            // onChange={e => dispatchScenarioAction({ type: 'SET_SCENARIO_NAME', payload: e.target.value })}
            value={state.name}
            onChange={e => setState({...state, name: e.target.value})}
            placeholder={'Scenario No.1'}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            name='note'
            label='Note'
            // value={scenarioState.scenarioNote}
            // onChange={e => dispatchScenarioAction({ type: 'SET_SCENARIO_NOTE', payload: e.target.value })}
            value={state.note}
            onChange={e => setState({...state, note: e.target.value})}
            placeholder='Write a message...'
            multiline
            rows={4}  
          />

          {
            //   <RichTextEditorProvider
            //   editor={editor}>
            //   <RichTextField
            //     controls={
            //       <MenuControlsContainer>
            //         <MenuSelectHeading />
            //         <MenuDivider />
            //         <MenuButtonBold />
            //         <MenuButtonItalic />
            //         <MenuButtonBulletedList/>
            //         {/* Add more controls of your choosing here */}
            //       </MenuControlsContainer>
            //     }
            //   />
            // </RichTextEditorProvider>
          }
        </Grid>
        <Grid size={12}>
          <ForgeSelect
            label='Status Tag'
            name='tag'
            // value={scenarioState.scenarioStatusTag}
            // onChange={e => dispatchScenarioAction({ type: 'SET_SCENARIO_TAG', payload: e.target.value})}
            value={state.statusTag}
            onChange={e => setState({...state, statusTag: e.target.value})}
            list={state.statusTags}
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <ForgeFieldLabel>Type of Development</ForgeFieldLabel>
            <Select
              id='development_type'
              name= 'development_type'
              // value={scenarioState.developmentType}
              // onChange={e => dispatchScenarioAction({type : 'SET_SCENARIO_DEVELOPMENT_TYPE', payload: e.target.value})}
              value={state.developmentType}
              onChange={e => setState({...state, developmentType: e.target.value})}
              IconComponent={() => <KeyboardArrowDown sx={{ color: '#lightgray' }} />}
            >
                { DEVELOPMENT_TYPES.map((item) => (
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
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='Development Strategy'
            name='development_strategy'
            // value={scenarioState.developmentStrategy}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_DEVELOPMENT_STRATEGY', payload: e.target.value})}
            value={state.developmentStrategy}
            onChange={e => setState({...state, developmentStrategy: e.target.value})}
            list={DEVELOPMENT_STRATEGIES}
          />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='Unit Type'
            name='unit_type'
            // value={scenarioState.unitType}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_UNIT_TYPE', payload: e.target.value})}
            value={state.unitType}
            onChange={e => setState({...state, unitType: e.target.value})}
            list={UNIT_TYPES}
            />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='End Use'
            name='end_use'
            // value={scenarioState.endUse}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_END_USE', payload: e.target.value})}
            value={state.endUse}
            onChange={e => setState({...state, endUse: e.target.value})}
            list={END_USES}
          />
        </Grid>

        <ForgeDivider align='left'>GFA Division</ForgeDivider>

        <p>Comming Soon</p>

        <Grid size={12}>
          <ForgeField
            name='land_area'
            label='Land Area'
            // value={scenarioState.landArea}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_LAND_AREA', payload: e.target.value})}
            // disabled={scenarioState.gfaCalcMethod != 'FSI-Based'}
            value={state.landArea}
            onChange={e => setState({...state, landArea: e.target.value})}
            type='decimal'
            disabled={state.gfaCalcMethod != 'FSI-Based'}
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeToggle
            label='GFA Calculation Method'
            name='gfa_calc_method'
            // value={scenarioState.gfaCalcMethod}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_GFA_CALC_METHOD', payload: e.target.value})}
            value={state.gfaCalcMethod}
            onChange={e => setState({...state, gfaCalcMethod: e.target.value})}
            list={GFA_CALC_METHODS}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='fsi'
            label='FSI'
            // value={scenarioState.fsi}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_FSI', payload: e.target.value})}
            // disabled={scenarioState.gfaCalcMethod != 'FSI-Based'}
            value={state.fsi}
            onChange={e => setState({...state, fsi: e.target.value})}
            disabled={state.gfaCalcMethod != 'FSI-Based'}
            type='decimal'
            />
        </Grid>

        <ForgeDivider align='left'>GFA - Gross Floor Area</ForgeDivider>

        <Grid size={12}>
          <ForgeField
            name='gfa'
            label='GFA'
            // value={scenarioState.gfa}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_GFA', payload: e.target.value})}
            // disabled={scenarioState.gfaCalcMethod != 'Manual'}
            value={state.gfa}
            onChange={e => setState({...state, gfa: e.target.value})}
            type='decimal'
            disabled={state.gfaCalcMethod != 'Manual'}
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='GFA - Area Allocation Method'
            name='area_alloc_method'
            // value={scenarioState.areaAllocMethod}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_AREA_ALLOC_METHOD', payload: e.target.value})}
            value={state.areaAllocMethod}
            onChange={e => setState({...state, areaAllocMethod: e.target.value})}
            list={AREA_ALLOC_METHODS}
          />
        </Grid>
        <Grid size={6}>
          <ForgeField
            name='residential_gfa_number'
            label='Residential GFA Number'
            value={state.residentialGFANumber}
            onChange={e => handleResidentialGFANumberChange(e.target.value)}
            // onChange={e => dispatchScenarioAction({type: 'SET_SCENARIO_RESIDENTIAL_GFA_NUMBER', payload: e.target.value})}
            type='decimal'
            disabled={
              !((state.endUse == 'Residential' ||
                state.endUse == 'Mixed Use') &&
              state.areaAllocMethod == 'Manual')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='residential_gfa_percentage'
            label='Residential GFA %'
            value={state.residentialGFAPercentage}
            onChange={e => handleResidentialGFAPercentageChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Residential' ||
                state.endUse == 'Mixed Use') &&
                state.areaAllocMethod == 'Percentile')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  <span>%</span>
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='commercial_gfa_number'
            label='Commercial GFA Number'
            value={state.commercialGFANumber}
            onChange={e => handleCommercialGFANumberChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Commercial' ||
                state.endUse == 'Mixed Use') &&
                state.areaAllocMethod == 'Manual')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='commercial_gfa_percentage'
            label='Commercial GFA %'
            value={state.commercialGFAPercentage}
            onChange={e => handleCommercialGFAPercentageChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Commercial' ||
                state.endUse == 'Mixed Use') &&
                state.areaAllocMethod == 'Percentile')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  <span>%</span>
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>
        <ForgeDivider align='left'>NFA - Net Floor Area</ForgeDivider>

        <Grid size={12}>
          <ForgeToggle
            label='NFA - Area Allocation Method'
            name='nfa_area_alloc_method'
            value={state.nfaAreaAllocMethod}
            onChange={e => setState({...state, nfaAreaAllocMethod: e.target.value})}
            list={NFA_AREA_ALLOC_METHODS}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='residential_nfa_number'
            label='Residential NFA Number'
            value={state.residentialNFANumber}
            onChange={e => handleResidentialNFANumberChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Residential' ||
                state.endUse == 'Mixed Use') &&
                state.nfaAreaAllocMethod == 'Manual')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='residential_nfa_percentage'
            label='Residential NFA %'
            value={state.residentialNFAPercentage}
            onChange={e => handleResidentialNFAPercentageChange( e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Residential' ||
                state.endUse == 'Mixed Use') &&
                state.nfaAreaAllocMethod == 'Percentile')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  <span>%</span>
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='commercial_nfa_number'
            label='Commercial NFA Number'
            value={state.commercialNFANumber}
            onChange={e => handleCommercialNFANumberChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Commercial' ||
                state.endUse == 'Mixed Use') &&
                state.nfaAreaAllocMethod == 'Manual')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='commercial_nfa_percentage'
            label='Commercial NFA %'
            value={state.commercialNFAPercentage}
            onChange={e => handleCommercialNFAPercentageChange(e.target.value)}
            type='decimal'
            disabled={
              !((state.endUse == 'Commercial'  ||
                state.endUse == 'Mixed Use') &&
                state.nfaAreaAllocMethod == 'Percentile')
            }
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  <span>%</span>
                </UnitInputAdornment>
              ),
            }}
          />
        </Grid>
        <Box sx={{ height: '90px' }}>
            <Button onClick={() => handleScenarioSave(state)}>Save</Button>

        </Box>
      </Grid>
      <SummaryBox>
        <Grid container spacing={2} sx={{ margin: '0 auto' }}>
          <Typography
            color='#636e72'
            typography='h4'
            sx={{ display: 'inline-block', float: 'left' }}
          >
            Summary
          </Typography>
          <Typography
            color='#636e72'
            typography='p'
            sx={{ marginTop: '6px', fontSize: '15px' }}
          >
            <b>Land Area: </b> {state.landArea.toString()} {getUnit()}{' '}
            &nbsp; - &nbsp;
            <b>Total GFA: </b> {state.gfa.toString()} {getUnit()} &nbsp;
            - &nbsp;
            <b>Total NFA: </b>{' '}
            {/*scenarioData.residential_nfa_number.plus(scenarioData.commercial_nfa_number).toString()*/}{' '}
            {getUnit()} &nbsp; - &nbsp;
            <b>GFA%: </b> {state.gfa.toString()} % &nbsp;
          </Typography>
        </Grid>
      </SummaryBox>
    </Box>
  );
}
