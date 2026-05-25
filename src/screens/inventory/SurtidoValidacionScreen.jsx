import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/config';

export default function SurtidoValidacionScreen({ navigation, route }) {
    const { branchId, proveedor, referencia, cart } = route.params;
    
    const [token, setToken] = useState(null);
    const [liveCart, setLiveCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasGlobalDiscrepancy, setHasGlobalDiscrepancy] = useState(false);

    // Tolerancia de 0.5 Kg (500g)
    const TOLERANCE_KG = 0.5;

    useEffect(() => {
        const load = async () => {
            const t = await AsyncStorage.getItem('access_token');
            setToken(t);
            fetchLiveWeights(t);
        };
        load();
    }, []);

    const fetchLiveWeights = async (t) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/rpi/branch/${branchId}/esp32-nodes`, {
                headers: { 'Authorization': `Bearer ${t || token}` }
            });
            const nodes = await res.json();
            
            let discrepancyFound = false;

            // Mapeamos el carrito actualizando el peso detectado por el sensor
            const updatedCart = cart.map(item => {
                // Buscamos el estante actualizado en la respuesta
                let currentShelf = null;
                for (const node of nodes) {
                    const found = node.shelves?.find(s => s.id === item.shelf.id);
                    if (found) { currentShelf = found; break; }
                }

                const currentWeightGrams = currentShelf ? currentShelf.current_weight_grams : item.shelf.current_weight_grams;
                
                // Calculamos cuánto peso NUEVO entró (Peso Actual - Peso Inicial)
                const pesoIngresadoGramos = currentWeightGrams - item.pesoInicialGramos;
                const pesoIngresadoKg = Math.max(0, pesoIngresadoGramos / 1000); // Evitamos negativos por error de lectura

                // Validamos si hay discrepancia
                const diff = Math.abs(item.pesoTotal - pesoIngresadoKg);
                const isDiscrepancy = diff > TOLERANCE_KG;
                
                if (isDiscrepancy) discrepancyFound = true;

                return {
                    ...item,
                    pesoSensorKg: pesoIngresadoKg.toFixed(2),
                    isDiscrepancy
                };
            });

            setLiveCart(updatedCart);
            setHasGlobalDiscrepancy(discrepancyFound);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo leer el peso de los sensores.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizar = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                proveedor,
                referencia,
                items: liveCart.map(item => ({
                    shelf_id: item.shelf.id,
                    pesoTotalKg: item.pesoTotal,
                    pesoDetectadoKg: parseFloat(item.pesoSensorKg),
                    cantidad: item.cantidad
                }))
            };

            const response = await fetch(`${API_BASE_URL}/rpi/branch/${branchId}/surtido`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Error al registrar en BD');

            // Navegar a la pantalla de éxito reseteando el stack para que no pueda volver atrás
            navigation.reset({
                index: 0,
                routes: [{ name: 'Inventory' }, { name: 'SurtidoExito', params: { branchId } }],
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar el surtido en la base de datos.');
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#607D8B' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>surtido</Text>
                <TouchableOpacity onPress={() => fetchLiveWeights()} style={{ marginLeft: 'auto' }}>
                    <RefreshCw size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {loading && liveCart.length === 0 ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            ) : (
                <ScrollView style={{ padding: 20, marginBottom: 80 }}>
                    {/* Banner global */}
                    <View style={[styles.banner, { backgroundColor: hasGlobalDiscrepancy ? '#EF4444' : '#4ADE80' }]}>
                        <Text style={styles.bannerText}>
                            {hasGlobalDiscrepancy ? 'discrepancia detectada' : 'surtido correcto'}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>comparacion en productos</Text>

                    {liveCart.map((item, index) => {
                        // Calcular porcentaje para las barras (máximo 100%)
                        const maxLimit = Math.max(item.pesoTotal, item.pesoSensorKg);
                        const widthFactura = maxLimit > 0 ? (item.pesoTotal / maxLimit) * 100 : 0;
                        const widthSensor = maxLimit > 0 ? (item.pesoSensorKg / maxLimit) * 100 : 0;
                        const barColor = item.isDiscrepancy ? '#EF4444' : '#4ADE80';

                        return (
                            <View key={item.id} style={styles.card}>
                                <Text style={styles.itemName}>{item.nombre}</Text>
                                <Text style={styles.itemSub}>factura {item.cantidad} pz / {item.pesoTotal.toFixed(2)} Kg</Text>
                                
                                <View style={styles.barRow}>
                                    <Text style={styles.barLabel}>factura</Text>
                                    <Text style={styles.barValue}>{item.pesoTotal.toFixed(2)} Kg</Text>
                                </View>
                                <View style={styles.barContainer}>
                                    <View style={[styles.barFill, { width: `${widthFactura}%`, backgroundColor: '#666' }]} />
                                </View>

                                <View style={styles.barRow}>
                                    <Text style={[styles.barLabel, { color: barColor }]}>sensor</Text>
                                    <Text style={[styles.barValue, { color: barColor }]}>{item.pesoSensorKg} Kg</Text>
                                </View>
                                <View style={styles.barContainer}>
                                    <View style={[styles.barFill, { width: `${widthSensor}%`, backgroundColor: barColor }]} />
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.btnFinalizar, isSubmitting && { opacity: 0.7 }]} 
                    onPress={handleFinalizar}
                    disabled={isSubmitting}
                >
                    <Text style={styles.btnText}>{isSubmitting ? 'guardando...' : 'finalizar'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 40 },
    title: { fontSize: 24, fontWeight: '900', marginLeft: 10 },
    banner: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    bannerText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#E0E0E0', marginBottom: 15 },
    card: { backgroundColor: '#F5EFEB', padding: 15, borderRadius: 12, marginBottom: 15 },
    itemName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    itemSub: { fontSize: 14, color: '#999', marginBottom: 15 },
    barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    barLabel: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    barValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    barContainer: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginBottom: 15, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6 },
    footer: { position: 'absolute', bottom: 20, right: 20 },
    btnFinalizar: { backgroundColor: '#354A5F', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
