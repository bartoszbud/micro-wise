import axios from 'axios';
import log from 'loglevel';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { WorkOutline } from "@mui/icons-material";

log.setLevel('info');

interface Account {
  id?: number;
  firstName: string;
  lastName: string;
  age: number | '';
  email: string;
  nickname: string;
}

const AccountsCrud: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<Account>({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    nickname: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/account/all', { headers: { 'Content-Type': 'application/json' } });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      alert('Error fetching accounts.');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'age' ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const updateForm = { id: editingId, ...form };
        log.info('Updating account:', updateForm);
        await axios.put(`/account/`, updateForm, { headers: { 'Content-Type': 'application/json' } });
      } else {
        log.info('Adding new account:', form);
        await axios.post(`/account/add`, form, { headers: { 'Content-Type': 'application/json' } });
        log.info('Account added successfully');
      }
      setForm({ firstName: '', lastName: '', age: '', email: '', nickname: '' });
      setEditingId(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving Account:', error);
      alert('Error saving account.');
    }
  };

  const handleEdit = (account: Account) => {
    setForm({ ...account });
    setEditingId(account.id!);
  };

  const handleDelete = async (id: number) => {
    try {
      log.info('Deleting account with id:', id);
      await axios.delete(`/account/${id}`, { headers: { 'Content-Type': 'application/json' } });
      log.info('Account deleted successfully');
      alert('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account.');
    }
  };

  return (
    <Container maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <WorkOutline />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Account Management
        </Typography>

        {/* FORM */}
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <TextField
                name="firstName"
                required
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                name="lastName"
                required
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                name="age"
                required
                fullWidth
                label="Age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="email"
                required
                fullWidth
                label="Email"
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                name="nickname"
                required
                fullWidth
                label="Nickname"
                value={form.nickname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ height: '100%' }}
              >
                {editingId ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ mt: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nickname</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.firstName}</TableCell>
                  <TableCell>{account.lastName}</TableCell>
                  <TableCell>{account.age}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.nickname}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(account)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(account.id!)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AccountsCrud;
