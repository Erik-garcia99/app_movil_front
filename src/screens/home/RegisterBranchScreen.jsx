import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import CustomAlert from '../../components/common/CustomAlert';

export default function RegisterBranchScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [token, setToken] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    
    // Alert state
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const handleValidate = () => {
        if (token.trim().length > 0) {
            setIsValidated(true);
        } else {
            setAlertConfig({
                type: 'error',
                title: 'Error',
                message: 'Ingresa un token válido',
                onConfirm: () => setAlertVisible(false),
            });
            setAlertVisible(true);
        }
    };

    const handleRegister = () => {
        setAlertConfig({
            type: 'success',
            title: '¡Registrado!',
            message: 'La sucursal se registró exitosamente.',
            onConfirm: () => {
                setAlertVisible(false);
                navigation.goBack();
            },
        });
        setAlertVisible(true);
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
                    <Text style={styles.logoText}>rack<Text style={{color: '#00FFFF'}}>IQ</Text></Text>
                </View>
                
                <Text style={styles.screenTitle}>registrar sucursal</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>token de registro</Text>
                    <View style={styles.tokenRow}>
                        <TextInput
                            style={[styles.input, styles.tokenInput]}
                            value={token}
                            onChangeText={setToken}
                            editable={!isValidated}
                        />
                        {!isValidated && (
                            <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
                                <Text style={styles.validateButtonText}>Validar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]} pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>nombre de la sucursal</Text>
                    <TextInput
                        style={[styles.input, !isValidated && styles.disabledInput]}
                        placeholder="ej: abarrotes centro"
                        placeholderTextColor="#a0a0a0"
                        editable={isValidated}
                    />
                </View>

                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]} pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>direccion de la sucursal</Text>
                    <TextInput
                        style={[styles.input, !isValidated && styles.disabledInput]}
                        placeholder="ej: maria victoria 123"
                        placeholderTextColor="#a0a0a0"
                        editable={isValidated}
                    />
                </View>

                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]} pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>selecciona zona horaria</Text>
                    <View style={[styles.pickerContainer, !isValidated && styles.disabledInput]}>
                        <Text style={{ color: isValidated ? '#000' : '#a0a0a0' }}>pacific time - los angeles,CA</Text>
                        <ChevronDown size={20} color={isValidated ? "#000" : "#a0a0a0"} />
                    </View>
                </View>

                <View style={[styles.formGroup, !isValidated && styles.disabledGroup]} pointerEvents={isValidated ? 'auto' : 'none'}>
                    <Text style={styles.label}>rubro del negocio</Text>
                    <View style={[styles.pickerContainer, !isValidated && styles.disabledInput]}>
                        <Text style={{ color: isValidated ? '#000' : '#a0a0a0' }}>ej: abarrotes</Text>
                        <ChevronDown size={20} color={isValidated ? "#000" : "#a0a0a0"} />
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, !isValidated ? styles.submitDisabled : {}]} 
                    disabled={!isValidated}
                    onPress={handleRegister}
                >
                    <Text style={[styles.submitButtonText, !isValidated ? styles.submitDisabledText : {}]}>
                        registrar sucursal
                    </Text>
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
    container: {
        flex: 1,
        backgroundColor: '#5e7f8a', 
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)', 
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginBottom: 30,
    },
    formGroup: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    tokenRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tokenInput: {
        flex: 1,
    },
    validateButton: {
        backgroundColor: '#2e3d43',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    validateButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#F7EDEA',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
    },
    pickerContainer: {
        backgroundColor: '#F7EDEA',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    disabledGroup: {
        opacity: 0.6,
    },
    disabledInput: {
        backgroundColor: '#86a8b5', // Grayed out field background from mockup
    },
    submitButton: {
        marginTop: 30,
        marginBottom: 20,
        backgroundColor: '#2e3d43', // Dark button color
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitDisabled: {
        backgroundColor: 'rgba(46, 61, 67, 0.4)',
    },
    submitDisabledText: {
        color: 'rgba(255,255,255,0.5)',
    }
});
