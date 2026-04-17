import { useState } from 'react';
import { View, Text, StyleSheet, Image,TextInput, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CircleUser } from 'lucide-react-native';
// import Svg, { Path } from 'react-native-svg';
import{styles,image,font, input_label, default_buttom_scheme} from "../../../assets/styles/BottomNavStyles"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';




export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        
            {/* Logo */}
            <Image 
                source={require('../../../assets/images/logo_rackIQ.png')}
                style={{ width: 220, height: 100, resizeMode: 'contain', marginBottom: 48 }}
            />

            {/* Ícono */}
            <View style={{ marginBottom: 32 }}>
                <CircleUser size={60} color="#000" />
            </View>

            {/* Email */}
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', alignSelf: 'flex-start', marginBottom: 6 }}>
                Correo electrónico
            </Text>
            <TextInput
                style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, color: '#000', marginBottom: 16, width: '100%' }}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Contraseña */}
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', alignSelf: 'flex-start', marginBottom: 6 }}>
                Contraseña
            </Text>
            <TextInput
                style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, color: '#000', marginBottom: 16, width: '100%' }}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity
                onPress={() => Alert.alert("inicio de sesion")}
                style={{
                    width: '100%',
                    padding: 14,
                    borderRadius: 8,
                    borderWidth: 2,
                    backgroundColor: '#2C2C2C',
                    alignItems: 'center',
                    marginTop: 8,
                }}
                >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600',  }}>
                    iniciar sesion
                </Text>
            </TouchableOpacity>


            </View>


        </ScrollView>
    );
}