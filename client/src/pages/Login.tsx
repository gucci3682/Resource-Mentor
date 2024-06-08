import React, { useState } from "react";
import axios from "axios";
import { LockOutlined } from "@mui/icons-material";
import { Container, CssBaseline, Box, Avatar, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bgImage from '../assets/images/NTT-DATA-login.jpg';
import { useUser } from '../components/user/UserContext';

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const authenticateUser = async (email: string, password: string) => {
        try {
            const response = await axios.post('/login/auth', { email, password });
            console.log("response", response)
            return response.data;
        } catch (error) {
            console.error(`Error in authentication: ${error}`);
            return null;
        }
    };

    const { setUser } = useUser();

    const handleLogin = async () => {
        // Check if email or password is empty
        if (email.trim() === "" || password.trim() === "") {
            alert("Email and password cannot be empty");
            return;
        }

        // Add your authentication logic here
        const user = await authenticateUser(email, password);
        if (user) {
            setUser({
                resource_name: user.resource_name,
                resource_id: user.resource_id,
            });
            // If authentication is successful, navigate to the dashboard
            navigate("/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="xs">
                <CssBaseline />
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                                <LockOutlined />
                            </Avatar>
                            <Typography variant="h5">Login</Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />

                                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
                                    Login
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
