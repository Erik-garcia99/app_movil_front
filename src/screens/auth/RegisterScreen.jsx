import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/common/CustomAlert';

const API_URL = 'http://192.168.1.66:8000/api/v1';

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName]               = useState('');
    const [email, setEmail]                     = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [branchCode, setBranchCode]           = useState('');
    const [loading, setLoading]                 = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig]   = useState({});

    const showAlert = (type, title, message, onConfirm) => {
        setAlertConfig({ type, title, message, onConfirm });
        setAlertVisible(true);
    };

    const handleRegister = async () => {
        // Validaciones locales
        if (!fullName || !email || !password || !branchCode) {
            showAlert('error', 'Campos incompletos', 'Llena todos los campos antes de continuar.',
                () => setAlertVisible(false));
            return;
        }
        if (password !== confirmPassword) {
            showAlert('error', 'Contraseñas distintas', 'Las contraseñas no coinciden.',
                () => setAlertVisible(false));
            return;
        }
        if (password.length < 6) {
            showAlert('error', 'Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.',
                () => setAlertVisible(false));
            return;
        }

        setLoading(true);
        try {
            // Obtener el token de Firebase si está disponible
            let fcmToken = null;
            try {
                fcmToken = await AsyncStorage.getItem('fcm_token');
            } catch (e) {
                console.log('No FCM token available');
            }

            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name:   fullName.trim(),
                    email:       email.trim().toLowerCase(),
                    password:    password,
                    branch_code: branchCode.trim().toUpperCase(),
                    push_token:  fcmToken  // Enviar el token de Firebase
                }),
            });

            const data = await res.json();

            if (res.status === 201) {
                showAlert(
                    'success',
                    '¡Registro exitoso!',
                    data.message,
                    () => {
                        setAlertVisible(false);
                        navigation.navigate('Login');
                    }
                );
            } else {
                showAlert('error', 'Error', data.detail || 'No se pudo registrar.',
                    () => setAlertVisible(false));
            }
        } catch (e) {
            showAlert('error', 'Error de red', 'No se pudo conectar al servidor.',
                () => setAlertVisible(false));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Image
                    source={require('../../../assets/images/logo_rackIQ.png')}
                    style={styles.logo}
                />

                <Text style={styles.title}>registrar usuario</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>nombre completo</Text>
                    <TextInput style={styles.input} placeholder="ej: Juan García"
                        value={fullName} onChangeText={setFullName} placeholderTextColor="#B0B0B0" />

                    <Text style={styles.label}>correo electrónico</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail}
                        keyboardType="email-address" autoCapitalize="none" />

                    <Text style={styles.label}>contraseña</Text>
                    <TextInput style={styles.input} value={password} onChangeText={setPassword}
                        secureTextEntry={true} />

                    <Text style={styles.label}>confirmar contraseña</Text>
                    <TextInput style={styles.input} value={confirmPassword}
                        onChangeText={setConfirmPassword} secureTextEntry={true} />

                    <Text style={styles.label}>código de sucursal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ej: BR-A1B2C3"
                        value={branchCode}
                        onChangeText={setBranchCode}
                        autoCapitalize="characters"
                        placeholderTextColor="#B0B0B0"
                    />
                    <Text style={styles.subtext}>código que te proporcionó tu administrador</Text>
                </View>

                <TouchableOpacity
                    style={[styles.registerButton, loading && { opacity: 0.7 }]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={styles.registerButtonText}>registrar usuario</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity style={styles.backToLoginButton}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLoginText}>volver al login</Text>
                </TouchableOpacity>

            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onConfirm}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:       { flex: 1, backgroundColor: '#607D8B' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center',
                       paddingHorizontal: 30, paddingBottom: 40, paddingTop: 50 },
    logo:            { width: 250, height: 90, resizeMode: 'contain', marginBottom: 20 },
    title:           { fontSize: 22, fontWeight: '900', color: '#000', marginBottom: 30 },
    formContainer:   { width: '100%', marginBottom: 40 },
    label:           { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 6, marginLeft: 4 },
    input:           { backgroundColor: '#F3EFE9', borderRadius: 12, paddingHorizontal: 15,
                       paddingVertical: 12, fontSize: 16, marginBottom: 15, color: '#333' },
    subtext:         { fontSize: 12, fontStyle: 'italic', color: '#1a1a1a', marginTop: -10,
                       marginBottom: 15, marginLeft: 10, fontWeight: 'bold' },
    registerButton:  { backgroundColor: '#344755', paddingVertical: 14, paddingHorizontal: 30,
                       borderRadius: 8, borderWidth: 1, borderColor: '#1E2D3A', marginTop: 10 },
    registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
    backToLoginButton:  { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20 },
    backToLoginText:    { color: '#000', fontSize: 15, fontWeight: 'bold', textDecorationLine: 'underline' },
});