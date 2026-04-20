

import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {styles,font} from "./assets/styles/BottomNavStyles"
import { globalStyles } from './assets/styles/GlobalStyles';
import LoginScreen from "./src/screens/auth/LoginScreen"
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider style={globalStyles}>
      <AppNavigator />
    </SafeAreaProvider>
  );
}