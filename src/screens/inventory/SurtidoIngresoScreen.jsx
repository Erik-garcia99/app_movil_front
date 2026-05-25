import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';

export default function SurtidoIngresoScreen({ navigation, route }) {
    const { branchId, proveedor, referencia } = route.params;
    const [token, setToken] = useState(null);
    const [nodos, setNodos] = useState([]);
    
    // Formulario de nuevo producto
    const [selectedNodo, setSelectedNodo] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [pesoUnitario, setPesoUnitario] = useState('');
    
    // Lista de productos a surtir
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const load = async () => {
            const t = await AsyncStorage.getItem('access_token');
            setToken(t);
            fetchNodos(t);
        };
        load();
    }, []);

    const fetchNodos = async (t) => {
        try {
            const res = await fetch(`${API_BASE_URL}/rpi/branch/${branchId}/esp32-nodes`, {
                headers: { 'Authorization': `Bearer ${t}` }
            });
            const data = await res.json();
            // Filtrar los configurados
            setNodos(data.filter(n => !n.name.startsWith('Nodo-')));
        } catch (e) {
            console.error(e);
        }
    };

    const handleAgregar = () => {
        if (!selectedShelf || !nombre || !cantidad || !pesoUnitario) {
            Alert.alert('Error', 'Llena todos los campos y selecciona estante.');
            return;
        }

        const qty = parseInt(cantidad);
        const weightKg = parseFloat(pesoUnitario);
        const totalKg = qty * weightKg;

        const newItem = {
            id: Date.now().toString(),
            shelf: selectedShelf, // Guardamos el objeto entero para sacar el peso actual
            nodoName: selectedNodo.name,
            nombre,
            cantidad: qty,
            pesoUnitario: weightKg,
            pesoTotal: totalKg,
            pesoInicialGramos: selectedShelf.current_weight_grams // TARA DEL SURTIDO
        };

        setCart([...cart, newItem]);
        
        // Limpiar
        setNombre(''); setCantidad(''); setPesoUnitario('');
    };

    const handleFinalizar = () => {
        if (cart.length === 0) {
            Alert.alert('Error', 'Agrega al menos un producto.');
            return;
        }
        navigation.navigate('SurtidoValidacion', { branchId, proveedor, referencia, cart });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#607D8B' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={28} color="#000" /></TouchableOpacity>
                <Text style={styles.title}>surtido</Text>
            </View>

            <ScrollView style={{ padding: 20 }}>
                {/* Lista dinámica de lo que estamos ingresando */}
                {cart.map((item, index) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartCircle}><Text style={styles.circleText}>{index + 1}</Text></View>
                        <View>
                            <Text style={styles.cartItemName}>{item.nombre}</Text>
                            <Text style={styles.cartItemSub}>{item.cantidad} pz - {item.pesoUnitario} Kg c/u - total {item.pesoTotal} Kg</Text>
                            <Text style={styles.cartItemDestino}>Destino: {item.nodoName} - Estante {item.shelf.position}</Text>
                        </View>
                    </View>
                ))}

                {/* Formulario para agregar */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>nuevo producto</Text>
                    
                    {/* Selectores (Versión simplificada para el ejemplo) */}
                    <Text style={styles.label}>Nodo</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                        {nodos.map(n => (
                            <TouchableOpacity key={n.id} style={[styles.chip, selectedNodo?.id === n.id && styles.chipActive]} onPress={() => {setSelectedNodo(n); setSelectedShelf(null);}}>
                                <Text style={{ color: selectedNodo?.id === n.id ? '#fff' : '#000' }}>{n.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {selectedNodo && (
                        <>
                            <Text style={styles.label}>Estante</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                                {selectedNodo.shelves.map(s => (
                                    <TouchableOpacity key={s.id} style={[styles.chip, selectedShelf?.id === s.id && styles.chipActive]} onPress={() => setSelectedShelf(s)}>
                                        <Text style={{ color: selectedShelf?.id === s.id ? '#fff' : '#000' }}>Estante {s.position}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    <Text style={styles.label}>nombre</Text>
                    <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>cantidad</Text>
                            <TextInput style={styles.input} keyboardType="numeric" value={cantidad} onChangeText={setCantidad} />
                        </View>
                        <View style={{ flex: 1.5 }}>
                            <Text style={styles.label}>peso c/u (Kg)</Text>
                            <TextInput style={styles.input} keyboardType="numeric" value={pesoUnitario} onChangeText={setPesoUnitario} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.btnAgregar} onPress={handleAgregar}>
                        <Text style={styles.btnText}>agregar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
                    <Text style={styles.btnText}>validar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 40 },
    title: { fontSize: 24, fontWeight: '900', marginLeft: 10 },
    cartItem: { backgroundColor: '#F5EFEB', borderRadius: 10, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    cartCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#354A5F', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    circleText: { color: '#FFF', fontWeight: 'bold' },
    cartItemName: { fontSize: 16, fontWeight: 'bold' },
    cartItemSub: { color: '#666', fontSize: 12 },
    cartItemDestino: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
    formCard: { backgroundColor: '#F5EFEB', padding: 20, borderRadius: 12, marginBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    label: { fontSize: 12, color: '#333', marginBottom: 5 },
    input: { backgroundColor: '#FFF', borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
    row: { flexDirection: 'row' },
    btnAgregar: { backgroundColor: '#354A5F', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#FFF', fontWeight: 'bold' },
    chip: { backgroundColor: '#ddd', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
    chipActive: { backgroundColor: '#354A5F' },
    footer: { position: 'absolute', bottom: 20, right: 20 },
    btnFinalizar: { backgroundColor: '#354A5F', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 }
});
