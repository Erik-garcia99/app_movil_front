import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Users } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BranchSelector from './BranchSelector'; // Asegúrate de que la ruta sea correcta

export default function TopHeader({ 
    navigation, 
    branches = [], 
    currentBranch, 
    onSelectBranch,
    isOnline = true, 
    userRole = 'staff' 
}) {
    const insets = useSafeAreaInsets();
    
    // Solo mostrar icono de administración si el usuario tiene rol de mando
    const canManageEmployees = ['admin', 'manager', 'owner', 'superuser'].includes(userRole);

    return (
        <View style={{ backgroundColor: '#F5EFEB', paddingTop: insets.top }}>
            <View style={globalStyles.topHeader}>
                
                {/* Usamos el BranchSelector real en lugar del botón estático */}
                <View style={{ flex: 1, marginRight: 10 }}>
                    <BranchSelector 
                        branches={branches}
                        currentBranch={currentBranch}
                        onSelectBranch={onSelectBranch}
                    />
                </View>

                <View style={[globalStyles.statusBadge, { backgroundColor: isOnline ? '#4ADE80' : '#F87171' }]}>
                    <Text style={globalStyles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
                </View>

                <View style={globalStyles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
                        <Settings size={28} color="#000" />
                    </TouchableOpacity>
                    
                    {canManageEmployees && (
                        <TouchableOpacity onPress={() => navigation.navigate('EmployeeManagement')}>
                            <Users size={28} color="#000" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}
