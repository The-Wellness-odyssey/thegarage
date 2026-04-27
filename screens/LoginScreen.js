import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Garage</Text>
      <Button
        title="Open Bay Doors"
        onPress={() => navigation.replace('Main')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#333' }
});