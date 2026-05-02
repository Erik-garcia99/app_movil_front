import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PendingScreen({ navigation }) {

    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/logo_rackIQ.png')}
                style={styles.logo}
            />

            <View style={styles.card}>
                <Clock size={64} color="#354A5F" strokeWidth={1.5} />
                <Text style={styles.title}>cuenta pendiente</Text>
                <Text style={styles.message}>
                    Tu cuenta fue registrada correctamente pero está esperando
                    ser activada por un administrador.{'\n\n'}
                    Una vez que tu administrador te active, podrás acceder
                    normalmente al sistema.
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:     { flex: 1, backgroundColor: '#607D8B', justifyContent: 'center',
                     alignItems: 'center', paddingHorizontal: 30 },
    logo:          { width: 200, height: 70, resizeMode: 'contain', marginBottom: 40 },
    card:          { backgroundColor: '#F3EFE9', borderRadius: 16, padding: 30,
                     alignItems: 'center', width: '100%' },
    title:         { fontSize: 22, fontWeight: '900', color: '#000', marginTop: 20, marginBottom: 15 },
    message:       { fontSize: 15, color: '#444', textAlign: 'center', lineHeight: 24 },
    logoutButton:  { marginTop: 40, paddingVertical: 12, paddingHorizontal: 30,
                     borderRadius: 8, borderWidth: 2, borderColor: '#FFF' },
    logoutText:    { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});