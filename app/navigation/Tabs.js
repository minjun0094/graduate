import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styled from 'styled-components';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';

const Tabs = createBottomTabNavigator();

export default () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        style: {
          borderTopColor: 'black',
        },
      }}
    />
  );
};
