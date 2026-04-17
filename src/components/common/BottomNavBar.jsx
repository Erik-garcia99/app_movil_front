import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../../../assets/styles/BottomNavStyles';

const menuItems = [
  { key: 'home', label: 'Inicio', icon: 'home', iconOutline: 'home-outline' },
  { key: 'inventory', label: 'Inventario', icon: 'cube', iconOutline: 'cube-outline' },
  { key: 'alerts', label: 'Alertas', icon: 'alert-circle', iconOutline: 'alert-circle-outline' },
  { key: 'insight', label: 'Insight', icon: 'stats-chart', iconOutline: 'stats-chart-outline' },
];

export default function BottomNavBar({ currentScreen, onSelectScreen }) {
  return (
    <View style={styles.container}>
      {menuItems.map((item) => {
        const isActive = currentScreen === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tab}
            onPress={() => onSelectScreen(item.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.icon : item.iconOutline}
              size={28}
              color={isActive ? '#007AFF' : '#888888'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
