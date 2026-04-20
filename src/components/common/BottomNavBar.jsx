import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // IMPORTANTE
import { styles } from '../../../assets/styles/BottomNavStyles';

const menuItems = [
  { key: 'Home', label: 'Inicio', icon: 'home', iconOutline: 'home-outline' },
  { key: 'Inventory', label: 'Inventario', icon: 'cube', iconOutline: 'cube-outline' },
  { key: 'Alerts', label: 'Alertas', icon: 'alert-circle', iconOutline: 'alert-circle-outline' },
  { key: 'Insight', label: 'Insight', icon: 'stats-chart', iconOutline: 'stats-chart-outline' },
];

export default function BottomNavBar({ currentScreen, onSelectScreen }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
        styles.container, 
        { 
            backgroundColor: '#F5EFEB', 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 15, 
            height: 70 + (insets.bottom > 0 ? insets.bottom : 0) 
        }
    ]}>
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
              size={24} 
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