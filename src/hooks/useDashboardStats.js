import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

const API_URL = process.env.EXPO_PUBLIC_API_URL || API_CONFIG.baseURL;

export const useDashboardStats = () => {
    const [branch, setBranch] = useState(null);
    const [stats, setStats] = useState({
        inventory_value: 0,
        sales_today: 0,
        sales_count_today: 0,
        products_count: 0,
        low_stock_count: 0,
        daily_sales_data: [],
        margins: {
            current_margin: 0,
            margin_percentage: 0,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener sucursal actual
            const currentBranch = await AsyncStorage.getItem('currentBranch');
            if (!currentBranch) {
                setLoading(false);
                return;
            }

            const branchData = JSON.parse(currentBranch);
            setBranch(branchData);

            // Obtener estadísticas del dashboard
            const user = await AsyncStorage.getItem('user');
            const headers = { 'Content-Type': 'application/json' };
            
            if (user) {
                const userData = JSON.parse(user);
                const token = userData.access_token || userData.token;
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(
                `${API_URL}/dashboard/${branchData.id}/stats`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                // Si hay error, mantener valores por defecto
                console.warn('No se pudieron obtener estadísticas del dashboard');
            }
        } catch (err) {
            console.error('Error loading dashboard stats:', err);
            setError(err.message);
            // Mantener valores por defecto
        } finally {
            setLoading(false);
        }
    };

    const refreshStats = async () => {
        await loadDashboardData();
    };

    return {
        branch,
        stats,
        loading,
        error,
        refreshStats,
    };
};
