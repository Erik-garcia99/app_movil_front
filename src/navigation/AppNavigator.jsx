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
import AlertsScreen from '../screens/alerts/AlertsScreen';
import InsightScreen from '../screens/insight/InsightScreen';
import PendingScreen from '../screens/auth/PendingScreen';
import EmployeeManagementScreen from '../screens/admin/EmployeeManagementScreen';

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
            <Stack.Screen name="Alerts" component={AlertsScreen} />
            <Stack.Screen name="Insight" component={InsightScreen} />
            <Stack.Screen name="Pending" component={PendingScreen} />
            <Stack.Screen name="EmployeeManagement" component={EmployeeManagementScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}