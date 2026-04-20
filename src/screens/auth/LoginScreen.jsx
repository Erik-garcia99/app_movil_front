import { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { CircleUser } from 'lucide-react-native';
import {COLORS} from "../../constants/colors"
import {globalStyles} from "../../../assets/styles/GlobalStyles"



export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                        placeholder="Value"
                        placeholderTextColor="#A3A3A3"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />


                    <Text style={globalStyles.label}>Password</Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Value"
                        placeholderTextColor="#A3A3A3"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />


                    <TouchableOpacity 
                        style={localStyles.signInButton}
                        onPress={() => navigation.navigate('Home')}>
                        <Text style={localStyles.signInText}>Sign In</Text>
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
        backgroundColor: '#354A5F', // Tono azul oscuro/grisáceo del botón de abajo
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