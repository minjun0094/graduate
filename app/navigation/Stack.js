import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default ({}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'card',
        cardStyle: {
          backgroundColor: 'white',
          borderBottomColor: 'transparent',
          shadowColor: 'transparent',
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};
