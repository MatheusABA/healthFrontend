import React, { useState, useEffect } from "react";
import {
    Container, TextField, Button, Typography, Grid, Box, CircularProgress, Snackbar, Alert,
    InputLabel, MenuItem, FormControl, Select, Card, CardContent, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchDoctors, fetchPatients, createSchedule } from "../api/api";
import AddIcon from "@mui/icons-material/Add";

const Schedules = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: "",
        patient_id: "",
        date: "",
        time: "",
        description: "",
        status: "pending",
    });
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const doctorsData = await fetchDoctors();
                const patientsData = await fetchPatients();
                setDoctors(doctorsData);
                setPatients(patientsData);
            } catch (error) {
                setSnackbarMessage("Error loading doctors and patients.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };
    //

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await createSchedule(formData);

            if (response.status === 201) {
                setSnackbarMessage("Schedule created successfully.");
                setSnackbarSeverity("success");
                setFormData({
                    doctor_id: "",
                    patient_id: "",
                    date: "",
                    time: "",
                    description: "",
                    status: "pending",
                });
            } else {
                setSnackbarMessage("Error creating schedule.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Please try again.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Create Schedule</Typography>
                <Button variant="contained" color="warning" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </Button>
            </Box>


            <Card sx={{ padding: 3, mb: 3 }}>
                <Typography variant="h6" mb={2}>Create a New Schedule</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Doctor</InputLabel>
                                <Select
                                    name="doctor_id"
                                    value={formData.doctor_id}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                >
                                    {filteredDoctors.map((doctor) => (
                                        <MenuItem key={doctor.id} value={doctor.id}>
                                            {doctor.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Patient</InputLabel>
                                <Select
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                >
                                    {filteredPatients.map((patient) => (
                                        <MenuItem key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Time"
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} fullWidth>
                                Add Schedule
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                    <CircularProgress />
                </Box>
            )}

            {/* Snackbar */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Schedules;
