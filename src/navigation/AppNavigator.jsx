import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos tus pantallas
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';
import RegisterBranchScreen from '../screens/home/RegisterBranchScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import AddProductScreen from '../screens/inventory/AddProductScreen';
import NodeConfigScreen from '../screens/inventory/NodeConfigScreen';
import AlertsScreen from '../screens/alerts/AlertsScreen';
import InsightScreen from '../screens/insight/InsightScreen';
import PendingScreen from '../screens/auth/PendingScreen';
import EmployeeManagementScreen from '../screens/admin/EmployeeManagementScreen';
import ShelfDetailScreen from '../screens/inventory/ShelfDetailScreen';
import CalibrationScreen from '../screens/inventory/CalibrationScreen';
import RegisterNodeScreen from '../screens/inventory/RegisterNodeScreen';
import SurtidoSetupScreen from '../screens/inventory/SurtidoSetupScreen';
import SurtidoIngresoScreen from '../screens/inventory/SurtidoIngresoScreen';
import SurtidoValidacionScreen from '../screens/inventory/SurtidoValidacionScreen';
import SurtidoExitoScreen from '../screens/inventory/SurtidoExitoScreen';




const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
        {/* screenOptions={{headerShown: false}} quita la barra superior fea que pone por defecto */}
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="RegisterBranch" component={RegisterBranchScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Inventory" component={InventoryScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="NodeConfig" component={NodeConfigScreen} />
            <Stack.Screen name="Alerts" component={AlertsScreen} />
            <Stack.Screen name="Insight" component={InsightScreen} />
            <Stack.Screen name="Pending" component={PendingScreen} />
            <Stack.Screen name="EmployeeManagement" component={EmployeeManagementScreen} />
            <Stack.Screen name="ShelfDetail" component={ShelfDetailScreen} />
            <Stack.Screen name="Calibration" component={CalibrationScreen} />
            <Stack.Screen name="RegisterNode" component={RegisterNodeScreen} />
            <Stack.Screen name="SurtidoSetup" component={SurtidoSetupScreen} />
            <Stack.Screen name="SurtidoIngreso" component={SurtidoIngresoScreen} />
            <Stack.Screen name="SurtidoValidacion" component={SurtidoValidacionScreen} />
            <Stack.Screen name="SurtidoExito" component={SurtidoExitoScreen} />

        </Stack.Navigator>
        </NavigationContainer>
    );
}
