import React, { useState, useEffect } from "react";
import {
    Container, TextField, Button, Typography, List, ListItem, ListItemText, Box, CircularProgress, Snackbar, Alert,
    IconButton, Card, CardContent, CardActions, Grid, Stack, Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { fetchDoctors, createDoctor, deleteDoctor } from "../api/api.js";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialty: "",
        crm: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const navigate = useNavigate(); // nav hook
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            getDoctors();
        } else {
            navigate("/login");
        }
    }, [token]);


    const getDoctors = async () => {
        setLoading(true);
        try {
            const doctorList = await fetchDoctors();
            setDoctors(doctorList);
        } catch (error) {
            if (error.message === "Unauthorized") {
                navigate("/login");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createDoctor(formData);

            if (response.status === 201) {
                setFormData({ name: "", email: "", specialty: "", crm: "", phone: "" });
                await getDoctors();
                setSnackbarMessage("Doctor created successfully.");
                setSnackbarSeverity("success");
            } else if(response.status === 409) {
                const errorData = await response.text();
                setSnackbarMessage(errorData);
                setSnackbarSeverity("error");
            } else {
                setSnackbarMessage("Error creating Doctor. Please try again later.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Please try again later.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    }

    const handleDeleteDoctor = async(doctorId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
        if (!confirmDelete) return;

        try {
            const response = await deleteDoctor(doctorId);

            if (response.ok) {
                setSnackbarMessage("Doctor deleted successfully.");
                setSnackbarSeverity("success");
                await getDoctors();
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Please try again.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    }


    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Manage Doctors</Typography>
                <Button variant="contained" color="warning" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </Button>
            </Box>

            <Card sx={{ padding: 3, mb: 3 }}>
                <Typography variant="h6" mb={2}>Add a New Doctor</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField label="CRM" name="crm" value={formData.crm} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth required />
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
                            Add Doctor
                        </Button>
                    </Stack>
                </form>
            </Card>

            {/* Doctors List */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Skeleton variant="rectangular" width="100%" height={80} />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {doctors.map((doctor) => (
                        <Grid item xs={12} key={doctor.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{doctor.name}</Typography>
                                    <Typography color="textSecondary">{doctor.specialty} | CRM: {doctor.crm}</Typography>
                                    <Typography color="textSecondary">{doctor.email} - {doctor.phone}</Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => handleDeleteDoctor(doctor.id)}
                                        sx={{
                                            "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Doctors;
