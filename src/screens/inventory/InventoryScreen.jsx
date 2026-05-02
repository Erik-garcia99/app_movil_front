import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleUser, ChevronDown, ArrowLeft, AlertCircle, Plus } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function InventoryScreen({ navigation }) {
    const { userRole } = useCurrentUser();
    const insets = useSafeAreaInsets(); 
    
    // Valores nulos preparados para la API
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [isSurtidoMode, setIsSurtidoMode] = useState(false);

    const shelves = [
        { id: 1, name: 'none', percentage: 0, status: 'none', alert: false },
        { id: 2, name: 'none', percentage: 0, status: 'none', alert: false },
        { id: 3, name: 'none', percentage: 0, status: 'none', alert: false }
    ];

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            {/* Header Global */}
            <TopHeader navigation={navigation} userRole={userRole} />

            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>gestion de inventario</Text>
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={localStyles.selectorCard}>
                    <Text style={localStyles.selectorTitle}>seleccionar estante</Text>
                    
                    <Text style={localStyles.label}>Nodo:</Text>
                    <TouchableOpacity style={localStyles.dropdown}>
                        <Text style={localStyles.dropdownText}>{selectedNode ? selectedNode : 'none'}</Text>
                        <ChevronDown size={20} color="#000" />
                    </TouchableOpacity>

                    <Text style={localStyles.label}>Estante:</Text>
                    <TouchableOpacity style={localStyles.dropdown}>
                        <Text style={localStyles.dropdownText}>{selectedShelf ? selectedShelf : 'none'}</Text>
                        <ChevronDown size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {shelves.map((shelf, index) => (
                    <View key={shelf.id} style={localStyles.shelfCard}>
                        <View style={localStyles.shelfHeader}>
                            <Text style={localStyles.shelfTitle}>
                                Estante {index + 1}: - {shelf.name}
                            </Text>
                            <AlertCircle size={22} color="#000" strokeWidth={2} />
                        </View>
                        
                        <View style={localStyles.progressTrack}>
                            <View style={[localStyles.progressFill, { width: `${shelf.percentage}%` }]} />
                        </View>
                        
                        <View style={localStyles.shelfFooter}>
                            <Text style={localStyles.shelfStat}>{shelf.percentage} %</Text>
                            <Text style={localStyles.shelfStat}>{shelf.status}</Text>
                        </View>
                    </View>
                ))}

                <View style={localStyles.bottomControls}>
                    <View style={localStyles.switchRow}>
                        <Text style={localStyles.switchLabel}>modo surtido</Text>
                        <Switch
                            value={isSurtidoMode}
                            onValueChange={setIsSurtidoMode}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isSurtidoMode ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>
                    
                    <TouchableOpacity style={localStyles.fab} onPress={() => navigation.navigate('AddProduct')}>
                        <Plus size={30} color="#000" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNavBar 
                currentScreen="Inventory" 
                onSelectScreen={(screen) => navigation.navigate(screen)} 
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    subHeaderTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginLeft: 10,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    selectorCard: {
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    selectorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        marginLeft: 2,
    },
    dropdown: {
        backgroundColor: '#C5D7DF',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
    shelfCard: {
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    shelfHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    shelfTitle: {
        fontSize: 17,
        color: '#000',
    },
    progressTrack: {
        height: 18,
        backgroundColor: '#FFFFFF',
        borderRadius: 9,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#354A5F', // Color neutral
    },
    shelfFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shelfStat: {
        fontSize: 14,
        color: '#000',
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20, // Espacio antes de que acabe el scroll
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 16,
        color: '#1a1a1a',
        marginRight: 10,
    },
    fab: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});
