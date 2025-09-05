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

interface User {
  id: number;
  email: string;
  nickname: string;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString("pl-PL");
};

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Pobieranie danych użytkownika
  useEffect(() => {
    const fetchUser = async () => {
      setMessage(null);

      const email = localStorage.getItem("email");
      if (!email) {
        setMessage("Brak email w localStorage – nie mogę pobrać danych.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post("/account/me", { email });
        setUser(res.data);
      } catch (err: any) {
        console.error("Błąd pobierania danych użytkownika:", err);
        const reason =
          err?.response?.status
            ? ` (HTTP ${err.response.status})`
            : "";
        setMessage(`Nie udało się pobrać danych użytkownika${reason}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Aktualizacja danych użytkownika
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      // Uwaga: backend ma PUT /account/
      await axios.put("/account/", user);
      setMessage("Dane zostały zaktualizowane ✅");

      // odśwież dane po zapisie (żeby updatedAt był aktualny)
      const refreshed = await axios.post("/account/me", { email: user.email });
      setUser(refreshed.data);
    } catch (err: any) {
      console.error("Błąd aktualizacji:", err);
      const reason =
        err?.response?.status
          ? ` (HTTP ${err.response.status})`
          : "";
      setMessage(`Nie udało się zapisać zmian ❌${reason}`);
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

        {user && (
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
            <TextField
              margin="normal"
              fullWidth
              label="Imię"
              value={user.firstName ?? ""}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Nazwisko"
              value={user.lastName ?? ""}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Wiek"
              type="number"
              value={user.age ?? ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  age: e.target.value ? Number(e.target.value) : null,
                })
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={saving}
            >
              {saving ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>

            {/* 🔹 Podgląd dat */}
            <Typography variant="body2" color="text.secondary">
              Konto utworzono: {formatDate(user.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ostatnia aktualizacja: {formatDate(user.updatedAt)}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SettingsPage;