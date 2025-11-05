import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with credentials enabled for cookie-based auth
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // This is crucial for sending cookies cross-origin
});


export async function registerUser(data){
    try {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}


export async function loginUser(data) {
    try {
        const response = await axiosInstance.post('/auth/login', data);
        console.log("Login response:", response.data);
        
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('userSignedIn', 'true');
        }
        
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await axiosInstance.post('/auth/logout', {});
        console.log("Logout response:", response);
        if(response.status === 200){
            localStorage.removeItem('user');
            localStorage.removeItem('userSignedIn');
        }

        return response.data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
}

// Event/Slot Management APIs
export async function getMyEvents() {
    try {
        const response = await axiosInstance.get('/events');
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export async function createEvent(data) {
    try {
        const response = await axiosInstance.post('/events', data);
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

export async function updateEvent(eventId, data) {
    try {
        console.log("Updating event:", eventId, data);
        const response = await axiosInstance.put(`/events/${eventId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

export async function deleteEvent(eventId) {
    try {
        const response = await axiosInstance.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

// Marketplace APIs
export async function getSwappableSlots() {
    try {
        const response = await axiosInstance.get('/swappable-slots');
        return response.data;
    } catch (error) {
        console.error("Error fetching swappable slots:", error);
        throw error;
    }
}

// Swap Request APIs
export async function createSwapRequest(mySlotId, theirSlotId) {
    try {
        const response = await axiosInstance.post('/swap-request', { mySlotId, theirSlotId });
        return response.data;
    } catch (error) {
        console.error("Error creating swap request:", error);
        throw error;
    }
}

export async function getSwapRequests() {
    try {
        const response = await axiosInstance.get('/swap-requests');
        return response.data;
    } catch (error) {
        console.error("Error fetching swap requests:", error);
        throw error;
    } 
}

export async function respondToSwapRequest(requestId, accept) {
    try {
        const response = await axiosInstance.post(`/swap-response/${requestId}`, { accept });
        return response.data;
    } catch (error) {
        console.error("Error responding to swap request:", error);
        throw error;
    }
}

