import axios from 'axios';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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
    }
    
    const LoginForm: React.FC = () => {
        const [user, setUser] = useState<User>({
            email: '',
            password: ''
        });
        
        const navigate = useNavigate();
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setUser({
              ...user,
              [e.target.name]: e.target.value,
            });
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const response = await axios.post('/auth/signin', user);

                if (response.status === 200) {
                const { token, email } = response.data;
      // zapisz JWT do localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);

                alert('User logged in successfully');
                navigate('/');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login error.');
            }
        };


        return (
            <>
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
                <Typography variant="h5">Login</Typography>
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
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/register">Do not have account yet?</Link>
                        </Grid>
                    </Grid>
                </Box>
                </Box>
            </Container>
        </>
        );
    };

export default LoginForm;