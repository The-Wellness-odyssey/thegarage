import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function CarDetailScreen(props) {
  // Read the param passed from the GarageListScreen
  // Note: Accommodating standard getParam or route.params syntax depending on exact library version
  const car = props.navigation.getParam ? props.navigation.getParam('car') : props.route.params.car;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{car.year} {car.make} {car.model}</Text>
      
      <Text style={styles.label}>Engine:</Text>
      <Text style={styles.value}>{car.engine}</Text>
      
      <Text style={styles.label}>Project Notes:</Text>
      <Text style={styles.value}>{car.notes}</Text>

      <View style={styles.buttonContainer}>
        {/* Custom goBack action */}
        <Button title="Back to Garage" onPress={() => props.navigation.goBack()} />
      </View>
    </View>
  );
}

// Dynamically set the header title based on the passed parameters
CarDetailScreen.navigationOptions = ({ navigation }) => {
  const car = navigation.getParam('car');
  return {
    title: car ? car.model : 'Car Details',
  };
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#1F4E79' },
  value: { fontSize: 16, color: '#444', marginBottom: 10, lineHeight: 22 },
  buttonContainer: { marginTop: 30 }
});