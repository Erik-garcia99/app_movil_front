import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';

export default function CustomAlert({ 
    visible, 
    type = 'success', 
    title, 
    subtitle, 
    message, 
    onClose 
}) {
    if (!visible) return null;

    const isError = type === 'error';

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
 
                    <View style={styles.iconContainer}>
                        {isError ? (
                            <View style={[styles.iconCircle, styles.errorCircle]}>
                                <X size={40} color="#FF0000" strokeWidth={2.5} />
                            </View>
                        ) : (
                            <Check size={50} color="#000000" strokeWidth={3} />
                        )}
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}

                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    alertBox: {
        backgroundColor: '#D1DBE4', 
        borderRadius: 12,
        paddingTop: 30,
        paddingBottom: 25,
        paddingHorizontal: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 15,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 65,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    errorCircle: {
        borderColor: '#FF0000',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#354A5F', 
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});