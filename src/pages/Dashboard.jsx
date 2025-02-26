import React, {useState} from 'react';
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
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import { Logout, CalendarMonth, People, LocalHospital } from "@mui/icons-material";

const drawerWidth = 240;

const Dashboard = () => {

    const navigate = useNavigate();
    const [ísLoading, setIsLoading] = useState(false);
    const [todayAppointments, setTodayAppointments] = useState([]);

    const menuItems = [
        { text: "Schedules", path: "/schedules", icon: <CalendarMonth /> },
        { text: "Patients", path: "/patients", icon: <People /> },
        { text: "Doctors", path: "/doctors", icon: <LocalHospital /> }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // fetch appointments


    // check jwt token



    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Navbar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" noWrap component="div" sx={{ cursor: "pointer" }} >
                        Receptionist Dashboard
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
                        <ListItem button key={item.text} onClick={() => navigate(item.path)} sx={{ cursor: "pointer" }}>
                            {item.icon}
                            <ListItemText primary={item.text} sx={{ marginLeft: 1 }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>


            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container>
                    <Typography variant="h4">Welcome to the Scheduling Dashboard</Typography>
                    <Typography variant="body1">Select an option from the sidebar</Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
