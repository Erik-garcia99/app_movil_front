import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Edit2, Save, AlertCircle, CheckCircle } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';

export default function NodeConfigScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const { branchId } = route.params || {};
    const insets = useSafeAreaInsets();
    
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingNodeId, setEditingNodeId] = useState(null);
    const [editingShelfId, setEditingShelfId] = useState(null);
    const [editNodeName, setEditNodeName] = useState('');
    const [editShelfName, setEditShelfName] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                setToken(accessToken);
            } catch (error) {
                console.error('Error loading token:', error);
            }
        };
        loadToken();
    }, []);

    useEffect(() => {
        if (token && branchId) {
            fetchNodes();
        }
    }, [token, branchId]);

    const fetchNodes = async () => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}/rpi/branch/${branchId}/esp32-nodes`;
            console.log('🌐 Fetching nodes desde:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Nodes recibidos:', data);
            // const pendingNodes = data.filter(n => n.name.startsWith('Nodo-'));
            // setNodes(pendingNodes);
            setNodes(data);
            
        } catch (error) {
            console.error('❌ Error fetching nodes:', error);
            Alert.alert('Error', 'No se pudieron cargar los nodos');
        } finally {
            setLoading(false);
        }
    };

    const handleEditNodeName = (node) => {
        setEditingNodeId(node.id);
        setEditNodeName(node.name);
    };

    const handleSaveNodeName = async (nodeId) => {
        if (!editNodeName.trim()) {
            Alert.alert('Error', 'El nombre del nodo no puede estar vacío');
            return;
        }
        try {
            const url = `${API_BASE_URL}/rpi/esp32-node/${nodeId}/name`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editNodeName.trim() }),
            });
            if (!response.ok) throw new Error();
            setNodes(nodes.map(node => node.id === nodeId ? { ...node, name: editNodeName.trim() } : node));
            setEditingNodeId(null);
            Alert.alert('Éxito', 'Nombre del nodo actualizado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el nombre del nodo');
        }
    };

    const handleEditShelfName = (shelf) => {
        setEditingShelfId(shelf.id);
        setEditShelfName(shelf.name);
    };

    const handleSaveShelfName = async (shelfId) => {
        if (!editShelfName.trim()) {
            Alert.alert('Error', 'El nombre del estante no puede estar vacío');
            return;
        }
        try {
            const url = `${API_BASE_URL}/rpi/shelf/${shelfId}/name`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editShelfName.trim() }),
            });
            if (!response.ok) throw new Error();
            setNodes(nodes.map(node => ({
                ...node,
                shelves: node.shelves.map(shelf => shelf.id === shelfId ? { ...shelf, name: editShelfName.trim() } : shelf)
            })));
            setEditingShelfId(null);
            Alert.alert('Éxito', 'Nombre del estante actualizado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el nombre del estante');
        }
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
                <TopHeader navigation={navigation} userRole={userRole} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 18 }}>Cargando nodos...</Text>
                </View>
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
                <Text style={localStyles.subHeaderTitle}>configuración de nodos</Text>
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContainer}>
                {nodes.length === 0 ? (
                    <View style={localStyles.emptyState}>
                        <AlertCircle size={48} color="#999" />
                        <Text style={localStyles.emptyStateText}>No hay nodos disponibles para configurar</Text>
                        <Text style={localStyles.emptyStateSubtext}>Conecta un nuevo ESP32 para que aparezca aquí</Text>
                    </View>
                ) : (
                    nodes.map(node => (
                        <View key={node.id} style={localStyles.nodeCard}>
                            {/* Encabezado del Nodo */}
                            <View style={localStyles.nodeHeader}>
                                <View style={{ flex: 1 }}>
                                    {editingNodeId === node.id ? (
                                        <View style={localStyles.editContainer}>
                                            <TextInput style={localStyles.editInput} value={editNodeName} onChangeText={setEditNodeName} placeholder="Nombre del nodo" />
                                            <TouchableOpacity onPress={() => handleSaveNodeName(node.id)} style={localStyles.saveButton}>
                                                <Save size={18} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={localStyles.nodeName}>{node.name}</Text>
                                            <TouchableOpacity onPress={() => handleEditNodeName(node)} style={localStyles.editButton}>
                                                <Edit2 size={18} color="#607D8B" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={[localStyles.statusBadge, { backgroundColor: node.is_online ? '#4CAF50' : '#FF9800' }]}>
                                    <Text style={localStyles.statusText}>{node.is_online ? 'Online' : 'Offline'}</Text>
                                </View>
                            </View>

                            <Text style={localStyles.nodeMac}>MAC: {node.mac_address}</Text>

                            <View style={localStyles.shelvesContainer}>
                                <Text style={localStyles.shelvesTitle}>Estantes (HX711s):</Text>
                                {node.shelves.map(shelf => (
                                    <View key={shelf.id} style={localStyles.shelfItem}>
                                        <View style={localStyles.shelfInfo}>
                                            <View style={{ flex: 1 }}>
                                                {editingShelfId === shelf.id ? (
                                                    <View style={localStyles.editContainer}>
                                                        <TextInput style={localStyles.editInput} value={editShelfName} onChangeText={setEditShelfName} placeholder="Nombre del estante" />
                                                        <TouchableOpacity onPress={() => handleSaveShelfName(shelf.id)} style={localStyles.saveButton}>
                                                            <Save size={16} color="#fff" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View>
                                                            <Text style={localStyles.shelfName}>{shelf.name}</Text>
                                                            <Text style={localStyles.shelfPin}>Pin {shelf.pin} • Posición {shelf.position}</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleEditShelfName(shelf)} style={localStyles.editButton}>
                                                            <Edit2 size={16} color="#607D8B" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View style={[localStyles.shelfStatus, { backgroundColor: shelf.is_connected ? '#E8F5E9' : '#FFF3E0' }]}>
                                            {shelf.is_connected ? (
                                                <><CheckCircle size={16} color="#4CAF50" /><Text style={{ color: '#4CAF50', marginLeft: 6, fontSize: 12, fontWeight: '600' }}>Conectado</Text></>
                                            ) : (
                                                <><AlertCircle size={16} color="#FF9800" /><Text style={{ color: '#FF9800', marginLeft: 6, fontSize: 12, fontWeight: '600' }}>Desconectado</Text></>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
        </View>
    );
}

const localStyles = StyleSheet.create({
    // ... tus estilos originales (no cambian)
});