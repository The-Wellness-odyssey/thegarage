import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CarDetailScreen({ route }) {
  const { vehicle } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{vehicle.Make_Name} {vehicle.Model_Name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>NHTSA Registry Data</Text>
        <Text style={styles.dataRow}><Text style={styles.label}>Make:</Text> {vehicle.Make_Name}</Text>
        <Text style={styles.dataRow}><Text style={styles.label}>Model:</Text> {vehicle.Model_Name}</Text>
        <Text style={styles.dataRow}><Text style={styles.label}>Model ID:</Text> {vehicle.Model_ID}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Active Project Notes</Text>
        <Text style={styles.bodyText}>
          Compatibility check required for 1MZ-FE and 2AZ-FE engine blocks prior to installation. 
        </Text>
        <Text style={styles.bodyText}>
          Exclude lower intake plenum and fuel injectors from current parts order. Proceed strictly with rear valve cover gasket replacement.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1F4E79', padding: 25, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 10, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 15, color: '#2E75B6' },
  dataRow: { fontSize: 16, marginBottom: 8, color: '#444' },
  label: { fontWeight: 'bold', color: '#333' },
  bodyText: { fontSize: 16, lineHeight: 24, color: '#555', marginBottom: 10 }
});