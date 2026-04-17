import { View, Text, StyleSheet } from 'react-native';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Alertas</Text>
      <Text>Robo hormiga, stock bajo, nodos sin conexión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});