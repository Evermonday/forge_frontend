import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AllOutIcon from '@mui/icons-material/AllOut';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ConstructionIcon from '@mui/icons-material/Construction';
import TerrainIcon from '@mui/icons-material/Terrain';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SellIcon from '@mui/icons-material/Sell';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TimerIcon from '@mui/icons-material/Timer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

const categories = [
  {
    id: 'Model',
    children: [
      {
        id: 'General',
        icon: <DashboardIcon />,
        active: true,
      },
      { id: 'Schedule', icon: <EventIcon /> },
      { id: 'Development', icon: <ConstructionIcon /> },
      { id: 'Land', icon: <TerrainIcon /> },
      { id: 'Rental', icon: <HomeWorkIcon /> },
      { id: 'Sale', icon: <SellIcon /> },
      { id: 'Financing', icon: <AccountBalanceIcon /> },
      {
        id: 'Cashflow',
        icon: <SwapHorizIcon />,
      }
    ]
  },
  {
    id: 'Report',
    children: [
      { id: 'Analytics', icon: <AnalyticsIcon /> },
      { id: 'Reports', icon: <TimerIcon /> }
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          Forge
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <AllOutIcon />
          </ListItemIcon>
          <ListItemText>Scenarios</ListItemText>
        </ListItem>
        <ListItem>
          <Accordion sx={{background: 'grey'}} disablePadding>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Scenario 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List disablePadding>
                {categories.map(({ id, children }) => (
                  <Box key={id} sx={{ bgcolor: '#101F33' }}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
                    </ListItem>

                    {children.map(({ id: childId, icon, active }) => (
                      <ListItem disablePadding key={childId}>
                        <ListItemButton selected={active} sx={item}>
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText>{childId}</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Box>
                ))}
              </List>
            </AccordionDetails>
        </Accordion>
            <Divider sx={{ mt: 2 }} />
      </ListItem>

      </List>
    </Drawer>
  );
}