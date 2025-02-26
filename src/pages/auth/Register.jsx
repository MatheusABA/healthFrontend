// src/pages/Register.jsx
import React, { useState } from "react";
import { TextField, Button, Typography, Container, Grid, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

const Register = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Register logic
        try {
            const response = await fetch('http://localhost:8080/api/v1/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            })

            if (response.status === 201) {
                navigate("/login", { state: { email, password } });
            } else {
                setError("Failed to register, please try again.");
            }

        } catch (error) {
            setLoading(false);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" className="container">
            <Typography variant="h4" align="center" gutterBottom>
                Create an Account
            </Typography>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="button"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
            </form>

            {error && (
                <Snackbar
                    open={true}
                    message={error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    className="snackbar"
                />
            )}

            <Grid container justifyContent="center">
                <Typography variant="body2" color="textSecondary" align="center" mt={2}>
                    Already have an account?{" "}
                    <span className="link" onClick={() => navigate(`/login`)}>
                        Login
                    </span>
                </Typography>
            </Grid>
        </Container>
    );
};

export default Register;
