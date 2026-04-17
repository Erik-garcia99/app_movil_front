/**
 *  
 * 
 * 
 * 
*/

import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {styles,font} from "./assets/styles/BottomNavStyles"

import LoginScreen from "./src/screens/auth/LoginScreen"


export default function App() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <SafeAreaView style={styles.screenContainer}>
        <LoginScreen />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}