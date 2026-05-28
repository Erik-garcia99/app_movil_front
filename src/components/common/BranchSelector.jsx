import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronDown, CheckCircle2 } from 'lucide-react-native';

export default function BranchSelector({ branches, currentBranch, onSelectBranch }) {
    const [modalVisible, setModalVisible] = useState(false);

    const displayName = currentBranch?.name || 'Seleccionar sucursal';
    const branchCount = branches?.length || 0;

    const handleSelectBranch = (branch) => {
        console.log('📋 BranchSelector: Seleccionando sucursal:', branch.name);
        onSelectBranch(branch);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity 
                style={styles.selectorButton}
                onPress={() => {
                    console.log('📋 Abriendo modal - Sucursales disponibles:', branchCount);
                    setModalVisible(true);
                }}
                activeOpacity={0.7}
            >
                <Text style={styles.branchName}>{displayName}</Text>
                <ChevronDown size={18} color="#000" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Mis Sucursales</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButtonContainer}
                            >
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {branches && branches.length > 0 ? (
                            <ScrollView style={styles.branchesList} showsVerticalScrollIndicator={false}>
                                {branches.map((branch) => (
                                    <TouchableOpacity
                                        key={branch.id}
                                        style={[
                                            styles.branchItem,
                                            currentBranch?.id === branch.id && styles.branchItemActive
                                        ]}
                                        onPress={() => handleSelectBranch(branch)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.branchItemContent}>
                                            <Text style={styles.branchItemName}>{branch.name}</Text>
                                            {branch.address && (
                                                <Text style={styles.branchItemAddress}>{branch.address}</Text>
                                            )}
                                        </View>
                                        {currentBranch?.id === branch.id && (
                                            <CheckCircle2 size={24} color="#007AFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No hay sucursales</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flex: 1,
    },
    branchName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    closeButtonContainer: {
        padding: 8,
    },
    closeButton: {
        fontSize: 28,
        color: '#999',
        fontWeight: '300',
    },
    branchesList: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    branchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    branchItemActive: {
        backgroundColor: '#E3F2FD',
        borderColor: '#007AFF',
    },
    branchItemContent: {
        flex: 1,
    },
    branchItemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    branchItemAddress: {
        fontSize: 12,
        color: '#999',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
});
