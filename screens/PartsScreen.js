import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PartsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Parts</Text>
      <Text style={styles.item}>• Toyota Aurion cosmetic trims</Text>
      <Text style={styles.item}>• Magnetron & filters</Text>
    </View>
  );
}

// Sets the header title if nested in a stack, though here it just acts as a tab screen
PartsScreen.navigationOptions = {
  title: 'Parts Inventory',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 16, marginBottom: 10, color: '#555' }
});