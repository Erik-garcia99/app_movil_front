import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

export default function DashboardContent({ stats, loading, branchName }) {
    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    const safeStats = stats || {};

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(value || 0);
    };

    const formatPercent = (value) => {
        return `${(value || 0).toFixed(1)}%`;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* SECCIÓN SUPERIOR OSCURA */}
            <View style={styles.topDarkSection}>
                
                {/* Header: Valor del inventario */}
                <View style={styles.headerArea}>
                    <Text style={styles.headerLabel}>valor del inventario hoy</Text>
                    <Text style={styles.headerValue}>{formatCurrency(safeStats.inventory_value)}</Text>
                    <Text style={styles.headerSubtext}>
                        {branchName} • actualizado hace 2 min
                    </Text>
                </View>

                {/* Fila de 4 tarjetitas */}
                <View style={styles.rowOfFour}>
                    <View style={styles.miniCard}>
                        <Text style={[styles.miniCardValue, { color: '#4ADE80' }]}>
                            {formatCurrency(safeStats.sales_today)}
                        </Text>
                        <Text style={styles.miniCardLabel}>ventas del dia</Text>
                    </View>

                    <View style={styles.miniCard}>
                        <Text style={[styles.miniCardValue, { color: '#F59E0B' }]}>
                            {safeStats.low_stock_count || 0}
                        </Text>
                        <Text style={styles.miniCardLabel}>bajo stock</Text>
                    </View>

                    <View style={styles.miniCard}>
                        <Text style={[styles.miniCardValue, { color: '#1F2937' }]}>
                            {safeStats.products_count || 0}
                        </Text>
                        <Text style={styles.miniCardLabel}>productos</Text>
                    </View>

                    <View style={styles.miniCard}>
                        <Text style={[styles.miniCardValue, { color: '#1F2937' }]}>
                            {safeStats.sales_count_today || 0}
                        </Text>
                        <Text style={styles.miniCardLabel}>alertas</Text>
                    </View>
                </View>
            </View>

            {/* FILA DE 3 TARJETAS MEDIANAS */}
            <View style={styles.rowOfThree}>
                <View style={styles.mediumCard}>
                    <Text style={[styles.mediumCardValue, { color: '#4ADE80' }]}>
                        {formatCurrency(safeStats.sales_today)}
                    </Text>
                    <Text style={styles.mediumCardLabel}>ventas del dia</Text>
                    <Text style={[styles.mediumCardChange, { color: '#4ADE80' }]}>+12% vs ayer</Text>
                </View>

                <View style={styles.mediumCard}>
                    <Text style={[styles.mediumCardValue, { color: '#EF4444' }]}>
                        {formatCurrency(safeStats.margins?.current_margin)}
                    </Text>
                    <Text style={styles.mediumCardLabel}>mermas hoy</Text>
                    <Text style={[styles.mediumCardChange, { color: '#4ADE80' }]}>-8% vs ayer</Text>
                </View>

                <View style={styles.mediumCard}>
                    <Text style={[styles.mediumCardValue, { color: '#1F2937' }]}>
                        {formatPercent(safeStats.margins?.margin_percentage)}
                    </Text>
                    <Text style={styles.mediumCardLabel}>stock prom.</Text>
                    <Text style={[styles.mediumCardChange, { color: '#F59E0B' }]}>-3% vs ayer</Text>
                </View>
            </View>

            {/* SECCIÓN DEL GRÁFICO */}
            <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartLabel}>ventas - ultimos 7 dias ⌄</Text>
                    <Text style={styles.chartTotal}>
                        {formatCurrency(safeStats.daily_sales_data?.reduce((sum, d) => sum + (d.value || 0), 0) || 0)} total
                    </Text>
                </View>

                <View style={styles.chartPlaceholder}>
                    <View style={styles.barChart}>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                            const barColor = day === 2 || day === 5 ? '#EF4444' : (day === 3 || day === 6 ? '#F59E0B' : '#4ADE80');
                            return (
                                <View key={day} style={styles.barWrapper}>
                                    <View style={[
                                        styles.bar,
                                        { 
                                            height: Math.random() * 60 + 20,
                                            backgroundColor: barColor 
                                        }
                                    ]} />
                                    <Text style={styles.dayLabel}>
                                        {['lun', 'mart', 'mie', 'jue', 'vie', 'sab', 'hoy'][day - 1]}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={styles.spacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#598392', 
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    topDarkSection: {
        backgroundColor: '#2A3B47', 
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    
    headerArea: {
        marginBottom: 20,
    },
    headerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -1,
    },
    headerSubtext: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
        opacity: 0.9,
    },

    rowOfFour: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    miniCard: {
        flex: 1,
        backgroundColor: '#F3EFE9', 
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniCardValue: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    miniCardLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
    },

    rowOfThree: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 16,
    },
    mediumCard: {
        flex: 1,
        backgroundColor: '#F3EFE9',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediumCardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    mediumCardLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    mediumCardChange: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    chartSection: {
        backgroundColor: '#2A3B47', 
        borderRadius: 16,
        padding: 16,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    chartTotal: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    chartPlaceholder: {
        marginTop: 10,
    },
    barChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
        paddingHorizontal: 4,
    },
    barWrapper: {
        alignItems: 'center',
    },
    bar: {
        width: 22,
        marginBottom: 8,
        borderRadius: 2,
    },
    dayLabel: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },

    spacer: {
        height: 20,
    },
});
