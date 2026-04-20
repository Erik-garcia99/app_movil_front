import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleUser, ChevronDown, ArrowLeft, EyeOff, Eye } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [showPassword, setShowPassword] = useState(false);

    // Dummy data para la UI
    const userData = {
        nombres: 'marcos',
        apellidos: 'solis ochoa',
        telefono: '6641234544',
        correo: 'example@example',
        puesto: 'general',
        jefe: 'ricardo alvarez',
        password: '****************'
    };

    return (
        <View style={globalStyles.container}>
            {/* Header como en Home */}
            <View style={{ backgroundColor: '#F5EFEB', paddingTop: insets.top }}>
                <View style={[globalStyles.topHeader, { paddingBottom: 15 }]}>
                    <TouchableOpacity style={globalStyles.branchSelector}>
                        <Text style={globalStyles.branchText}>sucursal{"\n"}central</Text>
                        <ChevronDown size={16} color="#000" />
                    </TouchableOpacity>

                    <View style={globalStyles.statusBadge}>
                        <Text style={styles.statusText}>Online</Text>
                    </View>

                    <View style={styles.headerIcons}>
                        <Settings size={28} color="#000" style={{ marginRight: 15 }} />
                        <CircleUser size={28} color="#000" />
                    </View>
                </View>
            </View>

            {/* Contenido scrolleable */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Botón de retroceso y Título */}
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={28} color="#000" weight="bold" />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>datos personales</Text>
                </View>

                {/* Tarjeta de datos */}
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

                    {/* Contraseña */}
                    <View style={[styles.fieldContainer, { marginTop: 20 }]}>
                        <View style={styles.passwordRow}>
                            <Text style={styles.fieldValue}>
                                {showPassword ? 'miContraseña123' : userData.password}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? (
                                    <Eye size={24} color="#000" />
                                ) : (
                                    <EyeOff size={24} color="#000" />
                                )}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.fieldLabel}>contraseña</Text>
                    </View>
                </View>

                {/* Botón Actualizar */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>actualizar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Barra inferior */}
            <BottomNavBar 
                currentScreen="" // No hay una sección activa específica para configuración
                onSelectScreen={(screen) => navigation.navigate(screen)} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
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
        fontFamily: 'System', // Cambiar a la tipografía correcta si la hay
    },
    dataCard: {
        backgroundColor: '#F3EFE9', // Cremita
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
        marginBottom: 5, // Ajuste para alinear visualmente con el texto subrayado
    },
    buttonContainer: {
        alignItems: 'flex-end', // Alinear a la derecha
    },
    updateButton: {
        backgroundColor: COLORS.secondary, // Azul oscuro/grisáceo #354A5F
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