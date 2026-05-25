import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';

export default function SurtidoSetupScreen({ navigation, route }) {
    const { branchId } = route.params;
    const [proveedor, setProveedor] = useState('');
    const [referencia, setReferencia] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const verificarProveedor = async () => {
        if (!proveedor.trim() || !referencia.trim()) {
            Alert.alert('Faltan datos', 'Ingresa el proveedor y el número de referencia.');
            return;
        }

        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/rpi/supplier/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: proveedor.trim() })
            });

            if (!response.ok) throw new Error('Error al verificar el proveedor');

            const data = await response.json();
            
            // Si el backend lo acaba de crear, le avisamos al usuario
            if (data.status === 'created') {
                Alert.alert('Nuevo Proveedor', `No existía "${data.name}". Se ha registrado automáticamente como nuevo proveedor.`);
            }

            // Pasamos a la siguiente pantalla con los datos validados
            navigation.navigate('SurtidoIngreso', { 
                branchId, 
                proveedor: data.name, // Usamos el nombre validado del backend
                proveedorId: data.supplier_id,
                referencia: referencia.trim() 
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo conectar con el servidor para verificar el proveedor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>surtido</Text>
                <View style={styles.dot} />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>proveedor/referencia</Text>
                
                <Text style={styles.label}>proveedor</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="ej: Tia rosa" 
                    value={proveedor}
                    onChangeText={setProveedor}
                />

                <Text style={styles.label}>No. referencia</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="ej: 23453" 
                    keyboardType="numeric"
                    value={referencia}
                    onChangeText={setReferencia}
                />
            </View>

            {/* Nuevo botón central y claro */}
            <View style={styles.footerCenter}>
                <TouchableOpacity 
                    style={[styles.mainButton, isLoading && { opacity: 0.7 }]} 
                    onPress={verificarProveedor}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.mainButtonText}>Verificar y Continuar</Text>
                            <ArrowRight size={24} color="#FFF" style={{ marginLeft: 10 }} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 40 },
    title: { fontSize: 24, fontWeight: '900', marginLeft: 10 },
    dot: { width: 10, height: 10, backgroundColor: '#4ADE80', borderRadius: 5, marginLeft: 5 },
    card: { backgroundColor: '#F5EFEB', margin: 20, padding: 20, borderRadius: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    label: { fontSize: 14, color: '#333', marginBottom: 5 },
    input: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    
    // Estilos del nuevo botón
    footerCenter: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    mainButton: {
        backgroundColor: '#354A5F',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    mainButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
