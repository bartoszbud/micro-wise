import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
} from "@mui/material";
import { AccountCircle, Dashboard, Settings } from "@mui/icons-material";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("email"); // pobranie email z localStorage
      if (!email) {
        console.error("Brak email w localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(`/account/me`, {email} );
        setUser(res.data);
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Typography>Ładowanie danych...</Typography>;

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Powitanie */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 60, height: 60 }}>
              <AccountCircle fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">
                Witaj, {user?.firstName} {user?.lastName}!
              </Typography>
              <Typography variant="subtitle1">{user?.email}</Typography>
              <Typography variant="subtitle2">
                Role: {user?.roles?.join(", ")}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Dashboard cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Dashboard sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Twój panel</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Przeglądaj swoje dane i ustawienia.
              </Typography>
              <Button variant="contained">Przejdź do panelu</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Settings sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Ustawienia</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Zmień swoje dane, hasło i preferencje konta.
              </Typography>
              <Button variant="contained">Przejdź do ustawień</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;