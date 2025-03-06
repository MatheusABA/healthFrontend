import React, { useState } from "react";
import { TextField, Button, Typography, Container, CircularProgress, Snackbar, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/login.css";
import { login } from "../../api/api.js"

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Catch data from the register form
    const emailFromRegister = location.state?.email || "";
    const passwordFromRegister = location.state?.password || "";

    const [email, setEmail] = useState(emailFromRegister);
    const [password, setPassword] = useState(passwordFromRegister);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loginData = { email, password };

        try {
            const { status, data} = await login(loginData);


            if (status === 200) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else if (status === 401) {
                setMessage("Invalid credentials.");
            } else {
                const data = await response.json();
                setMessage(data.error || "Invalid credentials, please try again.");
            }

        } catch(error) {
            setLoading(false);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Container maxWidth="xs" className="container">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form className="form" onSubmit={handleSubmit}>
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
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </form>


            {message && (
                <Snackbar
                    open={true}
                    message={message}
                    autoHideDuration={6000}
                    onClose={() => setMessage(null)}
                    className="snackbar"
                />
            )}

            <Grid container justifyContent="center">
                <Typography variant="body2" color="textSecondary" align="center" mt={2}>
                    Don't have an account?{" "}
                    <span className="link" onClick={() => navigate(`/register`)} >
                        Register
                    </span>
                </Typography>
            </Grid>

        </Container>
    );
};

export default Login;
