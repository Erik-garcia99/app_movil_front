import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleUser, ChevronDown, ArrowLeft, LightbulbOff } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function InsightScreen({ navigation }) {
    const { userRole } = useCurrentUser();
    const insets = useSafeAreaInsets(); 
    const [selectedCategory, setSelectedCategory] = useState('todas');

    const categories = ['todas', 'ventas', 'Stock', 'patron'];

    return (
        <View style={[globalStyles.container, { backgroundColor: '#607D8B' }]}>
            <TopHeader navigation={navigation} userRole={userRole} />

            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>sugerencias</Text>
            </View>

            <View style={localStyles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={localStyles.categoriesScroll}>
                    {categories.map((cat, index) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    localStyles.categoryPill, 
                                    isActive && localStyles.activeCategoryPill
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text style={[
                                    localStyles.categoryText, 
                                    isActive && localStyles.activeCategoryText
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={localStyles.emptyStateWrapper}>
                <View style={localStyles.emptyStateContainer}>
                    <LightbulbOff size={64} color="#888888" strokeWidth={1.5} />
                    <Text style={localStyles.emptyStateTitle}>Sin recomendaciones</Text>
                    <Text style={localStyles.emptyStateText}>
                        No hay sugerencias recientes. No hemos detectado patrones inusuales en ti inventario o ventas.
                    </Text>
                </View>
            </View>

            <View style={localStyles.bottomButtonsContainer}>
                <TouchableOpacity style={localStyles.bottomButton}>
                    <Text style={localStyles.bottomButtonText}>reportes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={localStyles.bottomButton}>
                    <Text style={localStyles.bottomButtonText}>mapas de calor</Text>
                </TouchableOpacity>
            </View>

            <BottomNavBar 
                currentScreen="Insight" 
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
    categoriesContainer: {
        marginBottom: 15,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    categoryPill: {
        backgroundColor: '#D1DBE4', 
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        marginRight: 10,
    },
    activeCategoryPill: {
        backgroundColor: '#354A5F', 
    },
    categoryText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
    },
    activeCategoryText: {
        color: '#FFF',
    },
    emptyStateWrapper: {
        flex: 1,
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
        marginBottom: 40,
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
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    bottomButton: {
        backgroundColor: '#354A5F',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        flex: 0.48,
    },
    bottomButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
