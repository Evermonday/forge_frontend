import { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import logo from '../assets/ForgeLogo.png';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { logoutApi } from '../config/api';
import { AppContext } from '../contexts/AppContext';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const LogoType = styled(Typography)({
  color: '#5227CC',
  fontWeight: 700,
  fontSize: '25px',
});

export default function AppNavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, setUser, setToken, token } = useContext(AppContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function handleLogout()
  {
    handleCloseUserMenu();
    await logoutApi(token);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token')
  }

  return (
    <AppBar
      // position='fixed'
      sx={{
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Container maxWidth="xl" variant='regular'>
        <Toolbar disableGutters>
          <Stack
            direction='row'
            sx={{
              alignItems: 'center',
              flexGrow: 1,
              gap: 1,
            }}
          >
            <Stack
              direction='row'
              spacing={1}
              sx={{ justifyContent: 'center', mr: 'auto', marginLeft: '10px' }}
            >
              <Logo />
              <LogoType>FORGE</LogoType>
            </Stack>
          </Stack>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          { user &&
            <Box sx={{ flexGrow: 0 }}>
              <Box>
                <Container sx={{color: 'black'}}>{user.name}</Container>
              </Box>
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
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}


export function Logo() {
  return (
    <Box sx={{ pt: 1, mr: 2 }}>
      <Box
        component='img'
        src={logo}
        sx={{
          display: 'inline-block',
          height: '20px',
        }}
      />
    </Box>
  );
}