import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function CalibrationScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const { shelfId, gatewayIp, shelfName } = route.params || {};
    const insets = useSafeAreaInsets();
    
    const [step, setStep] = useState(1); // 1: tara, 2: peso referencia, 3: resumen
    const [calibrating, setCalibrating] = useState(false);
    const [referenceWeight, setReferenceWeight] = useState('');
    const [result, setResult] = useState(null);
    const [currentWeight, setCurrentWeight] = useState(null);
    
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
        setCalibrating(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/v1/rpi/calibrate/${shelfId}/tare`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al iniciar tara');
            // Esperar un momento para que el ESP32 procese
            setTimeout(() => {
                setCalibrating(false);
                setStep(2);
                Alert.alert('Tara completada', 'El estante ha sido tarado. Ahora coloca un peso de referencia.');
            }, 3000);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo realizar la tara. Verifica que la RPI esté accesible.');
            setCalibrating(false);
        }
    };
    
    const handleScale = async () => {
        const weight = parseFloat(referenceWeight);
        if (isNaN(weight) || weight <= 0) {
            Alert.alert('Error', 'Ingresa un peso válido en kilogramos');
            return;
        }
        setCalibrating(true);
        try {

            const response = await fetch(`${apiUrl}/api/v1/rpi/calibrate/${shelfId}/scale`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reference_weight_kg: weight })
            });
            if (!response.ok) throw new Error('Error al calibrar');
            setTimeout(() => {
                setCalibrating(false);
                setStep(3);
                setResult({ success: true, message: 'Calibración exitosa' });
            }, 3000);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo calibrar');
            setCalibrating(false);
        }
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
            
            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    subHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginLeft: 10 },
    content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
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