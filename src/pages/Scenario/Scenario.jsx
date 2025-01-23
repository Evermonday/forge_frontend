/* eslint-disable react/prop-types */
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Container } from '@mui/material';
import { GeneralTab } from './Tabs/GeneralTab';
import { ScheduleTab } from './Tabs/ScheduleTab';
import { ScenarioProvider } from '../../contexts/ScenarioContext';
import { styled } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';
import JsonPreview from './Tabs/JsonPreview';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ConstructionIcon from '@mui/icons-material/Construction';
import TerrainIcon from '@mui/icons-material/Terrain';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SellIcon from '@mui/icons-material/Sell';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';

const TabsContainer = styled(Box)({
  // position: 'fixed',
  left: 0,
  width: '280px',
  padding: '30px 0px',
  backgroundColor: '#F6F7F8',
  borderRight: '1px solid #DEE2E6',
  fontWeight: 'bold',
  height: 'calc(100% - 80px)',
});

const tabStyles = {
  justifyContent: 'left',
  textTransform: 'none',
  color: '#54595E',
  fontWeight: '500',
  fontSize: '18px',
  paddingLeft: '32px',
  minHeight: '50px',
  height: '50px',
  '&.Mui-selected': {
    fontWeight: 'bold', // Bold text for the selected tab
  },
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ mt: '44px' }}>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function ScenarioTabs({ unit }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ }}>
      <TabsContainer>
        <Tabs
          sx={{ height: '800px' }}
          value={value}
          onChange={handleChange}
          textColor='primary'
          centered={false}
          indicatorColor='none'
          orientation='vertical'
          variant='scrollable'
          aria-label='basic tabs navtabs'
        >
          <Tab
            sx={tabStyles}
            label='General'
            icon={<DashboardIcon />}
            iconPosition='start'
            {...a11yProps(0)}
          />
          <Tab
            sx={tabStyles}
            label='Schedule'
            icon={<EventIcon />}
            iconPosition='start'
            {...a11yProps(1)}
          />
          <Tab
            sx={tabStyles}
            label='Development'
            icon={<ConstructionIcon />}
            iconPosition='start'
            {...a11yProps(2)}
          />
          <Tab
            sx={tabStyles}
            label='Land'
            icon={<TerrainIcon />}
            iconPosition='start'
            {...a11yProps(3)}
          />
          <Tab
            sx={tabStyles}
            label='Rental'
            icon={<HomeWorkIcon />}
            iconPosition='start'
            {...a11yProps(4)}
          />
          <Tab
            sx={tabStyles}
            label='Sale'
            icon={<SellIcon />}
            iconPosition='start'
            {...a11yProps(5)}
          />
          <Tab
            sx={tabStyles}
            label='Finance'
            icon={<AccountBalanceIcon />}
            iconPosition='start'
            {...a11yProps(6)}
          />
          <Tab
            sx={tabStyles}
            label='Cashflow'
            icon={<SwapHorizIcon />}
            iconPosition='start'
            {...a11yProps(7)}
          />
          <Tab
            sx={tabStyles}
            label='Analysis'
            icon={<AnalyticsIcon />}
            iconPosition='start'
            {...a11yProps(8)}
          />
          <Tab
            sx={tabStyles}
            label='Reports'
            icon={<AnalyticsIcon />}
            iconPosition='start'
            {...a11yProps(9)}
          />
          <Tab
            sx={tabStyles}
            label='JSON Preview'
            icon={<DataObjectIcon />}
            iconPosition='start'
            {...a11yProps(10)}
          />
        </Tabs>
      </TabsContainer>
      <Container>
        <CustomTabPanel value={value} index={0}>
          
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ScheduleTab unit={unit} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
        <CustomTabPanel value={value} index={10}>
          <JsonPreview />
        </CustomTabPanel>
      </Container>
    </Box>
  );
}

export default function Scenario({project}) {
  const unit = useOutletContext();

  return (
    <>
      <ScenarioProvider>
        <GeneralTab unit={unit} />
      </ScenarioProvider>
    </>
  );
}
