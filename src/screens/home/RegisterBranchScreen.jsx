//acomodar los estilos por los que ya estan en el archivo de global 

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, CheckCircle } from 'lucide-react-native';
import CustomAlert from '../../components/common/CustomAlert';

const API_URL = 'http://192.168.1.66:8000/api/v1';

export default function RegisterBranchScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    // Token
    const [token, setToken] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [orgId, setOrgId] = useState('');

    // Campos del formulario
    const [branchName, setBranchName] = useState('');
    const [branchAddress, setBranchAddress] = useState('');
    const [timezone, setTimezone] = useState('America/Tijuana');
    const [isRegistering, setIsRegistering] = useState(false);

    // Alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const showAlert = (type, title, message, onConfirm) => {
        setAlertConfig({ type, title, message, onConfirm });
        setAlertVisible(true);
    };

    // ── Validar token contra el backend ──
    const handleValidate = async () => {
        if (token.trim().length === 0) {
            showAlert('error', 'Error', 'Ingresa un token válido', () => setAlertVisible(false));
            return;
        }

        setIsValidating(true);
        try {
            const res = await fetch(`${API_URL}/tokens/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token.trim() }),
            });
            const data = await res.json();

            if (data.is_valid) {
                setIsValidated(true);
                setOrgId(data.organization_id);
                setOrgName(data.organization_name);
            } else {
                showAlert('error', 'Token inválido', data.message, () => setAlertVisible(false));
            }
        } catch (e) {
            showAlert('error', 'Error de red', 'No se pudo conectar al servidor. Verifica tu IP.', () => setAlertVisible(false));
        } finally {
            setIsValidating(false);
        }
    };

    // ── Registrar sucursal ──
    const handleRegister = async () => {
        if (!branchName.trim()) {
            showAlert('error', 'Error', 'El nombre de la sucursal es requerido', () => setAlertVisible(false));
            return;
        }

        setIsRegistering(true);
        try {
            const res = await fetch(`${API_URL}/branches/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token.trim(),
                    name: branchName.trim(),
                    address: branchAddress.trim() || null,
                    timezone: timezone,
                }),
            });

            if (res.status === 201) {
                const data = await res.json();
                showAlert(
                    'success',
                    '¡Sucursal registrada!',
                    `"${data.name}" fue creada con el código ${data.branch_code}`,
                    () => {
                        setAlertVisible(false);
                        navigation.goBack();
                    }
                );
            } else {
                const data = await res.json();
                showAlert('error', 'Error', data.detail || 'No se pudo registrar', () => setAlertVisible(false));
            }
        } catch (e) {
            showAlert('error', 'Error de red', 'No se pudo conectar al servidor', () => setAlertVisible(false));
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>rack<Text style={{ color: '#00FFFF' }}>IQ</Text></Text>
                </View>

                <Text style={styles.screenTitle}>registrar sucursal</Text>

                {/* Token */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>token de registro</Text>
                    <View style={styles.tokenRow}>
                        <TextInput
                            style={[styles.input, styles.tokenInput, isValidated && styles.inputValidated]}
                            value={token}
                            onChangeText={setToken}
                            editable={!isValidated}
                            placeholder="TOKEN-PRUEBA-001"
                            placeholderTextColor="#a0a0a0"
                            autoCapitalize="characters"
                        />
                        {!isValidated ? (
                            <TouchableOpacity
                                style={styles.validateButton}
                                onPress={handleValidate}
                                disabled={isValidating}
                            >
                                {isValidating
                                    ? <ActivityIndicator size="small" color="#FFF" />
                                    : <Text style={styles.validateButtonText}>Validar</Text>
                                }
                            </TouchableOpacity>
                        ) : (
                            <CheckCircle size={28} color="#4ADE80" style={{ marginLeft: 10 }} />
                        )}
                    </View>
                    {/* Muestra el nombre de la organización si el token es válido */}
                    {isValidated && orgName ? (
                        <Text style={styles.orgLabel}>Organización: <Text style={styles.orgName}>{orgName}</Text></Text>
                    ) : null}
                </View>

                {/* Nombre */}
                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]}
                    pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>nombre de la sucursal</Text>
                    <TextInput
                        style={[styles.input, !isValidated && styles.disabledInput]}
                        placeholder="ej: abarrotes centro"
                        placeholderTextColor="#a0a0a0"
                        value={branchName}
                        onChangeText={setBranchName}
                        editable={isValidated}
                    />
                </View>

                {/* Dirección */}
                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]}
                    pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>direccion de la sucursal</Text>
                    <TextInput
                        style={[styles.input, !isValidated && styles.disabledInput]}
                        placeholder="ej: maria victoria 123"
                        placeholderTextColor="#a0a0a0"
                        value={branchAddress}
                        onChangeText={setBranchAddress}
                        editable={isValidated}
                    />
                </View>

                {/* Zona horaria (estático por ahora) */}
                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]}
                    pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>selecciona zona horaria</Text>
                    <View style={[styles.pickerContainer, !isValidated && styles.disabledInput]}>
                        <Text style={{ color: isValidated ? '#000' : '#a0a0a0' }}>
                            pacific time — America/Tijuana
                        </Text>
                        <ChevronDown size={20} color={isValidated ? '#000' : '#a0a0a0'} />
                    </View>
                </View>

                {/* Botón registrar */}
                <TouchableOpacity
                    style={[styles.submitButton, !isValidated && styles.submitDisabled]}
                    disabled={!isValidated || isRegistering}
                    onPress={handleRegister}
                >
                    {isRegistering
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Text style={[styles.submitButtonText, !isValidated && styles.submitDisabledText]}>
                            registrar sucursal
                          </Text>
                    }
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={alertConfig.onConfirm}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#5e7f8a' },
    header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10 },
    scrollContent: { paddingHorizontal: 30, paddingBottom: 40, alignItems: 'center' },
    logoContainer: {
        marginTop: 20, marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
    },
    logoText: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
    screenTitle: { fontSize: 22, fontWeight: '900', color: '#000', marginBottom: 30 },
    formGroup: { width: '100%', marginBottom: 15 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    tokenRow: { flexDirection: 'row', alignItems: 'center' },
    tokenInput: { flex: 1 },
    inputValidated: { backgroundColor: '#d4edda', borderWidth: 1, borderColor: '#4ADE80' },
    orgLabel: { fontSize: 12, color: '#1a1a1a', marginTop: 4, marginLeft: 2 },
    orgName: { fontWeight: 'bold', color: '#000' },
    validateButton: {
        backgroundColor: '#2e3d43',
        paddingVertical: 12, paddingHorizontal: 15,
        borderRadius: 8, marginLeft: 10, minWidth: 75, alignItems: 'center',
    },
    validateButtonText: { color: '#FFF', fontWeight: 'bold' },
    input: {
        backgroundColor: '#F7EDEA', borderRadius: 8,
        paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#000',
    },
    pickerContainer: {
        backgroundColor: '#F7EDEA', borderRadius: 8,
        paddingHorizontal: 15, paddingVertical: 12,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    disabledGroup: { opacity: 0.6 },
    disabledInput: { backgroundColor: '#86a8b5' },
    submitButton: {
        marginTop: 30, marginBottom: 20, backgroundColor: '#2e3d43',
        paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8,
    },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    submitDisabled: { backgroundColor: 'rgba(46, 61, 67, 0.4)' },
    submitDisabledText: { color: 'rgba(255,255,255,0.5)' },
});