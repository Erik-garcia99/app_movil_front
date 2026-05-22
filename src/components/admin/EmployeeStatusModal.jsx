import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, CheckCircle2 } from 'lucide-react-native';

export default function EmployeeStatusModal({
    visible,
    employee,
    branches = [],
    supervisors = [],
    loadingSupervisors = false,
    onBranchChange,
    onSave,
    onClose,
}) {
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('active');

    useEffect(() => {
        if (!visible || !employee) {
            return;
        }

        setSelectedBranchId(employee.branch_id || null);
        setSelectedSupervisorId(employee.supervisor_id || null);
        setSelectedStatus(employee.account_status === 'pending' ? 'active' : employee.account_status || 'active');
    }, [visible, employee]);

    if (!visible || !employee) return null;

    const statusOptions = [
        { value: 'active', label: 'Autorizar acceso' },
        { value: 'suspended', label: 'Suspender' },
        { value: 'deleted', label: 'Eliminar' },
    ];

    const handleBranchSelect = (branchId) => {
        setSelectedBranchId(branchId);
        setSelectedSupervisorId(null);

        if (onBranchChange) {
            onBranchChange(branchId);
        }
    };

    const handleSave = () => {
        onSave({
            branchId: selectedBranchId,
            supervisorId: selectedSupervisorId,
            status: selectedStatus,
        });
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>autorizar empleado</Text>
                            <Text style={styles.headerSubtitle}>asigna sucursal y jefe directo</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#000" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.employeeInfo}>
                            <Text style={styles.employeeName}>{employee.name}</Text>
                            <Text style={styles.employeeEmail}>{employee.email}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>sucursal</Text>
                        <View style={styles.optionsBlock}>
                            {branches.length > 0 ? branches.map((branch) => (
                                <TouchableOpacity
                                    key={branch.id}
                                    style={[
                                        styles.optionRow,
                                        selectedBranchId === branch.id && styles.optionRowSelected,
                                    ]}
                                    onPress={() => handleBranchSelect(branch.id)}
                                >
                                    <View style={styles.radioButton}>
                                        {selectedBranchId === branch.id && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <View style={styles.optionTextBlock}>
                                        <Text style={styles.optionTitle}>{branch.name}</Text>
                                        {branch.address ? <Text style={styles.optionSubtitle}>{branch.address}</Text> : null}
                                    </View>
                                </TouchableOpacity>
                            )) : (
                                <Text style={styles.emptyText}>No hay sucursales disponibles</Text>
                            )}
                        </View>

                        <Text style={styles.sectionTitle}>jefe directo</Text>
                        <View style={styles.optionsBlock}>
                            {!selectedBranchId ? (
                                <Text style={styles.emptyText}>Primero selecciona una sucursal</Text>
                            ) : loadingSupervisors ? (
                                <ActivityIndicator size="small" color="#354A5F" />
                            ) : supervisors.length > 0 ? supervisors.map((supervisor) => (
                                <TouchableOpacity
                                    key={supervisor.id}
                                    style={[
                                        styles.optionRow,
                                        selectedSupervisorId === supervisor.id && styles.optionRowSelected,
                                    ]}
                                    onPress={() => setSelectedSupervisorId(supervisor.id)}
                                >
                                    <View style={styles.radioButton}>
                                        {selectedSupervisorId === supervisor.id && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <View style={styles.optionTextBlock}>
                                        <Text style={styles.optionTitle}>{supervisor.name}</Text>
                                        <Text style={styles.optionSubtitle}>{supervisor.role}{supervisor.branch_name ? ` • ${supervisor.branch_name}` : ''}</Text>
                                    </View>
                                    {selectedSupervisorId === supervisor.id && <CheckCircle2 size={18} color="#354A5F" />}
                                </TouchableOpacity>
                            )) : (
                                <Text style={styles.emptyText}>No hay jefes válidos para esta sucursal</Text>
                            )}
                        </View>

                        <Text style={styles.sectionTitle}>estado final</Text>
                        <View style={styles.optionsBlock}>
                            {statusOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionRow,
                                        selectedStatus === option.value && styles.optionRowSelected,
                                    ]}
                                    onPress={() => setSelectedStatus(option.value)}
                                >
                                    <View style={styles.radioButton}>
                                        {selectedStatus === option.value && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <Text style={styles.optionTitle}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (!selectedBranchId || !selectedSupervisorId) && { opacity: 0.5 }
                            ]}
                            onPress={handleSave}
                            disabled={!selectedBranchId || !selectedSupervisorId}
                        >
                            <Text style={styles.confirmButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '100%',
        maxWidth: 420,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
    employeeInfo: {
        marginBottom: 4,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    employeeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    employeeEmail: {
        fontSize: 14,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    optionsBlock: {
        gap: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        gap: 12,
    },
    optionRowSelected: {
        borderColor: '#354A5F',
        backgroundColor: '#EFF3F8',
    },
    optionTextBlock: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        fontSize: 13,
        color: '#666',
        paddingVertical: 4,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#354A5F',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        justifyContent: 'flex-end',
        gap: 10,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#354A5F',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#354A5F',
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 6,
        backgroundColor: '#354A5F',
    },
    confirmButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
