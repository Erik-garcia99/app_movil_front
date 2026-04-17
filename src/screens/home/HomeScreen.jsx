//esto debemos de cambiar, porque lo primero se va a tener que topar sera el login, 
//pero creo que nos estmos matando por algo que no va haci, 


import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNavBar from './src/components/common/BottomNavBar';



// Importar tus pantallas existentes
import HomeScreen from './src/screens/home/HomeScreen';
import InventoryScreen from './src/screens/inventory/InventoryScreen'; // aunque se llame DashboardScreen, la usamos como inventario
import AlertsScreen from './src/screens/alerts/AlertsScreen'; // recién creada
import InsightScreen from './src/screens/insight/InsightScreen';
import loginScreen from './src/screens/auth/LoginScreen';


// Simulación de autenticación (cambia a false para ver login)
const IS_LOGGED_IN = true; // Ponlo en true para probar la barra

function AuthScreen() {
  return (
    <View style={styles.center}>
      {/* Aquí importarías tu LoginScreen de auth/LoginScreen.jsx */}
    </View>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  if (!IS_LOGGED_IN) {
    return (
      <SafeAreaProvider style={styles.safeArea}>
        <AuthScreen />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'inventory': return <InventoryScreen />;
      case 'alerts': return <AlertsScreen />;
      case 'insight': return <InsightScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          {loginScreen()}
          {renderScreen()}
        </View>
        <BottomNavBar currentScreen={currentScreen} onSelectScreen={setCurrentScreen} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#567C8D' },
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});


/**
 * 
 * instalar icon por svg
 * 
 * import Svg, { Path } from 'react-native-svg';

<Svg width={24} height={24} viewBox="0 0 24 24">
  <Path d="M12 2C6.48 2 2 6.48..." fill="#000" />
</Svg>
 * 
 */