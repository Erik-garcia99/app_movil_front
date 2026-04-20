import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import { COLORS } from '../../constants/colors';

export default function ForgotPasswordScreen({ navigation }) {
    const [contactInfo, setContactInfo] = useState('');

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={[globalStyles.container, localStyles.container]} 
        >
            <ScrollView contentContainerStyle={localStyles.scrollContainer}>
                
                {/* Logo */}
                <Image 
                    source={require('../../../assets/images/logo_rackIQ.png')}
                    style={localStyles.logo}
                />

                <Text style={localStyles.mainText}>ingrese el correo / numero registrado</Text>

                {/* Input y Botón Submit (Fila) */}
                <View style={localStyles.inputRow}>
                    <TextInput
                        style={localStyles.input}
                        placeholder="you@example.com"
                        placeholderTextColor="#A3A3A3"
                        value={contactInfo}
                        onChangeText={setContactInfo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={localStyles.submitButtonRow}>
                        <Text style={localStyles.submitButtonRowText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <Text style={localStyles.subText}>corre electronico / numero telefonico</Text>

                {/* Botón Enviar Correo */}
                <TouchableOpacity style={localStyles.sendButton}>
                    <Text style={localStyles.sendButtonText}>enviar correo</Text>
                </TouchableOpacity>

                {/* Botón para regresar al login (opcional, buena práctica) */}
                <TouchableOpacity style={localStyles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={localStyles.backButtonText}>volver al login</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    logo: {
        width: 250,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 50,
    },
    mainText: {
        color: COLORS.black,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.black,
        marginRight: 10,
    },
    submitButtonRow: {
        backgroundColor: '#333333', // Gris oscuro
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'center',
    },
    submitButtonRowText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    subText: {
        color: COLORS.black,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 40,
        textAlign: 'center',
    },
    sendButton: {
        backgroundColor: COLORS.secondary, // El tono azul oscuro/grisáceo (#354A5F)
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: 'auto',
        alignItems: 'center',
        marginBottom: 20,
    },
    sendButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    backButton: {
        marginTop: 20,
    },
    backButtonText: {
        color: COLORS.white,
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});