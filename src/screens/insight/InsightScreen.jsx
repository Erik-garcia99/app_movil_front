import { View, Text, StyleSheet } from 'react-native';

export default function InsightScreen() {
  return (
    <View style={styles.container}>
      <Text>Insights / Sugerencias</Text>
      <Text>Patrones, productos estancados, reportes...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});