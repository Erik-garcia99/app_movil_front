import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { Settings, CircleUser, ChevronDown } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { userRole } = useCurrentUser(); 

    return (
        <View style={globalStyles.container}>

            
            <TopHeader navigation={navigation} userRole={userRole} />

            <View style={[globalStyles.mainContent, localStyles.centerContent]}>
                <Text style={localStyles.title}>Bienvenido a RackIQ</Text>
                <Text style={localStyles.subtitle}>tu solucion al{"\n"}avance tecnologico</Text>
                <TouchableOpacity style={localStyles.createButton} onPress={() => navigation.navigate('RegisterBranch')}>
                    <Text style={localStyles.createButtonText}>crear sucursal</Text>
                </TouchableOpacity>
            </View>


            <BottomNavBar 
                currentScreen="Home" 
                onSelectScreen={(screen) => navigation.navigate(screen)} 
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 40,
    },
    createButton: {
        backgroundColor: '#000', // Negro absoluto como en tu Figma
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    }
});