import React, { useState, useEffect } from "react";
import {
    Container, TextField, Button, Typography, Box, CircularProgress,
    Snackbar, Alert, IconButton, Card, CardContent, CardActions, Grid, Stack, Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { fetchPatients, createPatient, deletePatient } from "../api/api.js";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", age: "", phone: "", address: "" , medicalHistory: ""});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem("token") || "");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (token) getPatients();
        else navigate("/login");
    }, [token]);

    const getPatients = async () => {
        setLoading(true);
        try {
            const patientList = await fetchPatients();
            setPatients(patientList);
        } catch (error) {
            if (error.message === "Unauthorized") navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createPatient(formData);

            if (response.status === 201) {
                setFormData({ name: "", email: "", age: "", phone: "", address: "" , medicalHistory: ""});
                await getPatients();
                setSnackbarMessage("Patient created successfully.");
                setSnackbarSeverity("success");
            } else if (response.status === 409) {
                const errorData = await response.text();
                setSnackbarMessage(errorData);
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Try again later.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleDeletePatient = async (patientId) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try {
            const response = await deletePatient(patientId);
            if (response.ok) {
                setSnackbarMessage("Patient deleted successfully.");
                setSnackbarSeverity("success");
                await getPatients();
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Please try again.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterPatients(value);
    };


    const filterPatients = (term) => {
        const filtered = patients.filter((patient) =>
            patient.name.toLowerCase().includes(term.toLowerCase()) ||
            patient.email.toLowerCase().includes(term.toLowerCase()) ||
            patient.phone.includes(term)
        );
        setFilteredPatients(filtered);
    };


    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Manage Patients</Typography>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </Button>
            </Box>

            {/* Search Bar */}
            <Box mb={3}>
                <TextField
                    label="Search Patient by Name, Email, or Phone"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                />
            </Box>

            {/* Register Form */}
            <Card sx={{ padding: 3, mb: 3 }}>
                <Typography variant="h6" mb={2}>Add a New Patient</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField label="Age" name="age" value={formData.age} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Medical History"
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Enter any relevant medical history here..."
                            />
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
                            Add Patient
                        </Button>
                    </Stack>
                </form>
            </Card>

            {/* Patient List */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Skeleton variant="rectangular" width="100%" height={80} />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredPatients.map((patient) => (
                        <Grid item xs={12} key={patient.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{patient.name}</Typography>
                                    <Typography color="textSecondary">{patient.email} - {patient.phone}</Typography>
                                    <Typography color="textSecondary">Age: {patient.age} | Address: {patient.address}</Typography>
                                    {patient.medicalHistory && (
                                        <Typography variant="body2" mt={1} sx={{ fontStyle: "italic", color: "gray" }}>
                                            {patient.medicalHistory}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => handleDeletePatient(patient.id)}
                                        sx={{ "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" } }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Patients;
