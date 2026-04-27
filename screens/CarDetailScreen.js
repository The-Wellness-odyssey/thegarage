import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function CarDetailScreen({ route, navigation }) {
  const { car } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{car.year} {car.make} {car.model}</Text>

      <Text style={styles.label}>Engine:</Text>
      <Text style={styles.value}>{car.engine}</Text>

      <Text style={styles.label}>Project Notes:</Text>
      <Text style={styles.value}>{car.notes}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Back to Garage" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#1F4E79' },
  value: { fontSize: 16, color: '#444', marginBottom: 10, lineHeight: 22 },
  buttonContainer: { marginTop: 30 }
});