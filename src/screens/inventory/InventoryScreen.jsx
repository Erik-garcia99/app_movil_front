import { View, Text, StyleSheet } from 'react-native';

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text>Gestión de Inventario</Text>
      <Text>Aquí vendrá la selección de estantes, productos, etc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});