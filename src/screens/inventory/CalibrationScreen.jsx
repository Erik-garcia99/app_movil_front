import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { API_BASE_URL } from '../../constants/config';

export default function CalibrationScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const { shelfId, gatewayIp, shelfName } = route.params || {};
    const insets = useSafeAreaInsets();
    
    const [step, setStep] = useState(1); // 1: tara, 2: peso referencia, 3: resumen
    const [calibrating, setCalibrating] = useState(false);
    const [referenceWeight, setReferenceWeight] = useState('');
    const [result, setResult] = useState(null);
    const [currentWeight, setCurrentWeight] = useState(null);
    const [token, setToken] = useState(null);
    const [tokenLoading, setTokenLoading] = useState(true);

    // Obtener token de AsyncStorage
    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('access_token');
                setToken(storedToken);
                if (!storedToken) {
                    console.warn('No se encontró token en AsyncStorage');
                }
            } catch (error) {
                console.error('Error obteniendo token:', error);
            } finally {
                setTokenLoading(false);
            }
        };
        getToken();
    }, []);
    
    // Simular lectura de peso (en realidad deberías obtenerlo del backend o WebSocket)
    useEffect(() => {
        const interval = setInterval(() => {
            // Aquí podrías consultar el backend para obtener el peso actual
            // Por ahora, simula un valor aleatorio
            setCurrentWeight((Math.random() * 5).toFixed(2));
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    
    const handleTare = async () => {
        // Si el token aún está cargando, espera
        if (tokenLoading) {
            Alert.alert('Espera', 'La sesión se está cargando...');
            return;
        }
        
        // Si no hay token, intenta cargar de nuevo
        let currentToken = token;
        if (!currentToken) {
            try {
                currentToken = await AsyncStorage.getItem('access_token');
                setToken(currentToken);
            } catch (error) {
                console.error('Error cargando token:', error);
            }
        }
        
        if (!currentToken) {
            Alert.alert('Error de autenticación', 'No hay sesión activa. Por favor, cierra sesión y vuelve a iniciar.');
            return;
        }
        
        setCalibrating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/rpi/calibrate/${shelfId}/tare`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al iniciar tara');
            }
            
            // Esperar confirmación desde el servidor (polling)
            await waitForCalibrationResult(currentToken, 30000); // timeout 30s
            
            setCalibrating(false);
            setStep(2);
            Alert.alert('Tara completada', 'El estante ha sido tarado. Ahora coloca un peso de referencia.');
        } catch (error) {
            console.error('Error en tara:', error);
            Alert.alert('Error', `No se pudo realizar la tara: ${error.message}`);
            setCalibrating(false);
        }
    };
    
    const waitForCalibrationResult = async (token, timeoutMs = 30000) => {
        const startTime = Date.now();
        
        // Obtener datos iniciales del estante
        const initialShelf = await fetch(`${API_BASE_URL}/rpi/shelf/${shelfId}/full`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        
        const initialLastCalibrated = initialShelf.last_calibrated_at;
        
        // Polling hasta que se actualice last_calibrated_at
        while (Date.now() - startTime < timeoutMs) {
            const currentShelf = await fetch(`${API_BASE_URL}/rpi/shelf/${shelfId}/full`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json());
            
            if (currentShelf.last_calibrated_at !== initialLastCalibrated && currentShelf.last_calibrated_at) {
                console.log('[CalibrationScreen] Calibración confirmada en BD');
                return;
            }
            
            // Esperar 1 segundo antes de revisar de nuevo
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error('Timeout esperando confirmación de calibración');
    };
    
    const handleScale = async () => {
        // Si el token aún está cargando, espera
        if (tokenLoading) {
            Alert.alert('Espera', 'La sesión se está cargando...');
            return;
        }
        
        // Si no hay token, intenta cargar de nuevo
        let currentToken = token;
        if (!currentToken) {
            try {
                currentToken = await AsyncStorage.getItem('access_token');
                setToken(currentToken);
            } catch (error) {
                console.error('Error cargando token:', error);
            }
        }
        
        if (!currentToken) {
            Alert.alert('Error de autenticación', 'No hay sesión activa. Por favor, cierra sesión y vuelve a iniciar.');
            return;
        }
        
        const weight = parseFloat(referenceWeight);
        if (isNaN(weight) || weight <= 0) {
            Alert.alert('Error', 'Ingresa un peso válido en kilogramos');
            return;
        }
        
        setCalibrating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/rpi/calibrate/${shelfId}/scale`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reference_weight_kg: weight })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al calibrar');
            }
            
            // Esperar confirmación desde el servidor (polling)
            await waitForScaleCalibrationResult(currentToken, 30000); // timeout 30s
            
            setCalibrating(false);
            setStep(3);
            setResult({ success: true, message: 'Calibración exitosa' });
        } catch (error) {
            console.error('Error en calibración:', error);
            Alert.alert('Error', `No se pudo calibrar: ${error.message}`);
            setCalibrating(false);
        }
    };
    
    const waitForScaleCalibrationResult = async (token, timeoutMs = 30000) => {
        const startTime = Date.now();
        
        // Obtener datos iniciales del estante
        const initialShelf = await fetch(`${API_BASE_URL}/rpi/shelf/${shelfId}/full`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        
        const initialScaleFactor = initialShelf.scale_factor || 1.0;
        
        // Polling hasta que scale_factor cambien (indican que se aplicó la calibración)
        while (Date.now() - startTime < timeoutMs) {
            const currentShelf = await fetch(`${API_BASE_URL}/rpi/shelf/${shelfId}/full`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json());
            
            const currentScaleFactor = currentShelf.scale_factor || 1.0;
            
            // Si el factor de escala cambió significativamente, calibración exitosa
            if (Math.abs(currentScaleFactor - initialScaleFactor) > 0.01) {
                console.log(`[CalibrationScreen] Escala actualizada: ${initialScaleFactor} -> ${currentScaleFactor}`);
                return;
            }
            
            // Esperar 1 segundo antes de revisar de nuevo
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error('Timeout esperando confirmación de calibración');
    };
    
    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <TopHeader navigation={navigation} userRole={userRole} />
            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>calibración</Text>
            </View>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={localStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={localStyles.content}>
                {step === 1 && (
                    <View style={localStyles.card}>
                        <Text style={localStyles.title}>Paso 1: Tara</Text>
                        <Text style={localStyles.description}>
                            1. Retira todos los productos del estante.{'\n'}
                            2. Asegúrate de que el estante esté vacío y estable.{'\n'}
                            3. Presiona "Empezar tara".
                        </Text>
                        <View style={localStyles.weightContainer}>
                            <Text style={localStyles.weightLabel}>Peso detectado:</Text>
                            <Text style={localStyles.weightValue}>{currentWeight ? `${currentWeight} Kg` : '---'}</Text>
                        </View>
                        <TouchableOpacity style={localStyles.button} onPress={handleTare} disabled={calibrating}>
                            <Text style={localStyles.buttonText}>{calibrating ? 'Tarando...' : 'Empezar tara'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                {step === 2 && (
                    <View style={localStyles.card}>
                        <Text style={localStyles.title}>Paso 2: Peso de referencia</Text>
                        <Text style={localStyles.description}>
                            1. Coloca un objeto con peso conocido en el estante.{'\n'}
                            2. Ingresa el peso exacto en kilogramos.
                        </Text>
                        <View style={localStyles.weightContainer}>
                            <Text style={localStyles.weightLabel}>Peso detectado:</Text>
                            <Text style={localStyles.weightValue}>{currentWeight ? `${currentWeight} Kg` : '---'}</Text>
                        </View>
                        <TextInput
                            style={localStyles.input}
                            placeholder="Peso real (kg)"
                            keyboardType="numeric"
                            value={referenceWeight}
                            onChangeText={setReferenceWeight}
                        />
                        <TouchableOpacity style={localStyles.button} onPress={handleScale} disabled={calibrating}>
                            <Text style={localStyles.buttonText}>{calibrating ? 'Calibrando...' : 'Calibrar'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                {step === 3 && result && (
                    <View style={localStyles.card}>
                        <Text style={localStyles.title}>Resumen de calibración</Text>
                        {result.success ? (
                            <>
                                <CheckCircle size={48} color="#4CAF50" style={{ alignSelf: 'center', marginVertical: 20 }} />
                                <Text style={localStyles.successText}>¡Calibración completada con éxito!</Text>
                                <Text style={localStyles.description}>
                                    El estante ahora está listo para medir correctamente.
                                    Se recomienda calibrar cada 3 meses.
                                </Text>
                            </>
                        ) : (
                            <>
                                <XCircle size={48} color="#F44336" style={{ alignSelf: 'center', marginVertical: 20 }} />
                                <Text style={localStyles.errorText}>Error durante la calibración. Intenta de nuevo.</Text>
                            </>
                        )}
                        <TouchableOpacity style={localStyles.button} onPress={() => navigation.goBack()}>
                            <Text style={localStyles.buttonText}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
                </ScrollView>
            </KeyboardAvoidingView>
            
            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    subHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginLeft: 10 },
    scrollContent: { paddingBottom: 20 },
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    card: { backgroundColor: '#F3EFE9', borderRadius: 12, padding: 20, marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 15 },
    description: { fontSize: 14, color: '#333', marginBottom: 20, lineHeight: 20 },
    weightContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 20, alignItems: 'center' },
    weightLabel: { fontSize: 14, color: '#666' },
    weightValue: { fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 5 },
    input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginBottom: 20 },
    button: { backgroundColor: '#354A5F', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    successText: { fontSize: 16, color: '#4CAF50', textAlign: 'center', marginVertical: 10 },
    errorText: { fontSize: 16, color: '#F44336', textAlign: 'center', marginVertical: 10 }
});