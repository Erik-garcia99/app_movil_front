import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { globalStyles } from '../../../assets/styles/GlobalStyles';
import BottomNavBar from '../../components/common/BottomNavBar';
import TopHeader from '../../components/common/TopHeader';
import CustomAlert from '../../components/common/CustomAlert';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useBranches } from '../../hooks/useBranches';
import { usersAPI } from '../../api/users';
import EmployeeStatusModal from '../../components/admin/EmployeeStatusModal';

export default function EmployeeManagementScreen({ navigation }) {
    const { userRole } = useCurrentUser();
    const { branches } = useBranches();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [supervisors, setSupervisors] = useState([]);
    const [loadingSupervisors, setLoadingSupervisors] = useState(false);
    const [alert, setAlert] = useState({ visible: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getMyTeam();
            setEmployees(data);
        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                title: 'Error',
                message: error.detail || 'No se pudieron cargar los empleados'
            });
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEmployees();
        setRefreshing(false);
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setShowStatusModal(true);

        if (employee?.branch_id) {
            loadSupervisors(employee.branch_id);
        } else {
            setSupervisors([]);
        }
    };

    const loadSupervisors = async (branchId) => {
        if (!branchId) {
            setSupervisors([]);
            return;
        }

        try {
            setLoadingSupervisors(true);
            const data = await usersAPI.getBranchSupervisors(branchId);
            setSupervisors(data);
        } catch (error) {
            setSupervisors([]);
            setAlert({
                visible: true,
                type: 'error',
                title: 'Error',
                message: error.message || 'No se pudieron cargar los supervisores'
            });
        } finally {
            setLoadingSupervisors(false);
        }
    };

    const handleBranchChange = async (branchId) => {
        await loadSupervisors(branchId);
    };

    const handleSaveAuthorization = async ({ branchId, supervisorId, status }) => {
        if (!branchId) {
            setAlert({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Debes seleccionar una sucursal'
            });
            return;
        }

        if (!supervisorId) {
            setAlert({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Debes seleccionar un jefe directo'
            });
            return;
        }

        try {
            await usersAPI.assignBranch(selectedEmployee.id, branchId, supervisorId, status);
            setAlert({
                visible: true,
                type: 'success',
                title: 'Éxito',
                message: 'El empleado fue autorizado y asignado correctamente'
            });
            setShowStatusModal(false);
            await loadEmployees();
        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                title: 'Error',
                message: error.message || 'No se pudo guardar la asignación'
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: '#4CAF50',
            pending: '#FFC107',
            suspended: '#FF5722',
            deleted: '#9E9E9E'
        };
        return colors[status] || '#999';
    };

    const getStatusLabel = (status) => {
        const labels = {
            active: 'Activo',
            pending: 'Pendiente',
            suspended: 'Suspendido',
            deleted: 'Eliminado'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#354A5F" />
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <TopHeader navigation={navigation} userRole={userRole} />

            <View style={localStyles.subHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#000" strokeWidth={3} />
                </TouchableOpacity>
                <Text style={localStyles.subHeaderTitle}>gestión de empleados</Text>
            </View>

            <ScrollView
                contentContainerStyle={localStyles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {employees.length === 0 ? (
                    <View style={localStyles.emptyContainer}>
                        <Text style={localStyles.emptyText}>No tienes empleados asignados</Text>
                    </View>
                ) : (
                    <View style={localStyles.card}>
                        <View style={localStyles.tableHeader}>
                            <Text style={[localStyles.headerCell, { flex: 2 }]}>Nombre</Text>
                            <Text style={[localStyles.headerCell, { flex: 1.5 }]}>Email</Text>
                            <Text style={[localStyles.headerCell, { flex: 1 }]}>Estado</Text>
                            <Text style={[localStyles.headerCell, { flex: 0.5 }]}></Text>
                        </View>

                        {employees.map((employee, index) => (
                            <TouchableOpacity
                                key={employee.id}
                                style={[
                                    localStyles.tableRow,
                                    index !== employees.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }
                                ]}
                                onPress={() => handleSelectEmployee(employee)}
                            >
                                <Text style={[localStyles.cell, { flex: 2 }]} numberOfLines={1}>
                                    {employee.name}
                                </Text>
                                <Text style={[localStyles.cell, { flex: 1.5 }]} numberOfLines={1}>
                                    {employee.email}
                                </Text>
                                <View style={[localStyles.cell, { flex: 1 }]}>
                                    <View style={[
                                        localStyles.statusBadge,
                                        { backgroundColor: getStatusColor(employee.account_status) }
                                    ]}>
                                        <Text style={localStyles.statusText}>
                                            {getStatusLabel(employee.account_status)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[localStyles.cell, { flex: 0.5, justifyContent: 'center', alignItems: 'center' }]}>
                                    <ChevronRight size={18} color="#999" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <EmployeeStatusModal
                visible={showStatusModal}
                employee={selectedEmployee}
                branches={branches}
                supervisors={supervisors}
                loadingSupervisors={loadingSupervisors}
                onBranchChange={handleBranchChange}
                onSave={handleSaveAuthorization}
                onClose={() => setShowStatusModal(false)}
            />

            <CustomAlert
                visible={alert.visible}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert({ ...alert, visible: false })}
            />

            <BottomNavBar
                currentScreen="Admin"
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
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    subHeaderTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginLeft: 10,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 30,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
    },
    headerCell: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cell: {
        fontSize: 14,
        color: '#000',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
