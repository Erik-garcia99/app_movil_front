import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, ChevronDown, ArrowLeft, AlertCircle, Plus } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useBranches } from '../../hooks/useBranches';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';


export default function InventoryScreen({ navigation }) {
    const { userRole, user } = useCurrentUser();
    const { currentBranch } = useBranches();
    const insets = useSafeAreaInsets();
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [isSurtidoMode, setIsSurtidoMode] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [token, setToken] = useState(null);
    const [branchId, setBranchId] = useState(null);

    useEffect(() => {
        const loadTokenAndBranch = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                setToken(accessToken);
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    if (userData.branch_id) setBranchId(userData.branch_id);
                }
            } catch (error) {
                console.error(error);
            }
        };
        loadTokenAndBranch();
    }, []);


    useEffect(() => {
            // Carga inicial si cambian el token o el branchId
            if (token && branchId) fetchNodes();

            // Carga dinámica: cada vez que regresamos a esta pantalla
            const unsubscribe = navigation.addListener('focus', () => {
                if (token && branchId) fetchNodes();
            });

            // Limpieza del listener cuando se desmonta el componente
            return unsubscribe;
        }, [navigation, token, branchId]);

    const fetchNodes = async () => {
            try {
                setLoading(true);
                const url = `${API_BASE_URL}/rpi/branch/${branchId}/esp32-nodes`;
                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error(await response.text());
                const data = await response.json();
                
                // 1. Filtramos los nodos que YA tienen un nombre asignado por el usuario
                const configuredNodes = data.filter(n => !n.name.startsWith('Nodo-'));
                
                // 2. Guardamos SOLO los nodos filtrados en el estado
                setNodes(configuredNodes);
                
            } catch (error) {
                console.error(error);
                setNodes([]);
            } finally {
                setLoading(false);
            }
        };


    const handleNodeSelect = (node) => {
        setSelectedNode(node);
        setShelves(node.shelves || []);
        setSelectedShelf(null);
        setDropdownOpen(null);
    };

    const handleShelfSelect = (shelf) => {
        navigation.navigate('ShelfDetail', {
            shelfId: shelf.id,
            gatewayIp: selectedNode?.gateway_ip,
            nodeName: selectedNode?.name,
            shelfName: shelf.name
        });
    };

    const handleNodeConfig = async () => {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            if (userData.branch_id) navigation.navigate('NodeConfig', { branchId: branchId });
            else Alert.alert('Error', 'No se encontró sucursal');
        } else {
            Alert.alert('Error', 'No se pudo obtener información del usuario');
        }
    };

    const displayShelves = selectedNode ? (selectedNode.shelves || []) : [];

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <TopHeader 
                navigation={navigation} 
                userRole={userRole} 
                branchName={currentBranch ? currentBranch.name : 'Cargando...'} 
            />
            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>gestion de inventario</Text>
                <TouchableOpacity onPress={handleNodeConfig} style={{ marginLeft: 'auto', padding: 4 }}>
                    <Settings size={24} color="#000" strokeWidth={2} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContainer}>
                <View style={localStyles.selectorCard}>
                    <Text style={localStyles.selectorTitle}>seleccionar estante</Text>
                    <Text style={localStyles.label}>Nodo:</Text>
                    <TouchableOpacity style={localStyles.dropdown} onPress={() => setDropdownOpen(dropdownOpen === 'node' ? null : 'node')}>
                        <Text style={localStyles.dropdownText}>{selectedNode ? selectedNode.name : 'none'}</Text>
                        <ChevronDown size={20} color="#000" />
                    </TouchableOpacity>
                    
                    {dropdownOpen === 'node' && (
                        <View style={localStyles.dropdownMenu}>
                            {nodes.length === 0 ? (
                                <View style={localStyles.dropdownItem}><Text style={localStyles.dropdownItemText}>No hay nodos disponibles</Text></View>
                            ) : (
                                nodes.map(node => (
                                    <TouchableOpacity 
                                        key={node.id} 
                                        style={[localStyles.dropdownItem, selectedNode?.id === node.id && localStyles.dropdownItemSelected]} 
                                        onPress={() => handleNodeSelect(node)}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={localStyles.dropdownItemText}>{node.name}</Text>
                                            <Text style={localStyles.dropdownItemSubtext}>
                                                {node.is_online ? '🟢 Online' : '🔴 Offline'} • {node.shelves?.length || 0} estantes
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </View>

{/* --- NUEVA SECCIÓN: LISTA DE ESTANTES COMO EN LA IMAGEN --- */}
                {selectedNode && displayShelves.map((shelf, index) => {
                    // Lógica para determinar el estado real
                    const hasProduct = shelf.product_id !== null;
                    const isConfigured = shelf.max_capacity_grams > 0;
                    
                    // Simulación temporal del porcentaje basado en un cálculo ficticio 
                    // (REEMPLAZAR LUEGO CON EL PESO REAL DEL BACKEND)
                    let percentage = 0;
                    let statusText = 'no configurado';
                    let barColor = '#D1DBE4'; // Gris por defecto
                    
                    if (hasProduct && isConfigured && shelf.is_connected) {
                        // Aquí iría tu lógica real de (peso_actual / max_capacity) * 100
                        percentage = 85; // Placeholder dinámico
                        const isOptimo = percentage > (shelf.low_stock_threshold_kg ? (shelf.low_stock_threshold_kg * 1000 / shelf.max_capacity_grams * 100) : 20);
                        statusText = isOptimo ? 'nivel optimo' : 'nivel critico';
                        barColor = isOptimo ? '#4ADE80' : '#FDE047';
                    } else if (hasProduct && !shelf.is_connected) {
                        statusText = 'sensor offline';
                    } else if (!hasProduct) {
                        statusText = 'vacío / sin asignar';
                    }

                    return (
                        <View key={shelf.id} style={localStyles.shelfCard}>
                            <View style={localStyles.shelfCardHeader}>
                                <Text style={localStyles.shelfCardTitle}>
                                    Estante {shelf.position}: - {hasProduct ? shelf.name : '---'}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ShelfDetail', {
                                    shelfId: shelf.id,
                                    gatewayIp: selectedNode.gateway_ip,
                                    nodeName: selectedNode.name,
                                    shelfName: shelf.name
                                })}>
                                    <AlertCircle size={28} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={localStyles.progressBarContainer}>
                                <View style={[
                                    localStyles.progressBarFill,
                                    { width: `${hasProduct && isConfigured ? percentage : 0}%`, backgroundColor: barColor }
                                ]} />
                            </View>

                            <View style={localStyles.shelfCardFooter}>
                                <Text style={localStyles.shelfCardPercentage}>
                                    {hasProduct && isConfigured && shelf.is_connected ? `${percentage} %` : '---'}
                                </Text>
                                <Text style={localStyles.shelfCardStatus}>{statusText}</Text>
                            </View>
                        </View>
                    );
                })}
                {/* --- FIN NUEVA SECCIÓN --- */}

                {!selectedNode && (
                    <View style={localStyles.infoCard}>
                        <AlertCircle size={32} color="#607D8B" />
                        <Text style={localStyles.infoText}>Selecciona un nodo para ver sus estantes</Text>
                    </View>
                )}
                <View style={localStyles.bottomControls}>
                    <View style={localStyles.switchRow}>
                        <Text style={localStyles.switchLabel}>modo surtido</Text>
                        <Switch value={isSurtidoMode} onValueChange={setIsSurtidoMode} />
                    </View>
                    <TouchableOpacity 
                        style={localStyles.fab} 
                        onPress={() => navigation.navigate('RegisterNode', { branchId: branchId })}
                    >
                        <Plus size={30} color="#000" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavBar currentScreen="Inventory" onSelectScreen={(screen) => navigation.navigate(screen)} />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'space-between' },
    subHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginLeft: 10, flex: 1 },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    selectorCard: { backgroundColor: '#F3EFE9', borderRadius: 12, padding: 20, marginBottom: 20 },
    selectorTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15 },
    label: { fontSize: 16, color: '#000', marginBottom: 5, marginLeft: 2, fontWeight: '500' },
    dropdown: { backgroundColor: '#C5D7DF', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    dropdownText: { fontSize: 16, color: '#000', fontWeight: '500' },
    dropdownMenu: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, overflow: 'hidden', maxHeight: 200 },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
    dropdownItemSelected: { backgroundColor: '#E8F5E9' },
    dropdownItemText: { fontSize: 14, color: '#000', fontWeight: '500' },
    dropdownItemSubtext: { fontSize: 12, color: '#666', marginTop: 4 },
    infoCard: { backgroundColor: '#F3EFE9', borderRadius: 12, padding: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    infoText: { fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' },
    bottomControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
    switchRow: { flexDirection: 'row', alignItems: 'center' },
    switchLabel: { fontSize: 16, color: '#1a1a1a', marginRight: 10, fontWeight: '500' },
    fab: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    shelfCard: { backgroundColor: '#F5EFEB', borderRadius: 12, padding: 15, marginBottom: 15 },
    shelfCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    shelfCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    progressBarContainer: { height: 16, backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
    progressBarFill: { height: '100%', borderRadius: 8 },
    shelfCardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    shelfCardPercentage: { fontSize: 14, fontWeight: '600', color: '#333' },
    shelfCardStatus: { fontSize: 14, color: '#333' },


});