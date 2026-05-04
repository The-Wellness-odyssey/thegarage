import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import GarageListScreen from './screens/GarageListScreen';
import CarDetailScreen from './screens/CarDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="GarageList" 
          component={GarageListScreen} 
          options={{ title: 'The Garage: Database', headerBackVisible: false }} 
        />
        <Stack.Screen 
          name="CarDetail" 
          component={CarDetailScreen} 
          options={{ title: 'Vehicle Specs' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}