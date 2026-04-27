import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const GARAGE_DATA = [
  {
    id: '1',
    make: 'Lexus',
    model: 'ES300',
    year: '1998',
    engine: '1mz-fe',
    notes: 'Rear valve cover gasket replacement. Access limited to upper plenum removal only. Do not remove lower plenum.',
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry Hybrid',
    year: '2009',
    engine: '2.4L Hybrid',
    notes: 'Sourcing overseas cosmetic parts (Australian Aurion / Prestige 06-11) for US-spec fitment.',
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model 3',
    year: '2020',
    engine: 'Dual Motor',
    notes: 'Routine maintenance and software updates.',
  }
];

export default function GarageListScreen(props) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => props.navigation.navigate('CarDetail', { car: item })}
    >
      <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
      <Text style={styles.subtitle}>{item.engine}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={GARAGE_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

// Configure the header title for this specific screen
GarageListScreen.navigationOptions = {
  title: 'My Garage',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 }
});