import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

const API_URL = process.env.EXPO_PUBLIC_API_URL || API_CONFIG.baseURL;

export const useBranches = () => {
    const [branches, setBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    const loadBranches = useCallback(async () => {
        try {
            setLoading(true);
            console.log('🔄 loadBranches iniciado...');
            
            // Primero intentar cargar de AsyncStorage
            const saved = await AsyncStorage.getItem('currentBranch');
            if (saved && isMounted.current) {
                const savedBranch = JSON.parse(saved);
                setCurrentBranch(savedBranch);
                console.log('✅ Sucursal actual cargada:', savedBranch.name);
            }

            // Luego cargar todas las sucursales del API
            const user = await AsyncStorage.getItem('user');
            if (!user) {
                console.warn('❌ No hay usuario en AsyncStorage');
                if (isMounted.current) setLoading(false);
                return;
            }

            const userData = JSON.parse(user);
            const orgId = userData.organization_id;
            
            if (!orgId) {
                console.warn('❌ No hay organization_id en userData');
                if (isMounted.current) setLoading(false);
                return;
            }

            console.log('📡 Llamando API para org:', orgId);
            const url = `${API_URL}/branches/organization/${orgId}`;
            console.log('🔗 URL:', url);

            // Obtener token del usuario
            const token = userData.access_token || userData.token;
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers });
            console.log('📊 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Sucursales obtenidas:', data.length, 'sucursales');
                data.forEach((b, i) => {
                    console.log(`   [${i + 1}] ${b.name} (${b.id})`);
                });
                
                if (isMounted.current) {
                    setBranches(data);

                    // Si no hay rama guardada pero hay sucursales, usar la primera
                    if (!saved && data.length > 0) {
                        setCurrentBranch(data[0]);
                        await AsyncStorage.setItem('currentBranch', JSON.stringify(data[0]));
                        console.log('✅ Primera sucursal establecida:', data[0].name);
                    }
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Error en API:', response.status, errorText);
            }
        } catch (err) {
            console.error('❌ Error loading branches:', err.message);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        loadBranches();

        return () => {
            isMounted.current = false;
        };
    }, [loadBranches]);

    const selectBranch = async (branch) => {
        console.log('🔀 Cambiando a sucursal:', branch.name);
        if (isMounted.current) {
            setCurrentBranch(branch);
        }
        await AsyncStorage.setItem('currentBranch', JSON.stringify(branch));
    };

    return {
        branches,
        currentBranch,
        loading,
        selectBranch,
        refreshBranches: loadBranches,
    };
};
