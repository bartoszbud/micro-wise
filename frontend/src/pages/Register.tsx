import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate

import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

interface User {
    email: string;
    password: string;
    name: string;
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate(); // <-- inicjalizacja hooka

    const [user, setUser] = useState<User>({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
          ...user,
          [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await axios.post('/auth/signup', user);
          if (response.status === 201) {
            alert('User created successfully');
            setUser({ email: '', password: '', name: '' });
            navigate('/login'); // <-- redirect po poprawnej rejestracji
          }
        } catch (error) {
          console.error('Error creating user:', error);
          alert('Failed to create user');
        }
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    mt: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                <LockOutlined />
            </Avatar>
            <Typography variant="h5">Register</Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            required
                            fullWidth
                            id="email"
                            label="eMail"
                            value={user.email}
                            onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="password"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            value={user.password}
                            onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            value={user.name}
                            onChange={handleChange} />
                    </Grid>
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                >
                    Register
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link to="/login">Already have an account?</Link>
                    </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
