import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid2 from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { Button, Container, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logoutApi } from '../configs/api';
import SettingsIcon from '@mui/icons-material/Settings'
import { AppContext } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function Header(props) {
  const { onDrawerToggle } = props;
  const { user, setUser, setToken, token } = useContext(AppContext);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  async function handleLogout()
  {
    handleCloseUserMenu();
    await logoutApi();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token')
  }

  return (
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid2 container spacing={1} sx={{ alignItems: 'center', justifyItems: 'end' }}>
            <Grid2 item >
              <IconButton onClick={() => navigate("/settings")}>
                <SettingsIcon />
              </IconButton>
            </ Grid2>
            <Grid2 item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid2>
            { user &&
            <Grid2 item>
                <Container>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem key='logout' onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Container>
            </Grid2>
            }
          </Grid2>
        </Toolbar>
      </AppBar>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};