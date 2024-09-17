/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Stack from './navigation/Stack';
import {NavigationContainer} from '@react-navigation/native';
import styled from 'styled-components/native';

const AppSafeArea = styled.SafeAreaView`
  flex: 1;
`;

function App() {
  return (
    <AppSafeArea>
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    </AppSafeArea>
  );
}

export default App;
