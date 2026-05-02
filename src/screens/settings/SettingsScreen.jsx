import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, EyeOff, Eye, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usersAPI } from '../../api/users';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen({ navigation }) {
    const { userRole } = useCurrentUser();
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const profile = await usersAPI.getCurrentUserProfile();
            
            // Separar nombre y apellido si es posible
            const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
            const nombres = nameParts[0] || '';
            const apellidos = nameParts.slice(1).join(' ') || '';

            setUserData({
                nombres: nombres,
                apellidos: apellidos,
                telefono: 'No disponible',
                correo: profile.email || 'No disponible',
                puesto: profile.role || 'No disponible',
                jefe: profile.supervisor_name || 'Sin asignar',
                password: '••••••••••••'
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            // Usar datos por defecto si hay error
            setUserData({
                nombres: 'Usuario',
                apellidos: '',
                telefono: 'No disponible',
                correo: 'No disponible',
                puesto: 'No disponible',
                jefe: 'Sin asignar',
                password: '••••••••••••'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('access_token');
                        await AsyncStorage.removeItem('user');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <View style={globalStyles.container}>
            <TopHeader navigation={navigation} userRole={userRole} />

            {loading ? (
                <View style={[globalStyles.mainContent, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#354A5F" />
                </View>
            ) : !userData ? (
                <View style={[globalStyles.mainContent, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 16, color: '#666' }}>Error al cargar los datos</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft size={28} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>datos personales</Text>
                    </View>

                <View style={styles.dataCard}>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.nombres}</Text>
                            <Text style={styles.fieldLabel}>nombre/s</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.apellidos}</Text>
                            <Text style={styles.fieldLabel}>apellidos</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.telefono}</Text>
                            <Text style={styles.fieldLabel}>telefono</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.correo}</Text>
                            <Text style={styles.fieldLabel}>correo electronico</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.puesto}</Text>
                            <Text style={styles.fieldLabel}>puesto</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldValue}>{userData.jefe}</Text>
                            <Text style={styles.fieldLabel}>jefe directo</Text>
                        </View>
                    </View>

                    <View style={[styles.fieldContainer, { marginTop: 20 }]}>
                        <View style={styles.passwordRow}>
                            <Text style={styles.fieldValue}>
                                {showPassword ? 'miContraseña123' : userData.password}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? <Eye size={24} color="#000" /> : <EyeOff size={24} color="#000" />}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.fieldLabel}>contraseña</Text>
                    </View>
                </View>

                {/* Botones */}
                <View style={styles.buttonsRow}>
                    {/* Cerrar sesión */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LogOut size={18} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutButtonText}>cerrar sesión</Text>
                    </TouchableOpacity>

                    {/* Actualizar */}
                    <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>actualizar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            )}

            <BottomNavBar
                currentScreen=""
                onSelectScreen={(screen) => navigation.navigate(screen)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginLeft: 15,
    },
    dataCard: {
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        padding: 30,
        width: '100%',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    fieldContainer: {
        flex: 1,
        marginRight: 10,
    },
    fieldValue: {
        fontSize: 16,
        color: '#555',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    fieldLabel: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        marginLeft: 10,
        marginBottom: 5,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#c0392b',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '500',
    },
    updateButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    updateButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    }
});