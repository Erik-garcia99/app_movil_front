import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleUser, ChevronDown, ArrowLeft, CheckSquare, Square } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';
export default function AddProductScreen({ navigation, route }) {
    const { userRole } = useCurrentUser();
    const insets = useSafeAreaInsets();
    const { shelfId } = route.params || {}; 
    
    // Valores nulos preparados para la API
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [unitType, setUnitType] = useState('Kg'); 
    const [netWeightUnit, setNetWeightUnit] = useState('g');
    
    const netWeightUnits = ['g', 'Kg', 'oz', 'lb'];
    const toggleNetWeightUnit = () => {
        const currentIndex = netWeightUnits.indexOf(netWeightUnit);
        setNetWeightUnit(netWeightUnits[(currentIndex + 1) % netWeightUnits.length]);
    }; 

    const [formData, setFormData] = useState({
        nombre: '',
        contenidoNeto: '',
        proveedor: '',
        noTelefonico: '',
        correoElectronico: '',
        umbralBajoStock: '',
    });

    const [contactPreferences, setContactPreferences] = useState({
        whatsapp: true,
        correo: false,
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleContactPreference = (method) => {
        setContactPreferences(prev => ({ ...prev, [method]: !prev[method] }));
    };

    const handleNodeSelect = (node) => {
        setSelectedNode(node);
        const availableShelves = node.shelves.filter(s => s.product_id === null);
        setAvailableShelves(availableShelves);
    };

    const handleSave = async () => {
        if (!shelfId) {
            Alert.alert("Error", "No hay un estante seleccionado.");
            return;
        }
        if (!formData.nombre.trim()) {
            Alert.alert("Error", "El nombre del producto es obligatorio.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('access_token');
            const apiUrl = API_BASE_URL;
            
            // Convertir contenido neto a gramos
            let weightInGrams = parseFloat(formData.contenidoNeto) || 0;
            if (netWeightUnit === 'Kg') weightInGrams *= 1000;
            else if (netWeightUnit === 'oz') weightInGrams *= 28.3495;
            else if (netWeightUnit === 'lb') weightInGrams *= 453.592;

            const payload = {
                ...formData,
                contenidoNeto: weightInGrams.toString(), // Enviamos ya en gramos
                contactWhatsapp: contactPreferences.whatsapp,
                contactEmail: contactPreferences.correo
            };

            const response = await fetch(`${apiUrl}/rpi/shelf/${shelfId}/assign-product`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("No se pudo asignar el producto.");
            
            Alert.alert("Éxito", "Producto asignado y guardado correctamente.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
            
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al guardar el producto.");
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={[globalStyles.container, { backgroundColor: '#607D8B' }]}
        >
            <TopHeader navigation={navigation} userRole={userRole} />

            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>agregar producto</Text>
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* Tarjeta 1: Seleccionar destino
                <View style={localStyles.card}>
                    <Text style={localStyles.cardTitle}>seleccionar destino</Text>
                    
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
                </View> */}

                <View style={localStyles.card}>
                    <Text style={localStyles.cardTitle}>informacion basica</Text>
                    
                    <View style={localStyles.row}>
                        <View style={localStyles.column}>
                            <Text style={localStyles.label}>nombre</Text>
                            <TextInput
                                style={localStyles.input}
                                placeholder="chiles en rajas"
                                placeholderTextColor="#999"
                                value={formData.nombre}
                                onChangeText={(text) => handleInputChange('nombre', text)}
                            />
                        </View>
                        <View style={localStyles.column}>
                            <Text style={localStyles.label}>contenido neto</Text>
                            <View style={localStyles.unitInputContainer}>
                                <TextInput
                                    style={[localStyles.input, { flex: 1, marginBottom: 0 }]}
                                    placeholder="125"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={formData.contenidoNeto}
                                    onChangeText={(text) => handleInputChange('contenidoNeto', text)}
                                />
                                <TouchableOpacity style={localStyles.unitSelector} onPress={toggleNetWeightUnit}>
                                    <Text style={localStyles.unitText}>{netWeightUnit}</Text>
                                    <ChevronDown size={16} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={localStyles.row}>
                        <View style={localStyles.column}>
                            <Text style={localStyles.label}>proveedor</Text>
                            <TextInput
                                style={localStyles.input}
                                placeholder="la costeña"
                                placeholderTextColor="#999"
                                value={formData.proveedor}
                                onChangeText={(text) => handleInputChange('proveedor', text)}
                            />
                        </View>
                        <View style={localStyles.column}>
                            <Text style={localStyles.label}>no. telefonico</Text>
                            <TextInput
                                style={localStyles.input}
                                placeholder="6648897623"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={formData.noTelefonico}
                                onChangeText={(text) => handleInputChange('noTelefonico', text)}
                            />
                        </View>
                    </View>

                    <View style={localStyles.row}>
                        <View style={[localStyles.column, { flex: 1.2, marginRight: 10 }]}>
                            <Text style={localStyles.label}>correo electronico</Text>
                            <TextInput
                                style={localStyles.input}
                                placeholder="costenia@costenia.mx"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.correoElectronico}
                                onChangeText={(text) => handleInputChange('correoElectronico', text)}
                            />
                        </View>
                        <View style={[localStyles.column, { flex: 0.8, justifyContent: 'center' }]}>
                            <TouchableOpacity 
                                style={localStyles.checkboxRow} 
                                onPress={() => toggleContactPreference('whatsapp')}
                            >
                                {contactPreferences.whatsapp ? 
                                    <CheckSquare size={20} color="#333" /> : 
                                    <Square size={20} color="#333" />
                                }
                                <Text style={localStyles.checkboxLabel}>whatsapp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[localStyles.checkboxRow, { marginTop: 10 }]} 
                                onPress={() => toggleContactPreference('correo')}
                            >
                                {contactPreferences.correo ? 
                                    <CheckSquare size={20} color="#333" /> : 
                                    <Square size={20} color="#333" />
                                }
                                <Text style={localStyles.checkboxLabel}>correo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[localStyles.row, { alignItems: 'flex-end', marginBottom: 20 }]}>
                        <View style={localStyles.column}>
                            <Text style={localStyles.label}>umbral bajo stock</Text>
                            <View style={localStyles.unitInputContainer}>
                                <TextInput
                                    style={[localStyles.input, { flex: 1, marginBottom: 0 }]}
                                    placeholder="3"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={formData.umbralBajoStock}
                                    onChangeText={(text) => handleInputChange('umbralBajoStock', text)}
                                />
                                <TouchableOpacity style={localStyles.unitSelector}>
                                    <Text style={localStyles.unitText}>{unitType}</Text>
                                    <ChevronDown size={16} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[localStyles.column, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={localStyles.autostockLabel}>modo autostock</Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={localStyles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={localStyles.saveButtonText}>guardar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </KeyboardAvoidingView>
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
        paddingBottom: 30, 
    },
    card: {
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#333',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#000',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    unitInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unitSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    unitText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginRight: 2,
    },
    autostockLabel: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#354A5F',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center', 
        width: '50%',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    }
});