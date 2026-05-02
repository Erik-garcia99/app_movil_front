import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.66:8000/api/v1';

const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('access_token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const usersAPI = {
    // Obtener el perfil del usuario actual
    getCurrentUserProfile: async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Obtener los empleados a cargo del usuario actual
    getMyTeam: async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/users/my-team`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Actualizar el estado de un empleado
    updateUserStatus: async (userId, status) => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Asignar supervisor a un empleado
    assignSupervisor: async (userId, supervisorId) => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/users/${userId}/assign-supervisor`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    supervisor_id: supervisorId
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
