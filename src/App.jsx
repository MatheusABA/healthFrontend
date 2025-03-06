import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "././pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Doctors from "./pages/Doctors.jsx";
import Patients from "./pages/Patients.jsx";
import Schedules from "./pages/Schedules.jsx";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />


                    {/* PROTECTED ROUTES */}
                    <Route element={<ProtectedRoute />}>

                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/schedules" element={<Schedules />} />

                    </Route>

                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
