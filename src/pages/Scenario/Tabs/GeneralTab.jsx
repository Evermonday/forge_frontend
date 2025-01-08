import { styled } from '@mui/material/styles';
import { Box, InputAdornment, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useScenario, useScenarioDispatch } from '../ScenarioContext';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuButtonBulletedList,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from 'mui-tiptap';
import Decimal from 'decimal.js';
import { ForgeField, ForgeToggle } from '../../../components/ForgeForm';
import { ForgeSelect, ForgeDivider } from '../../../components/ForgeForm';

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

export function GeneralTab({ unit }) {
  const development_types = [
    //TODO: get from server
    'New Construction',
    'Renovation/Remodeling',
    'Repair/Maintenance',
    'Other',
  ];

  const development_strategies = ['Build-to-Rent', 'Build-to-Sell', 'Hybrid'];

  const end_uses = ['Residential', 'Commercial', 'Mixed Use'];

  const unit_types = ['Apartment', 'Row', 'Other'];

  const scenarioData = useScenario();
  const scenarioDispatcher = useScenarioDispatch();

  const handleChange = (e) => {
    if (e.target.value == 'Mixed Use') {
      alert('Not Implemented');
      return;
    }

    if (e.target.type == 'decimal' || e.target.type == 'number') {
      if (e.target.value < 0) {
        alert(`${e.target.name} can not be negative`);
        return;
      }
    }

    const fieldName = e.target.name;
    let fieldValue;
    if (e.target.type == 'decimal') {
      fieldValue = new Decimal(e.target.value).toDecimalPlaces(2);
    } else {
      fieldValue = e.target.value;
    }

    if (fieldName == 'end_use') {
      const confirm_status = confirm('Do you confirm to change end use?');
      if (!confirm_status) {
        return; // do nothing
      }
    }
    scenarioDispatcher({
      type: 'SET_FIELD',
      field: fieldName, // e.target.name
      value: fieldValue,
    });
  };

  const handleNoteChange = ({ editor }) => {
    console.log(editor.getHTML());
    scenarioDispatcher({
      type: 'SET_FIELD',
      field: 'note', // e.target.name
      value: editor.getHTML(),
    });
  };

  const editor = useEditor({
    onUpdate: handleNoteChange,
    extensions: [StarterKit],
    content: scenarioData.note,
  });

  // // Cleanup editor on unmount
  // useEffect(() => {
  //   return () => {
  //     if (editor) editor.destroy();
  //   };
  // }, [editor]);

  const getUnit = () => {
    return unit == 'metric' ? (
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
          <ForgeField
            name='name'
            label='Scenario Name'
            value={scenarioData.name}
            onChange={handleChange}
            placeholder={'Scenario No.1'}
          />
        </Grid>

        <Grid size={12}>
          <ForgeField
            name='note'
            label='Note'
            value={scenarioData.note}
            onChange={handleChange}
            textArea={true}
            placeholder='Write a message...'
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
            label='Status'
            name='status'
            value={scenarioData.status}
            onChange={handleChange}
            list={development_types}
          />
        </Grid>

        <Grid size={12}>
          <ForgeSelect
            label='Type of Development'
            name='development_type'
            value={scenarioData.development_type}
            onChange={handleChange}
            list={development_types}
          />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='Development Strategy'
            name='development_strategy'
            value={scenarioData.development_strategy}
            onChange={handleChange}
            list={development_strategies}
          />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='Unit Type'
            name='unit_type'
            value={scenarioData.unit_type}
            onChange={handleChange}
            list={unit_types}
          />
        </Grid>

        <Grid size={12}>
          <ForgeToggle
            label='End Use'
            name='end_use'
            value={scenarioData.end_use}
            onChange={handleChange}
            list={end_uses}
            confirmation={true}
          />
        </Grid>

        <ForgeDivider align='left'>GFA Division</ForgeDivider>

        <p>Comming Soon</p>

        <Grid size={12}>
          <ForgeField
            name='land_area'
            label='Land Area'
            value={scenarioData.land_area}
            onChange={handleChange}
            type='decimal'
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
            value={scenarioData.gfa_calc_method}
            onChange={handleChange}
            list={['FSI based', 'Manual']}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='fsi'
            label='FSI'
            value={scenarioData.fsi}
            onChange={handleChange}
            type='decimal'
          />
        </Grid>

        <ForgeDivider align='left'>GFA - Gross Floor Area</ForgeDivider>

        <Grid size={12}>
          <ForgeField
            name='gfa'
            label='GFA'
            value={scenarioData.gfa}
            onChange={handleChange}
            type='decimal'
            disabled={scenarioData.gfa_calc_method == 'FSI based'}
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
            value={scenarioData.area_alloc_method}
            onChange={handleChange}
            list={['Manual', 'Percentile']}
          />
        </Grid>
        <Grid size={6}>
          <ForgeField
            name='residential_gfa_number'
            label='Residential GFA Number'
            value={scenarioData.residential_gfa_number}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.area_alloc_method == 'Percentile' ||
              scenarioData.end_use == 'Commercial'
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
            value={scenarioData.residential_gfa_percentage}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.area_alloc_method == 'Manual' ||
              scenarioData.end_use == 'Commercial'
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
            value={scenarioData.commercial_gfa_number}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.area_alloc_method == 'Percentile' ||
              scenarioData.end_use == 'Residential'
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
            value={scenarioData.commercial_gfa_percentage}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.area_alloc_method == 'Manual' ||
              scenarioData.end_use == 'Residential'
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
            value={scenarioData.nfa_area_alloc_method}
            onChange={handleChange}
            list={['Manual', 'Percentile']}
          />
        </Grid>

        <Grid size={6}>
          <ForgeField
            name='residential_nfa_number'
            label='Residential NFA Number'
            value={scenarioData.residential_nfa_number}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.nfa_area_alloc_method == 'Percentile' ||
              scenarioData.end_use == 'Commercial'
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
            value={scenarioData.residential_nfa_percentage}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.nfa_area_alloc_method == 'Manual' ||
              scenarioData.end_use == 'Commercial'
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
            value={scenarioData.commercial_nfa_number}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.nfa_area_alloc_method == 'Percentile' ||
              scenarioData.end_use == 'Residential'
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
            value={scenarioData.commercial_nfa_percentage}
            onChange={handleChange}
            type='decimal'
            disabled={
              scenarioData.nfa_area_alloc_method == 'Manual' ||
              scenarioData.end_use == 'Residential'
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
        <Box sx={{ height: '90px' }}></Box>
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
            <b>Land Area: </b> {scenarioData.land_area.toString()} {getUnit()}{' '}
            &nbsp; - &nbsp;
            <b>Total GFA: </b> {scenarioData.gfa.toString()} {getUnit()} &nbsp;
            - &nbsp;
            <b>Total NFA: </b>{' '}
            {/*scenarioData.residential_nfa_number.plus(scenarioData.commercial_nfa_number).toString()*/}{' '}
            {getUnit()} &nbsp; - &nbsp;
            <b>GFA%: </b> {scenarioData.gfa.toString()} % &nbsp;
          </Typography>
        </Grid>
      </SummaryBox>
    </Box>
  );
}
