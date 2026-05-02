import { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { CircleUser } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from "../../../assets/styles/GlobalStyles";

const API_URL = 'http://192.168.1.66:8000/api/v1';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Obtener el token de Firebase si está disponible
            let fcmToken = null;
            try {
                fcmToken = await AsyncStorage.getItem('fcm_token');
            } catch (e) {
                console.log('No FCM token available');
            }

            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password,
                    push_token: fcmToken  // Enviar el token de Firebase
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Guardar token y datos del usuario
                await AsyncStorage.setItem('access_token', data.access_token);
                await AsyncStorage.setItem('user', JSON.stringify({
                    id: data.user_id,
                    name: data.name,
                    role: data.role,
                    account_status: data.account_status,
                    organization_id: data.organization_id,
                }));

                // Redirige según el estado de la cuenta
                if (data.account_status === 'pending') {
                    Alert.alert(
                        'Cuenta Pendiente',
                        'Tu cuenta ha sido registrada correctamente, pero está pendiente de aprobación por el personal administrativo. Por favor, espera a que te activen para acceder al sistema.',
                        [{ text: 'Entendido', onPress: () => {} }]
                    );
                } else if (data.account_status === 'active') {
                    navigation.replace('Home');
                } else {
                    Alert.alert(
                        'Acceso Denegado',
                        'Tu cuenta está suspendida. Contacta a tu administrador para más información.'
                    );
                }
            } else {
                setError(data.detail || 'Credenciales incorrectas');
            }
        } catch (e) {
            setError('No se pudo conectar al servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <ScrollView contentContainerStyle={globalStyles.scrollContainer}>

                <Image
                    source={require('../../../assets/images/logo_rackIQ.png')}
                    style={localStyles.logo}
                />

                <View style={localStyles.iconContainer}>
                    <CircleUser size={80} color="#000" strokeWidth={1.5} />
                </View>

                <View style={globalStyles.formCard}>

                    <Text style={globalStyles.label}>Email</Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="admin@rackiq.com"
                        placeholderTextColor="#A3A3A3"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={globalStyles.label}>Password</Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#A3A3A3"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    {/* Mensaje de error */}
                    {error ? (
                        <Text style={localStyles.errorText}>{error}</Text>
                    ) : null}

                    <TouchableOpacity
                        style={[localStyles.signInButton, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#FFF" />
                            : <Text style={localStyles.signInText}>Sign In</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={localStyles.forgotPasswordButton}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={localStyles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={localStyles.registerButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={localStyles.registerText}>registrarse</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const localStyles = StyleSheet.create({
    logo: {
        width: 220,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 24,
    },
    iconContainer: {
        marginBottom: 24,
    },
    errorText: {
        color: '#e53e3e',
        fontSize: 13,
        marginBottom: 12,
        textAlign: 'center',
    },
    signInButton: {
        backgroundColor: '#2C2C2C',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    signInText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-start',
    },
    forgotPasswordText: {
        color: '#1A1A1A',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    registerButton: {
        backgroundColor: '#354A5F',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#263645',
    },
    registerText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    }
});