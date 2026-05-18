import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Save, Edit2, Settings, AlertCircle } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { supabaseClient } from '../../api/supabaseClient';
import CustomAlert from '../../components/common/CustomAlert';
import { API_BASE_URL } from '../../constants/config';


import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShelfDetailScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const { shelfId, gatewayIp, nodeName, shelfName: initialShelfName } = route.params || {};
    const insets = useSafeAreaInsets();
    
    const [shelf, setShelf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [editName, setEditName] = useState('');
    const [token, setToken] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });
    
    useEffect(() => {
        const loadToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                if (accessToken) setToken(accessToken);
                else {
                    // Si no hay token, quitamos el loading para no dejar la pantalla infinita
                    setLoading(false);
                    Alert.alert("Error", "No se encontró sesión de usuario.");
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        loadToken();
    }, []);
    
    useEffect(() => {
        if (token && shelfId) fetchShelfDetails();
    }, [token, shelfId]);

    // Refrescar datos cuando la pantalla se enfoca (ej: al volver de AddProductScreen)
    useFocusEffect(
        React.useCallback(() => {
            if (token && shelfId) {
                fetchShelfDetails();
            }
        }, [token, shelfId])
    );
    
    
    const fetchShelfDetails = async () => {
        try {
            const apiUrl = API_BASE_URL;
            const response = await fetch(`${apiUrl}/rpi/shelf/${shelfId}/full`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar');
            const data = await response.json();
            setShelf(data);
            setEditName(data.name);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudieron cargar los detalles del estante');
        } finally {
            setLoading(false);
        }
    };
    
    const updateShelfName = async () => {
        if (!editName.trim()) return;
        try {
            const apiUrl = API_BASE_URL;
            const response = await fetch(`${apiUrl}/rpi/shelf/${shelfId}/name`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim() })
            });
            if (!response.ok) throw new Error();
            setShelf({ ...shelf, name: editName.trim() });
            setEditingName(false);

            if (gatewayIp) {
                try {
                    // Endpoint local en la Raspberry para actualizar su SQLite de inmediato
                    await fetch(`http://${gatewayIp}:8000/local/config/shelf`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            shelf_id: shelfId, 
                            name: editName.trim() 
                        })
                    });
                } catch (e) {
                            console.log("RPI no alcanzable localmente, sincronizará por polling.");
                }
            }
            Alert.alert('Éxito', 'Nombre actualizado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el nombre');
        }
    };
    
    const handleCalibrate = () => {
        navigation.navigate('Calibration', { shelfId, gatewayIp, shelfName: shelf?.name });
    };
    const saveBasicInfo = async () => {
        try {
            const apiUrl = API_BASE_URL;
            
            // Enviamos la actualización al endpoint de nombre (puedes replicar para producto)
            const response = await fetch(`${apiUrl}/rpi/shelf/${shelfId}/name`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ name: editName.trim() })
            });

            if (response.ok) {
                setAlertConfig({
                    type: 'success',
                    title: 'Éxito',
                    message: 'Información básica actualizada correctamente.'
                });
                setAlertVisible(true);
                setEditingName(false); // Cerramos el modo edición si estaba abierto
            } else {
                throw new Error();
            }
        } catch (error) {
            setAlertConfig({
                type: 'error',
                title: 'Error',
                message: 'No se pudo guardar la configuración.'
            });
            setAlertVisible(true);
        }
    };

    const handleProductUpdate = async (field, value) => {
        if (!shelf || !shelf.product) return;
        
        try {
            const apiUrl = API_BASE_URL;
            const updateData = {};
            
            if (field === 'name') {
                updateData.name = value;
            } else if (field === 'weight') {
                updateData.unit_weight_grams = parseFloat(value) || 0;
            }
            
            const response = await fetch(`${apiUrl}/rpi/product/${shelf.product.id}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                // Actualizar el estado local
                setShelf({
                    ...shelf,
                    product: {
                        ...shelf.product,
                        [field === 'name' ? 'name' : 'unit_weight_grams']: field === 'name' ? value : parseFloat(value)
                    }
                });
            } else {
                Alert.alert('Error', 'No se pudo actualizar el producto');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrió un error al actualizar el producto');
        }
    };
    


    if (loading) {
        return (
            <View style={[globalStyles.container, { backgroundColor: '#607D8B', justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    
    if (!shelf) return null;
    
    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <TopHeader navigation={navigation} userRole={userRole} />
            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>detalles del estante</Text>
            </View>
            
            <ScrollView contentContainerStyle={localStyles.scrollContainer}>
                <View style={localStyles.card}>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Nombre:</Text>
                        {editingName ? (
                            <View style={localStyles.editRow}>
                                <TextInput style={localStyles.input} value={editName} onChangeText={setEditName} autoFocus />
                                <TouchableOpacity onPress={updateShelfName} style={localStyles.saveBtn}>
                                    <Save size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={localStyles.editRow}>
                                <Text style={localStyles.value}>{shelf.name}</Text>
                                <TouchableOpacity onPress={() => setEditingName(true)}>
                                    <Edit2 size={18} color="#607D8B" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Pin HX711:</Text>
                        <Text style={localStyles.value}>{shelf.hx711_pin}</Text>
                    </View>
                    
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Estado:</Text>
                        <Text style={[localStyles.value, { color: shelf.is_connected ? '#4CAF50' : '#FF9800' }]}>
                            {shelf.is_connected ? 'Conectado' : 'Desconectado'}
                        </Text>
                    </View>
                    
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Última lectura:</Text>
                        <Text style={localStyles.value}>{shelf.last_reading_at ? new Date(shelf.last_reading_at).toLocaleString() : 'Nunca'}</Text>
                    </View>
                    
                    <View style={localStyles.divider} />
                    
                    <Text style={localStyles.sectionTitle}>Producto asociado</Text>
                    {shelf.product ? (
                        <>
                            <View style={localStyles.row}>
                                <Text style={localStyles.label}>Nombre del Producto:</Text>
                                <TextInput 
                                    style={localStyles.input}
                                    placeholder="Ej. Chiles en rajas" // Placeholder si no hay dato
                                    value={shelf.product?.name || ""}
                                    onChangeText={(text) => handleProductUpdate('name', text)}
                                />
                            </View>

                            <View style={localStyles.row}>
                                <Text style={localStyles.label}>Peso Unitario (g):</Text>
                                <TextInput 
                                    style={localStyles.input}
                                    placeholder="000 g"
                                    keyboardType="numeric"
                                    value={shelf.product?.unit_weight_grams?.toString() || ""}
                                    onChangeText={(text) => handleProductUpdate('weight', text)}
                                />
                            </View>
                        </>
                    ) : (
                        <Text style={localStyles.placeholder}>No hay producto asignado</Text>
                    )}
                    
                    <TouchableOpacity style={localStyles.button} onPress={() => navigation.navigate('AddProduct', { shelfId: shelf.id })}>
                        <Text style={localStyles.buttonText}>Asignar producto</Text>
                    </TouchableOpacity>
                    
                    <View style={localStyles.divider} />
                    
                    <Text style={localStyles.sectionTitle}>Configuración de inventario</Text>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Umbral bajo stock (kg):</Text>
                        <Text style={localStyles.value}>{shelf.low_stock_threshold_kg || 'No definido'}</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Capacidad máxima (g):</Text>
                        <Text style={localStyles.value}>{shelf.max_capacity_grams || 'No definida'}</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Modo alerta:</Text>
                        <Text style={localStyles.value}>{shelf.alert_mode}</Text>
                    </View>
                    
                    <View style={localStyles.divider} />
                    
                    <Text style={localStyles.sectionTitle}>Calibración</Text>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Factor de escala:</Text>
                        <Text style={localStyles.value}>{shelf.scale_factor}</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>Última calibración:</Text>
                        <Text style={localStyles.value}>{shelf.last_calibrated_at ? new Date(shelf.last_calibrated_at).toLocaleString() : 'Nunca'}</Text>
                    </View>
                    
                    <TouchableOpacity style={localStyles.button} onPress={handleCalibrate}>
                        <Text style={localStyles.buttonText}>Calibrar estante</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
       
            <CustomAlert 
                    visible={alertVisible}
                    type={alertConfig.type}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onClose={() => setAlertVisible(false)}
                />
                
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    subHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginLeft: 10 },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: '#F3EFE9', borderRadius: 12, padding: 20, marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 14, fontWeight: '600', color: '#333' },
    value: { fontSize: 14, color: '#000', maxWidth: '60%', textAlign: 'right' },
    editRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    input: { backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, width: 150, borderWidth: 1, borderColor: '#ddd' },
    saveBtn: { backgroundColor: '#4CAF50', padding: 6, borderRadius: 6 },
    divider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 },
    placeholder: { fontSize: 14, color: '#999', fontStyle: 'italic', marginBottom: 12 },
    button: { backgroundColor: '#354A5F', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: '600' }
});