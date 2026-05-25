import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

export default function SurtidoExitoScreen({ navigation }) {
    
    const handleVolver = () => {
        // Regresa directo a la pantalla de inventario
        navigation.navigate('Inventory');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <CheckCircle2 size={80} color="#4ADE80" strokeWidth={2} />
                <Text style={styles.title}>¡Surtido Guardado!</Text>
                <Text style={styles.subtitle}>
                    El inventario ha sido actualizado correctamente y los registros se enviaron a la base de datos.
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleVolver}>
                    <Text style={styles.buttonText}>Volver a Inventario</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#607D8B',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#F5EFEB',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#354A5F',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
