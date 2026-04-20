import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomAlert from '../../components/common/CustomAlert';

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [branch, setBranch] = useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        type: 'success',
        title: '',
        subtitle: null,
        message: ''
    });

    const handleRegister = () => {
        //simulacion de validacion minima 
        if (!fullName || !email || !password || !branch) {
            setAlertConfig({
                type: 'error',
                title: 'error fatal',
                subtitle: 'NO. error 404',
                message: 'Faltan campos por llenar. Por favor revisa el formulario e intenta de nuevo.'
            });
            setAlertVisible(true);
            return;
        }

        //simunlacion
        setAlertConfig({
            type: 'success',
            title: 'registro con exito',
            subtitle: null,
            message: 'El usuario ha sido registrado correctamente en la base de datos de la sucursal.'
        });
        setAlertVisible(true);
    };

    const handleAlertClose = () => {
        setAlertVisible(false);
        if (alertConfig.type === 'success') {
            navigation.navigate('Login'); 
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
                    <TextInput
                        style={styles.input}
                        placeholder="ej:abarratos centro"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholderTextColor="#B0B0B0"
                    />

                    <Text style={styles.label}>correo / No. empleado</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <Text style={styles.label}>confirmar contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                    />

                    <Text style={styles.label}>sucursal deonde trabaja</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="RAC-CEN-4012"
                        value={branch}
                        onChangeText={setBranch}
                        placeholderTextColor="#B0B0B0"
                    />
                    <Text style={styles.subtext}>codigo asociado a la sucrisal</Text>
                </View>

                <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>registrar usuario</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backToLoginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.backToLoginText}>volver al login</Text>
                </TouchableOpacity>

            </ScrollView>

            <CustomAlert 
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                subtitle={alertConfig.subtitle}
                message={alertConfig.message}
                onClose={handleAlertClose}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#607D8B', 
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 50,
    },
    logo: {
        width: 250,
        height: 90,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
        marginBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },
    subtext: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#1a1a1a',
        marginTop: -10, 
        marginBottom: 15,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#344755',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1E2D3A',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    backToLoginButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    backToLoginText: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});