const API_URL = import.meta.env.VITE_API_URL;


const getToken = () => {
    return localStorage.getItem("token");
}

const getHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `${getToken()}`,
    };
};


export const fetchPatients = async () => {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'GET',
            headers: getHeaders(),
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
            headers: getHeaders(),
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
            headers: getHeaders(),
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


/**
 * Fetch all doctors
 * @returns {Promise<any>}
 */
export const fetchDoctors = async () => {
    try {
        const response = await fetch(`${API_URL}/doctors`, {
            method: 'GET',
            headers: getHeaders(),
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
            headers: getHeaders(),
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
            headers: getHeaders(),
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
