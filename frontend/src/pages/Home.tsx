import axios from 'axios';
import { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Switch,
  IconButton,
  Tooltip,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { PeopleOutline, Home as HomeIcon, Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// 🔹 Importuj nowo utworzone komponenty
import UsersList from './Employee.tsx';
import HomePage from './Settings.tsx';
import SettingsPage from './Settings.tsx';

const drawerWidth = 240;

const App: React.FC = () => { // Zmieniłem nazwę z UsersList na App, aby była bardziej ogólna
  const [selectedMenu, setSelectedMenu] = useState('users');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
  }), [darkMode]);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/signout", {}, { headers: { 'Content-Type': 'application/json' } });
      console.log("Wylogowano z backendu");
    } catch (error) {
      console.error("Błąd podczas wylogowania:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // 🔹 Użyj useMemo do dynamicznego wyboru komponentu
  const renderContent = useMemo(() => {
    switch (selectedMenu) {
      case 'users':
        return <UsersList />;
      case 'home':
        return <HomePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  }, [selectedMenu]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div">
              Microwise
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Tryb ciemny">
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  color="default"
                  inputProps={{ 'aria-label': 'toggle dark mode' }}
                />
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  aria-label="logout"
                  sx={{ ml: 1 }}
                >
                  <Logout />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton selected={selectedMenu === 'users'} onClick={() => setSelectedMenu('users')}>
                  <ListItemIcon><PeopleOutline /></ListItemIcon>
                  <ListItemText primary="Users List" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton selected={selectedMenu === 'home'} onClick={() => setSelectedMenu('home')}>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton selected={selectedMenu === 'settings'} onClick={() => setSelectedMenu('settings')}>
                  <ListItemIcon><Settings /></ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          {renderContent}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;