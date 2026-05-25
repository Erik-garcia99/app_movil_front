import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useBranches } from '../../hooks/useBranches';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import DashboardContent from '../../components/dashboard/DashboardContent';

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { userRole } = useCurrentUser(); 
    const { branches, currentBranch, selectBranch, refreshBranches } = useBranches();
    const { stats, loading, refreshStats } = useDashboardStats();

    // Actualizar datos cuando se enfoca la pantalla
    useFocusEffect(
        React.useCallback(() => {
            console.log('🎯 HomeScreen enfocado, refrescando datos...');
            refreshBranches();
            refreshStats();
            return () => {
                // Cleanup si es necesario
            };
        }, [])
    );

    console.log('📊 HomeScreen renderizado - currentBranch:', currentBranch?.name);

    // Si hay sucursal actual, mostrar el dashboard
    if (currentBranch) {
        return (
            <View style={globalStyles.container}>
                {/* TopHeader - El mismo para todas las pantallas */}
                <TopHeader 
                	navigation={navigation} 
                	userRole={userRole} 
                	branches={branches} 
                	currentBranch={currentBranch} 
                	onSelectBranch={selectBranch} 
                />

                {/* Dashboard Content */}
                <DashboardContent 
                    stats={stats} 
                    loading={loading} 
                    branchName={currentBranch.name}
                />

                {/* Bottom Navigation */}
                <BottomNavBar 
                    currentScreen="Home" 
                    onSelectScreen={(screen) => navigation.navigate(screen)} 
                />
            </View>
        );
    }

    // Si no hay sucursales, mostrar pantalla de bienvenida
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
        backgroundColor: '#000',
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
