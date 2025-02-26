import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

    const getToken = () => {
        return localStorage.getItem("token");
    }

    const getHeaders = () => {
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `${getToken()}`,
        }
    }


    useEffect(() => {
        fetchDoctors();
    }, []);



    // Try to fetch doctors
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/doctors", {
                method: "GET",
                headers: getHeaders(),
            });

            if (response.status === 500 || response.status === 401) {
                navigate("/login");

            }

            const data = await response.json();
            setDoctors(data);

        } catch (error) {
            console.error("Error fetching doctors:", error);
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
            const response = await fetch("http://localhost:8080/api/v1/doctors", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setFormData({ name: "", email: "", specialty: "", crm: "", phone: "" });
                await fetchDoctors(); // Update doctors list
                setSnackbarMessage("Doctor added successfully!");
                setSnackbarSeverity("success");
            } else if (response.status === 409) { // 409 Status -> Duplicate data
                const errorData = await response.text();
                setSnackbarMessage(errorData);
                setSnackbarSeverity("error");
            } else {
                setSnackbarMessage("Error adding doctor. Please try again.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.error("Error adding doctor:", error);
            setSnackbarMessage("An unexpected error occurred.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true); // Show snackbar
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Manage Doctors</Typography>
                <Button variant="outlined" color="secondary" onClick={handleBack}>Back to Dashboard</Button>
            </Box>

            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth margin="normal" required />
                <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth margin="normal" required />
                <TextField label="Specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} fullWidth margin="normal" required />
                <TextField label="CRM" name="crm" value={formData.crm} onChange={handleInputChange} fullWidth margin="normal" required />
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth margin="normal" required />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: "1rem" }}>Add Doctor</Button>
            </form>

            {/* Loading se não houver dados */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {doctors.map((doctor) => (
                        <ListItem key={doctor.id}>
                            <ListItemText primary={`${doctor.name} - ${doctor.specialty}`} secondary={`${doctor.email} - ${doctor.phone}`} />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Snackbar para erro/mensagens */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Doctors;
