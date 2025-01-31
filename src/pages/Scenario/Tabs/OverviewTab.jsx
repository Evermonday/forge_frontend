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
} from '../../../constants/OverviewTab'
import { useEffect, useState } from 'react';
console.log('STATE___: X');
import { KeyboardArrowDown } from '@mui/icons-material';
import {
  updateScenarioAreaAllocMethodApi,
  updateScenarioCommercialGFANumberApi,
  updateScenarioCommercialGFAPercentageApi,
  updateScenarioCommercialNFANumberApi,
  updateScenarioCommercialNFAPercentageApi,
  updateScenarioDevelopmentStrategy,
  updateScenarioDevelopmentType,
  updateScenarioEndUse,
  updateScenarioFSIApi,
  updateScenarioGFAApi,
  updateScenarioGFACalcMethodApi,
  updateScenarioName,
  updateScenarioNFAAreaAllocMethodApi,
  updateScenarioNote,
  updateScenarioResidentialGFANumberApi,
  updateScenarioResidentialGFAPercentageApi,
  updateScenarioResidentialNFANumberApi,
  updateScenarioResidentialNFAPercentageApi,
  updateScenarioTag,
  updateScenarioUnitType
} from '../../../configs/api';


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

export function OverviewTab( {initialState, handleScenarioSave} ) {
  const [state, setState] = useState(initialState);
  const [errorState, setErrorState] = useState({
    measurementUnit: null,
    name: null,
    note: null,
    developmentType: null,
    developmentStrategy: null,
    unitType: null,
    endUse: null,
    landArea: null,
    fsi: null,
    gfa: null,
    gfaCalcMethod: null,
    areaAllocMethod: null,
    residentialGFANumber: null,
    residentialGFAPercentage: null,
    commercialGFANumber: null,
    commercialGFAPercentage: null,
    nfaAreaAllocMethod: null,
    residentialNFANumber: null,
    residentialNFAPercentage: null,
    commercialNFANumber: null,
    commercialNFAPercentage:  null
  });
  
  useEffect(() =>
  {
console.log('STATE___: 1');
    setState(initialState)
  }, [initialState])

  // land_area Event Listener
  useEffect(() =>
  {
console.log('STATE___: 2');
    if (state.gfaCalcMethod == 'Manual'){
      const gfa = Number(state.gfa);
      const fsi = Decimal(gfa).dividedBy(state.landArea)
      setState(prevState => ({...prevState, fsi}) )
    }
  }, [state.gfaCalcMethod, state.gfa])

  // gfa Event Listener
  useEffect(() =>
  {
console.log('STATE___: 3');
    if (state.gfaCalcMethod == 'FSI-Based'){
      const landArea = Number(state.landArea);
      const fsi = Number(state.fsi);
      const gfa = new Decimal(landArea).times(fsi);
      setState(prevState => ({...prevState, gfa}))
    }
  }, [state.fsi, state.gfaCalcMethod])

  // residential_gfa_percentage
  // residential_gfa_number
  useEffect(() =>
  {
console.log('STATE___: 5');
    if (!(state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
console.log(`5__ ${state.commercialGFANumber}`)

      const commercialGFANumber = Number(state.commercialGFANumber) + Number(state.residentialGFANumber)
      // setState({...state, residentialGFANumber: 0, residentialGFAPercentage: 0, commercialGFANumber, commercialGFAPercentage: 100})
console.log(`5__ ${commercialGFANumber}`)
      const commercialGFAPercentage = state.gfa == 0 ? 0 : (commercialGFANumber / Number(state.gfa)) * 100
console.log(`5__ ${commercialGFAPercentage}`)
      const commercialNFANumber = Number(state.commercialNFANumber) + Number(state.residentialNFANumber)
      // setState({...state, residentialNFANumber: 0, residentialNFAPercentage: 0, commercialNFANumber, commercialNFAPercentage: 100})
      const commercialNFAPercentage = commercialGFANumber == 0 ? 0 : (Number(state.commercialNFANumber) / commercialGFANumber) * 100

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
      // setState({...state, commercialGFANumber: 0, commercialGFAPercentage: 0, residentialGFANumber, residentialGFAPercentage: 100})
      const residentialGFAPercentage = state.gfa == 0 ? 0 : (residentialGFANumber / Number(state.gfa)) * 100

      const residentialNFANumber = Number(state.commercialNFANumber) + Number(state.residentialNFANumber)
      // setState({...state, commercialNFANumber: 0, commercialNFAPercentage: 0, residentialNFANumber, residentialNFAPercentage: 100})
      const residentialNFAPercentage = residentialGFANumber == 0 ? 0 : (Number(state.residentialNFANumber) / residentialGFANumber) * 100

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

    // residential_gfa_number
    useEffect(() =>
      {
console.log('STATE___: 4');
        if(state.areaAllocMethod != 'Manual' &&
          (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
        {
          const gfa = Number(state.gfa);
          const residentialGFAPercentage = Number(state.residentialGFAPercentage) / 100;
          const residentialGFANumber =  new Decimal(gfa).times(residentialGFAPercentage);
          setState(prevState => ({...prevState, residentialGFANumber}))
    
        }
    }, [state.residentialGFAPercentage, state.gfa])

  // residential_gfa_percentage
  useEffect(() => {
console.log('STATE___: 6');
    if(state.areaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const gfa = Number(state.gfa);
      const residentialGFANumber = Number(state.residentialGFANumber);
      const residentialGFAPercentage =  gfa == 0 ? 0 : new Decimal(residentialGFANumber).dividedBy(gfa) * 100;
      setState(prevState => ({...prevState, residentialGFAPercentage}))

    }
  }, [state.residentialGFANumber, state.gfa])


  // commercial_gfa_number
  useEffect(() =>
  {
console.log('STATE___: 7');
    if(state.areaAllocMethod != 'Manual' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const gfa = Number(state.gfa);
      const commercialGFAPercentage = Number(state.commercialGFAPercentage) / 100;
console.log(`7__ ${state.commercialGFAPercentage}`);
console.log(`7__ ${commercialGFAPercentage}`);
      const commercialGFANumber =  new Decimal(gfa).times(commercialGFAPercentage);
      setState(prevState => ({...prevState, commercialGFANumber}))

    }
  }, [state.commercialGFAPercentage, state.gfa])


  // commercial_gfa_percentage
  // commercial_gfa_percentage
  useEffect(() => {
console.log('STATE___: 12');
    if(state.areaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
console.log("___-")
      const gfa = Number(state.gfa);
      const commercialGFANumber = Number(state.commercialGFANumber);
      const commercialGFAPercentage =  gfa == 0 ? 0 : new Decimal(commercialGFANumber).dividedBy(gfa) * 100;
      setState(prevState => ({...prevState, commercialGFAPercentage}))

    }
  }, [state.commercialGFANumber, state.gfa])

        

  // commercial_gfa_percentage
//   useEffect(() =>
//   {
// console.log('STATE___: 8');
//     if(state.areaAllocMethod != 'Percentile' &&
//       (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
//     {
//       const gfa = Number(state.gfa);
//       const commercialGFANumber = Number(state.commercialGFANumber);
//       const commercialGFAPercentage = gfa == 0 ? 0 : new Decimal(commercialGFANumber).dividedBy(gfa) * 100;
// console.log(commercialGFAPercentage)
//       setState(prevState => ({...prevState, commercialGFAPercentage}))

//     }
//   }, [state.commercialGFANumber, state.gfa])

  // residential_nfa_percentage
  useEffect(() =>
    {
console.log('STATE___: 20');
    if(state.nfaAreaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
    {
      const residentialGFANumber = Number(state.residentialGFANumber);
      const residentialNFANumber = Number(state.residentialNFANumber);
      const residentialNFAPercentage =  residentialGFANumber == 0 ? 0 :new Decimal(residentialNFANumber).dividedBy(residentialGFANumber) * 100;
      setState(prevState => ({...prevState, residentialNFAPercentage}))

    }
  }, [state.residentialNFANumber, state.residentialGFAPercentage]);
  
  // residential_nfa_number
  useEffect(() =>
    {
console.log('STATE___: 21');
      if(state.nfaAreaAllocMethod != 'Manual' &&
        (state.endUse == 'Mixed Use' || state.endUse == 'Residential'))
      {
        const residentialGFANumber = Number(state.residentialGFANumber);
        const residentialNFANumber =  new Decimal(residentialGFANumber).times(state.residentialNFAPercentage / 100);
        setState(prevState => ({...prevState, residentialNFANumber}))
  
      }
    }, [state.residentialNFAPercentage, state.residentialGFANumber]);

    //commercial_nfa_percentage
  useEffect(() =>
    {
console.log('STATE___: 22');
    if(state.nfaAreaAllocMethod != 'Percentile' &&
      (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
    {
      const commercialGFANumber = Number(state.commercialGFANumber);
      const commercialNFANumber = Number(state.commercialNFANumber);
      const commercialNFAPercentage =  new Decimal(commercialNFANumber).dividedBy(commercialGFANumber) * 100;
      setState(prevState => ({...prevState, commercialNFAPercentage}))

    }
  }, [state.commercialNFANumber, state.commercialGFANumber]);


  useEffect(() =>
    {
console.log('STATE___: 25');
    if(state.endUse == 'Mixed Use' || state.endUse == 'Commercial')
    {
      const commercialGFANumber = Number(state.commercialGFANumber);
      const commercialNFANumber =  new Decimal(commercialGFANumber).times(state.commercialNFAPercentage / 100);
      setState(prevState => ({...prevState, commercialNFANumber}))
    }
  }, [state.commercialGFANumber]);

    //commercial_nfa_number
  useEffect(() =>
    {
console.log('STATE___: 23');
      if(state.nfaAreaAllocMethod != 'Manual' &&
        (state.endUse == 'Mixed Use' || state.endUse == 'Commercial'))
      {
        const commercialGFANumber = Number(state.commercialGFANumber);
        const commercialNFANumber =  new Decimal(commercialGFANumber).times(state.commercialNFAPercentage / 100);
        setState(prevState => ({...prevState, commercialNFANumber}))
  
      }
    }, [state.commercialNFAPercentage]);



  // Handling Functions

  function handleScenarioNameChange(newName)
  {
    updateScenarioName({name: newName}, state.id);
    setState({...state, name: newName});
  }

  function handleScenarioNoteChange(note)
  {
    updateScenarioNote({note}, state.id);
    setState({...state, note});
  }

  function handleScenarioTagChange(tagId)
  {
    const statusTag = state.statusTags.find(tag => tag.id == tagId)
    updateScenarioTag({tagId}, state.id);
    setState({...state, statusTag});
  }

  function handleScenarioDevelopmentTypeChange(developmentType)
  {
    updateScenarioDevelopmentType({developmentType}, state.id);
    setState({...state, developmentType});
  }

  function handleScenarioDevelopmentStrategyChange(developmentStrategy)
  {
    updateScenarioDevelopmentStrategy({developmentStrategy}, state.id);
    setState({...state, developmentStrategy});
  }

  function handleScenarioUnitTypeChange(unitType)
  {
    updateScenarioUnitType({unitType}, state.id);
    setState({...state, unitType});
  }

  function handleScenarioEndUseChange(endUse)
  {
    updateScenarioEndUse({endUse}, state.id);
    setState({...state, endUse});
  }

  function handleGFACalcMethodChange(gfaCalcMethod)
  {
    updateScenarioGFACalcMethodApi({gfaCalcMethod}, state.id);
    setState({...state, gfaCalcMethod});
  }

  function handleFSIChange(fsi)
  {
    if(Decimal(fsi).decimalPlaces() > 2)
      return;

    setState({...state, fsi});
    
    /// Cast to two Decimal Places
    fsi = (Math.round(fsi * 100) / 100).toFixed(2);
    updateScenarioFSIApi({fsi}, state.id);
  }

  function handleGFAChange(gfa)
  {
    // gfa = Number(gfa)
    // if(isNaN(gfa))
    // {
    //   return;
    // }
    if(Number(gfa) > 10000000)
    {
      return;
    }

    setState({...state, gfa});
    updateScenarioGFAApi({gfa}, state.id);
  }

  function handleAreaAllocMethodChange(areaAllocMethod)
  {
    setState({...state, areaAllocMethod});
    updateScenarioAreaAllocMethodApi({areaAllocMethod}, state.id);
  }

  function handleResidentialGFANumberChange(residentialGFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    const totalGFA = Number(residentialGFANumber) + Number(state.commercialGFANumber)
    if (totalGFA > state.gfa)
    {
      setErrorState({...errorState, residentialGFANumber: 'Cannot exceed GFA'});
      // const maxAvailable = state.gfa - state.commercialGFANumber
      // setState({...state, residentialGFANumber: maxAvailable})
      return;
    }
    else
    {
      setErrorState({...errorState, residentialGFANumber: null});
      setState({...state, residentialGFANumber});
      updateScenarioResidentialGFANumberApi({residentialGFANumber}, state.id);
    }

  }

  function handleResidentialGFAPercentageChange(residentialGFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return
    const totalGFAPercentage = Number(residentialGFAPercentage) + Number(state.commercialGFAPercentage)
    if (totalGFAPercentage > 100)
    {
      console.log('asdfsdfs')
      // const maxAvailable = 100 - state.commercialGFAPercentage
      // setState({...state, residentialGFAPercentage: maxAvailable})
      setErrorState({...errorState, residentialGFAPercentage: 'Total Percentage Must Not Exceed 100%'});
      return;
    }
    else
    {
      setErrorState({...errorState, residentialGFAPercentage: null});
      setState({...state, residentialGFAPercentage});
      updateScenarioResidentialGFAPercentageApi({residentialGFAPercentage}, state.id);
    }

  }

  function handleCommercialGFANumberChange(commercialGFANumber)
  {
    // if (commercialGFANumber)
    // regex
      // return
    const totalGFA = Number(commercialGFANumber) + Number(state.residentialGFANumber)
    if (totalGFA > state.gfa)
    {
      setErrorState({...errorState, commercialGFANumber: 'Cannot exceed GFA'});
      // const maxAvailable = state.gfa - state.commercialGFANumber
      // setState({...state, commercialGFANumber: maxAvailable})
      return;
    }
    else
    {
      setErrorState({...errorState, commercialGFANumber: null});
      setState({...state, commercialGFANumber});
      updateScenarioCommercialGFANumberApi({commercialGFANumber}, state.id);
    }

  }

  function handleCommercialGFAPercentageChange(commercialGFAPercentage)
  {
    // if (commercialGFAPercentage)
    // regex
      // return
    const totalGFAPercentage = Number(commercialGFAPercentage) + Number(state.residentialGFAPercentage)
    if (totalGFAPercentage > 100)
    {
      // const maxAvailable = 100 - state.residentialGFAPercentage
      // setState({...state, commercialGFAPercentage: maxAvailable})
      setErrorState({...errorState, commercialGFAPercentage: 'Total Percentage Must Not Exceed 100%'});
      return;
    }
    else
    {
      setErrorState({...errorState, commercialGFAPercentage: null});
      setState({...state, commercialGFAPercentage})
      updateScenarioCommercialGFAPercentageApi({commercialGFAPercentage}, state.id);
    }

  }

  function handleNFAAreaAllocMethod(nfaAreaAllocMethod)
  {
    setState({...state, nfaAreaAllocMethod});
    updateScenarioNFAAreaAllocMethodApi({nfaAreaAllocMethod}, state.id);
  }

  function handleResidentialNFANumberChange(residentialNFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    if (Number(residentialNFANumber) > Number(state.residentialGFANumber))
    {
      // setState({...state, residentialNFANumber: Number(state.residentialGFANumber)})
      setErrorState({...errorState, residentialNFANumber: 'Must not Exceed Residential GFA'});
      return;
    }
    else
    {
      setErrorState({...errorState, residentialNFANumber: null});
      setState({...state, residentialNFANumber});
      updateScenarioResidentialNFANumberApi({residentialNFANumber}, state.id);
    }

  }

  function handleResidentialNFAPercentageChange(residentialNFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return
    if(residentialNFAPercentage > 100)
    {
      setErrorState({...errorState, residentialNFANumber: 'Must not Exceed 100%'});
      return;
    }
    // const newResidentialNFAPercentage = residentialNFAPercentage < 100 ? residentialNFAPercentage : 100;

    setState({...state, residentialNFAPercentage})
    updateScenarioResidentialNFAPercentageApi({residentialNFAPercentage}, state.id);
  }

  function handleCommercialNFANumberChange(commercialNFANumber)
  {
    // if (residentialGFANumber)
    // regex
      // return
    if (Number(commercialNFANumber) > Number(state.commercialGFANumber))
    {
      setErrorState({...errorState, commercialNFANumber: 'Must not Exceed Commercial GFA'});
      // setState({...state, commercialNFANumber: Number(state.commercialGFANumber)});
      return;
    }
    else
    {
      setErrorState({...errorState, commercialNFANumber: null});
      setState({...state, commercialNFANumber});
      updateScenarioCommercialNFANumberApi({commercialNFANumber}, state.id);
    }

  }

  function handleCommercialNFAPercentageChange(commercialNFAPercentage)
  {
    // if (residentialGFAPercentage)
    // regex
      // return
      // const newCommercialNFAPercentage = commercialNFAPercentage < 100 ? commercialNFAPercentage : 100;
      if(commercialNFAPercentage > 100)
      {
        setErrorState({...errorState, commercialNFAPercentage: 'Must not Exceed 100%'});
      }
      else
      {
        setErrorState({...errorState, commercialNFAPercentage: null});
        setState({...state, commercialNFAPercentage});
        updateScenarioCommercialNFAPercentageApi({commercialNFAPercentage}, state.id);
      }
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
            onChange={e => handleScenarioNameChange(e.target.value)}
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
            onChange={e => handleScenarioNoteChange(e.target.value)}
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
            value={state.statusTag.id}
            onChange={e => handleScenarioTagChange(e.target.value)}
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
              onChange={e => handleScenarioDevelopmentTypeChange(e.target.value)}
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
            onChange={e => handleScenarioDevelopmentStrategyChange(e.target.value)}
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
            onChange={e => handleScenarioUnitTypeChange(e.target.value)}
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
            onChange={e => handleScenarioEndUseChange(e.target.value)}
            list={END_USES}
          />
        </Grid>

        <ForgeDivider align='left'>GFA Division</ForgeDivider>

        <p>Comming Soon</p>

        <Grid size={12}>
          <TextField
            name='land_area'
            label='Land Area'
            value={state.landArea}
            type='decimal'
            InputProps={{
              endAdornment: (
                <UnitInputAdornment position='end'>
                  {getUnit()}
                </UnitInputAdornment>
              ),
            }}
            slotProps={{
              input: {
                readOnly: true
              }
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
            onChange={e => handleGFACalcMethodChange(e.target.value)}
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
            onChange={e => handleFSIChange(e.target.value)}
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
            onChange={e => handleGFAChange(e.target.value)}
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
            onChange={e => handleAreaAllocMethodChange(e.target.value)}
            list={AREA_ALLOC_METHODS}
          />
        </Grid>
        <Grid size={6}>
          <TextField
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
            helperText={errorState.residentialGFANumber}
            error={errorState.residentialGFANumber !== null}
          />
        </Grid>

        <Grid size={6}>
          <TextField
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
            helperText={errorState.residentialGFAPercentage}
            error={errorState.residentialGFAPercentage !== null}
          />
        </Grid>

        <Grid size={6}>
          <TextField
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
          <TextField
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
            onChange={e => handleNFAAreaAllocMethod(e.target.value)}
            list={NFA_AREA_ALLOC_METHODS}
          />
        </Grid>

        <Grid size={6}>
          <TextField
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
          <TextField
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
          <TextField
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
          <TextField
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
