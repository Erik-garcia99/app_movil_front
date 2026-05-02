import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, AlertCircle } from 'lucide-react-native';

export default function EmployeeStatusModal({ visible, employee, onStatusChange, onClose }) {
    const [selectedStatus, setSelectedStatus] = useState(null);

    if (!visible || !employee) return null;

    const statusOptions = [
        { value: 'active', label: 'Activar empleado', color: '#4CAF50' },
        { value: 'suspended', label: 'Suspender empleado', color: '#FF5722' },
        { value: 'deleted', label: 'Eliminar empleado', color: '#9E9E9E' },
    ];

    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
    };

    const handleConfirm = () => {
        if (selectedStatus) {
            onStatusChange(selectedStatus);
            setSelectedStatus(null);
        }
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
                        <Text style={styles.headerTitle}>estatus empleado</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#000" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.employeeInfo}>
                            <Text style={styles.employeeName}>{employee.name}</Text>
                            <Text style={styles.employeeEmail}>{employee.email}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>nuevo cargo</Text>

                        {statusOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.statusOption,
                                    selectedStatus === option.value && styles.statusOptionSelected
                                ]}
                                onPress={() => handleStatusSelect(option.value)}
                            >
                                <View style={styles.radioButton}>
                                    {selectedStatus === option.value && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.statusOptionLabel,
                                    selectedStatus === option.value && styles.statusOptionLabelSelected
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

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
                                !selectedStatus && { opacity: 0.5 }
                            ]}
                            onPress={handleConfirm}
                            disabled={!selectedStatus}
                        >
                            <Text style={styles.confirmButtonText}>OK</Text>
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
        maxWidth: 400,
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
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    employeeInfo: {
        marginBottom: 20,
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
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
    },
    statusOptionSelected: {
        borderColor: '#354A5F',
        backgroundColor: '#EFF3F8',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#354A5F',
    },
    statusOptionLabel: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    statusOptionLabelSelected: {
        fontWeight: '600',
        color: '#000',
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
