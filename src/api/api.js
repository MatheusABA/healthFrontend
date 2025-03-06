const API_URL = import.meta.env.VITE_API_URL;

// -------------- TOKEN AND HEADERS SECTION ---------------------
/**
 * Function to get token on localStorage
 * @returns {string} String with token
 */
const getToken = () => {
    return localStorage.getItem("token");
}

/**
 * Get request headers
 * @returns {{"Content-Type": string, Authorization: string}}
 */
const authHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `${getToken()}`,
    };
};


const headers = () => {
    return {
        "Content-Type": "application/json",
        "Application-Type": "application/json",
    }
}


// --------------------- LOGIN AND SIGN UP SECTION ----------------
/**
 *
 * @param loginData User email and pass
 * @returns User data after login
 */
export const login = async (loginData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        return {
            status: response.status,
            data,
        }


    } catch (error) {
        return {
            status: 401,
            data: { error: "An unexpected error occurred." }
        }
    }
}


// --------------------- PATIENTS API SECTION --------------------
/**
 *
 * @returns All patients
 */
export const fetchPatients = async () => {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'GET',
            headers: authHeaders(),
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Unauthorized");
        }


    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPatient = async (patientData) => {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(patientData),
        });

        return await response;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePatient = async (patientId) => {
    try {
        const response = await fetch(`${API_URL}/patients/${patientId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (response.status === 204) {
            await fetchPatients()
            return await response;
        } else {
            throw new Error("Failed to delete patient");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// --------------------- DOCTORS API SECTION --------------------


/**
 * Fetch all doctors
 * @returns {Promise<any>}
 */
export const fetchDoctors = async () => {
    try {
        const response = await fetch(`${API_URL}/doctors`, {
            method: 'GET',
            headers: authHeaders(),
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


/**
 * Create a new doctor
 * @param doctorData
 * @returns {Promise<Response>}
 */
export const createDoctor = async (doctorData) => {
    try {
        const response = await fetch(`${API_URL}/doctors`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(doctorData)
        })

        return await response;

    } catch (error) {
        throw error;
    }
}

export const deleteDoctor = async (doctorId) => {
    try {
        const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (response.ok) {
            await fetchDoctors();
            return await response;
        } else {
            throw new Error("Failed to delete doctor");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ---------------------- SCHEDULES API SECTION
export const createSchedule = async (scheduleData) => {
    try {
        const response = await fetch(`${API_URL}/schedules`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(scheduleData),
        })

        return await response;
    } catch (error) {
        throw error;
    }
}


export const fetchTodayAppointments = async () => {
    try {
        const response = await fetch(`${API_URL}/schedules/today`, {
            method: 'GET',
            headers: authHeaders(),
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteSchedule = async (scheduleId) => {
    try {
        const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to delete schedule");
        }

        return response;

    } catch (error) {
        console.error(error);
        throw error;
    }
};