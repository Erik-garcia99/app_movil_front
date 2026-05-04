import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
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
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Estados para edición
    const [editEmail, setEditEmail] = useState('');
    const [editPhoneNumber, setEditPhoneNumber] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const profile = await usersAPI.getCurrentUserProfile();
            
            const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
            const nombres = nameParts[0] || '';
            const apellidos = nameParts.slice(1).join(' ') || '';

            setUserData({
                nombres: nombres,
                apellidos: apellidos,
                telefono: profile.phone_number || '',
                correo: profile.email || '',
                puesto: profile.role || 'No disponible',
                jefe: profile.supervisor_name || 'Sin asignar',
                password: '••••••••••••'
            });

            // Inicializar campos de edición
            setEditEmail(profile.email || '');
            setEditPhoneNumber(profile.phone_number || '');
        } catch (error) {
            console.error('Error loading profile:', error);
            setUserData({
                nombres: 'Usuario',
                apellidos: '',
                telefono: '',
                correo: '',
                puesto: 'No disponible',
                jefe: 'Sin asignar',
                password: '••••••••••••'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        // Validar que se ingresó la contraseña actual
        if (!currentPassword) {
            Alert.alert('Error', 'Debes ingresar tu contraseña actual para hacer cambios');
            return;
        }

        // Validar que algo cambió
        if (editEmail === userData.correo && editPhoneNumber === userData.telefono && !newPassword) {
            Alert.alert('Sin cambios', 'No hay nada para actualizar');
            return;
        }

        setUpdating(true);
        try {
            const response = await usersAPI.updateProfile(
                editEmail !== userData.correo ? editEmail : null,
                editPhoneNumber !== userData.telefono ? editPhoneNumber : null,
                currentPassword,
                newPassword || null
            );

            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            
            // Actualizar datos locales
            setUserData({
                ...userData,
                correo: response.email,
                telefono: response.phone_number || ''
            });

            // Limpiar campos de contraseña
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setUpdating(false);
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
                        {/* NOMBRES Y APELLIDOS - SOLO LECTURA */}
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

                        {/* TELÉFONO - EDITABLE */}
                        <View style={styles.row}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>telefono</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editPhoneNumber}
                                    onChangeText={setEditPhoneNumber}
                                    placeholder="Ingresa tu teléfono"
                                    keyboardType="phone-pad"
                                />
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldValue}>{userData.puesto}</Text>
                                <Text style={styles.fieldLabel}>puesto</Text>
                            </View>
                        </View>

                        {/* CORREO - EDITABLE */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>correo electronico</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editEmail}
                                onChangeText={setEditEmail}
                                placeholder="Ingresa tu correo"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* JEFE DIRECTO - SOLO LECTURA */}
                        <View style={[styles.fieldContainer, { marginTop: 15 }]}>
                            <Text style={styles.fieldValue}>{userData.jefe}</Text>
                            <Text style={styles.fieldLabel}>jefe directo</Text>
                        </View>

                        {/* SECCIÓN DE CONTRASEÑA */}
                        <View style={[styles.fieldContainer, { marginTop: 25, borderTopWidth: 1, borderTopColor: '#DDD', paddingTop: 20 }]}>
                            <Text style={[styles.fieldLabel, { marginBottom: 15, fontWeight: 'bold', fontSize: 15 }]}>cambiar contraseña</Text>
                            
                            {/* Contraseña actual */}
                            <View style={styles.passwordField}>
                                <Text style={styles.fieldLabel}>contraseña actual</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        secureTextEntry={!showPassword}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        placeholder="Ingresa contraseña actual"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIconButton}
                                    >
                                        {showPassword ? <Eye size={20} color="#000" /> : <EyeOff size={20} color="#000" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Nueva contraseña */}
                            <View style={[styles.passwordField, { marginTop: 15 }]}>
                                <Text style={styles.fieldLabel}>nueva contraseña (opcional)</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        secureTextEntry={!showNewPassword}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Ingresa nueva contraseña (dejar en blanco para no cambiar)"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                        style={styles.eyeIconButton}
                                    >
                                        {showNewPassword ? <Eye size={20} color="#000" /> : <EyeOff size={20} color="#000" />}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Botones */}
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <LogOut size={18} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.logoutButtonText}>cerrar sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.updateButton, updating && { opacity: 0.5 }]} 
                            onPress={handleUpdateProfile}
                            disabled={updating}
                        >
                            <Text style={styles.updateButtonText}>
                                {updating ? 'actualizando...' : 'actualizar'}
                            </Text>
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
        padding: 20,
        width: '100%',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
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
        fontSize: 12,
        color: '#000',
        fontWeight: '500',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#FFF',
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        marginLeft: 10,
        marginBottom: 5,
    },
    passwordField: {
        marginBottom: 10,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    eyeIconButton: {
        position: 'absolute',
        right: 12,
        padding: 8,
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