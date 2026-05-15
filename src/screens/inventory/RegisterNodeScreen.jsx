import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, Save } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';

// LE CAMBIAMOS EL NOMBRE AQUÍ A RegisterNodeScreen
export default function RegisterNodeScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const { branchId } = route.params || {}; // Recibimos el branchId
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodeName, setNodeName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                setToken(accessToken);
            } catch (error) {
                console.error(error);
            }
        };
        loadToken();
    }, []);

    useEffect(() => {
        if (token && branchId) fetchPendingNodes();
    }, [token, branchId]);


    // BUSCAR ESTA FUNCIÓN:
    const fetchPendingNodes = async () => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}/rpi/branch/${branchId}/esp32-nodes`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error();
            const data = await response.json();
            
            // FILTRAMOS SOLO LOS NODOS SIN ASIGNAR (Los que empiezan con Nodo-)
            const pending = data.filter(n => n.name.startsWith('Nodo-'));
            setNodes(pending);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los nodos pendientes');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSelectNode = (node) => {
        setSelectedNode(node);
        setNodeName('');
        setDropdownOpen(false);
    };

    // En RegisterNodeScreen.jsx
    const handleSaveNode = async () => {
        if (!nodeName.trim()) {
            Alert.alert('Aviso', 'Por favor ingresa un nombre para el nodo.');
            return;
        }

        try {
            // Usamos PATCH hacia el endpoint de nombre, como lo tenías antes
            const url = `${API_BASE_URL}/rpi/esp32-node/${selectedNode.id}/name`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: nodeName.trim() }),
            });
            
            if (!response.ok) throw new Error();
            
            Alert.alert('Éxito', 'Nodo registrado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el nombre del nodo');
        }
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, { backgroundColor: '#607D8B', justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <TopHeader navigation={navigation} userRole={userRole} />
            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>registrar nuevo nodo</Text>
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContainer}>
                <View style={localStyles.card}>
                    <Text style={localStyles.cardTitle}>seleccionar nodo pendiente</Text>
                    
                    <TouchableOpacity style={localStyles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)}>
                        <Text style={localStyles.dropdownText}>
                            {selectedNode ? selectedNode.name : 'Selecciona un nodo...'}
                        </Text>
                        <ChevronDown size={20} color="#000" />
                    </TouchableOpacity>

                    {dropdownOpen && (
                        <View style={localStyles.dropdownMenu}>
                            {nodes.length === 0 ? (
                                <View style={localStyles.dropdownItem}>
                                    <Text style={localStyles.dropdownItemText}>No hay nodos nuevos detectados</Text>
                                </View>
                            ) : (
                                nodes.map(node => (
                                    <TouchableOpacity 
                                        key={node.id} 
                                        style={localStyles.dropdownItem} 
                                        onPress={() => handleSelectNode(node)}
                                    >
                                        <Text style={localStyles.dropdownItemText}>{node.name}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}

                    {selectedNode && (
                        <View style={localStyles.formContainer}>
                            <Text style={localStyles.label}>ID del Nodo (MAC Address):</Text>
                            <View style={localStyles.idBox}>
                                <Text style={localStyles.idText}>{selectedNode.mac_address}</Text>
                            </View>

                            <Text style={localStyles.label}>Asignar Nombre:</Text>
                            <TextInput
                                style={localStyles.input}
                                placeholder="Ej. Pasillo A, Rack 1..."
                                placeholderTextColor="#999"
                                value={nodeName}
                                onChangeText={setNodeName}
                            />

                            <TouchableOpacity style={localStyles.saveButton} onPress={handleSaveNode}>
                                <Text style={localStyles.saveButtonText}>guardar nodo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    subHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginLeft: 10 },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: '#F3EFE9', borderRadius: 12, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15 },
    label: { fontSize: 14, color: '#333', marginBottom: 5, marginLeft: 2, fontWeight: '600', marginTop: 15 },
    dropdown: { backgroundColor: '#C5D7DF', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    dropdownText: { fontSize: 16, color: '#000' },
    dropdownMenu: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, overflow: 'hidden' },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    dropdownItemText: { fontSize: 14, color: '#000', fontWeight: '500' },
    formContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10 },
    idBox: { backgroundColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 10 },
    idText: { fontSize: 16, color: '#555', fontWeight: 'bold', textAlign: 'center' },
    input: { backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#000', borderWidth: 1, borderColor: '#ddd' },
    saveButton: { backgroundColor: '#354A5F', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 25 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});