import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Users, ChevronDown } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';

export default function TopHeader({ navigation, branchName = 'sucursal\ncentral', isOnline = true, userRole = 'staff' }) {
    const insets = useSafeAreaInsets();
    
    // Solo mostrar icono de administración si el usuario tiene rol admin, manager, owner o superadmin
    const canManageEmployees = ['admin', 'manager', 'owner', 'superadmin'].includes(userRole);

    return (
        <View style={{ backgroundColor: '#F5EFEB', paddingTop: insets.top }}>
            <View style={globalStyles.topHeader}>
                <TouchableOpacity style={globalStyles.branchSelector}>
                    <Text style={globalStyles.branchText}>{branchName}</Text>
                    <ChevronDown size={16} color="#000" />
                </TouchableOpacity>

                <View style={[globalStyles.statusBadge, { backgroundColor: isOnline ? '#4ADE80' : '#F87171' }]}>
                    <Text style={globalStyles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
                </View>

                <View style={globalStyles.headerIcons}>
                    {/* Settings - Perfil del usuario */}
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
                        <Settings size={28} color="#000" />
                    </TouchableOpacity>
                    
                    {/* Users - Solo si es admin, manager u owner */}
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