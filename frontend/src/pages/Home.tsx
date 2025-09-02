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

// 🔹 Importuj komponenty
import UsersList from './Employee.tsx';
import HomePage from './Settings.tsx';
import SettingsPage from './Settings.tsx';

const drawerWidth = 240;

const parseJwt = (token: string) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const getUserRoles = (): string[] => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const payload = parseJwt(token);
  return payload?.roles || [];
};

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
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

  // 🔹 Renderowanie treści w zależności od wybranego menu i roli
  const renderContent = useMemo(() => {
    const roles = getUserRoles();

    switch (selectedMenu) {
      case 'users':
        if (!roles.includes("ROLE_ADMIN")) return <div>Brak dostępu</div>;
        return <UsersList />;
      case 'home':
        return <HomePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  }, [selectedMenu]);

  const userRoles = getUserRoles();

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
              {userRoles.includes("ROLE_ADMIN") && (
                <ListItem disablePadding>
                  <ListItemButton selected={selectedMenu === 'users'} onClick={() => setSelectedMenu('users')}>
                    <ListItemIcon><PeopleOutline /></ListItemIcon>
                    <ListItemText primary="Users List" />
                  </ListItemButton>
                </ListItem>
              )}

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