import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleUser, ChevronDown, BellOff, ArrowLeft } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';

export default function AlertsScreen({ navigation }) {
    const insets = useSafeAreaInsets(); 

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <View style={{ backgroundColor: '#F5EFEB', paddingTop: insets.top }}>
                <View style={globalStyles.topHeader}>
                    <TouchableOpacity style={globalStyles.branchSelector}>
                        <Text style={globalStyles.branchText}>sucursal{"\n"}central</Text>
                        <ChevronDown size={16} color="#000" />
                    </TouchableOpacity>

                    <View style={globalStyles.statusBadge}>
                        <Text style={globalStyles.statusText}>Online</Text>
                    </View>

                    <View style={globalStyles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Settings size={28} color="#000" style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <CircleUser size={28} color="#000" />
                    </View>
                </View>
            </View>

            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>alertas</Text>
            </View>

            <View style={[globalStyles.mainContent, localStyles.centerContent]}>
                <View style={localStyles.emptyStateContainer}>
                    <BellOff size={64} color="#888888" strokeWidth={1.5} />
                    <Text style={localStyles.emptyStateTitle}>Sin alertas</Text>
                    <Text style={localStyles.emptyStateText}>
                        Actualmente no tienes alertas pendientes. Todo en la sucursal funciona correctamente.
                    </Text>
                </View>
            </View>

            <BottomNavBar 
                currentScreen="Alerts" 
                onSelectScreen={(screen) => navigation.navigate(screen)} 
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    subHeaderTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginLeft: 10,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        width: '100%',
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 15,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    }
});
