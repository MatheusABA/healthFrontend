import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Container,
    Box,
    IconButton,
    Card,
    CardContent,
    Grid,
    CircularProgress, CardActions, Alert, Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout, CalendarMonth, People, LocalHospital } from "@mui/icons-material";

import {deleteSchedule, fetchTodayAppointments} from "../api/api.js";
import DeleteIcon from "@mui/icons-material/Delete";

const drawerWidth = 240;

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const menuItems = [
        { text: "Schedules", path: "/schedules", icon: <CalendarMonth /> },
        { text: "Patients", path: "/patients", icon: <People /> },
        { text: "Doctors", path: "/doctors", icon: <LocalHospital /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Fetch today's appointments
    const getTodayAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTodayAppointments();
            setTodayAppointments(data);
        } catch (err) {
            setError("Failed to fetch today's appointments");
        } finally {
            setLoading(false);
        }
    };


    const handleScheduleDelete = async(scheduleId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
        if (!confirmDelete) return;

        try {
            const response = await deleteSchedule(scheduleId);

            if (response.ok) {
                setSnackbarMessage("Schedule deleted successfully.");
                setSnackbarSeverity("success");

                await getTodayAppointments();
            }
        } catch (error) {
            setSnackbarMessage("An error occurred. Please try again.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    }

    useEffect(() => {
        getTodayAppointments();
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* Navbar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap component="div" sx={{ cursor: "pointer" }}>
                        Appointment Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} onClick={() => navigate(item.path)} sx={{ cursor: "pointer" }}>
                            {item.icon}
                            <ListItemText primary={item.text} sx={{ marginLeft: 1 }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container>

                    {/* Display today's appointments */}
                    <Box mt={3}>
                        <Typography variant="h5">Today's Appointments</Typography>

                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {todayAppointments.length === 0 ? (
                                    <Box mt={3}>
                                        <Typography ml={3}>No appointments scheduled for today.</Typography>
                                    </Box>
                                ) : (
                                    todayAppointments.map((appointment) => (
                                        <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                                            <Card>
                                                <CardContent>

                                                    {appointment.patient && appointment.patient.name && (
                                                        <Typography variant="body2">Patient: {appointment.patient.name}</Typography>
                                                    )}


                                                    {appointment.doctor && appointment.doctor.name && (
                                                        <Typography variant="body2">Doctor: {appointment.doctor.name}</Typography>
                                                    )}

                                                    {appointment.time && (
                                                        <Typography variant="body2">Time: {appointment.time}</Typography>
                                                    )}

                                                    {appointment.description && (
                                                        <Typography variant="body2">Notes: {appointment.description}</Typography>
                                                    )}
                                                </CardContent>
                                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() => handleScheduleDelete(appointment.id)}
                                                        sx={{
                                                            "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}
                    </Box>

                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>

                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
