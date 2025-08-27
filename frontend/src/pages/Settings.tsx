import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState({ nickname: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Pobieranie danych zalogowanego użytkownika
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/account/", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
        setMessage("Nie udało się pobrać danych użytkownika.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Aktualizacja danych użytkownika
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await axios.put("/auth/me", user, { withCredentials: true });
      setMessage("Dane zostały zaktualizowane ✅");
    } catch (err) {
      console.error("Błąd aktualizacji:", err);
      setMessage("Nie udało się zapisać zmian ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Ładowanie danych...</Typography>;

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ustawienia konta
        </Typography>
        {message && (
          <Alert
            severity={message.includes("✅") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSave} noValidate>
          <TextField
            margin="normal"
            fullWidth
            label="Nickname"
            value={user.nickname}
            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {/* 🔹 Opcjonalnie można dodać zmianę hasła */}
          {/* <TextField
            margin="normal"
            fullWidth
            label="Nowe hasło"
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={saving}
          >
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
