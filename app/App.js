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
import {TranslatorProvider} from 'react-native-translator';

const AppSafeArea = styled.View`
  flex: 1;
`;

function App() {
  return (
    <TranslatorProvider>
      <AppSafeArea>
        <NavigationContainer>
          <Stack />
        </NavigationContainer>
      </AppSafeArea>
    </TranslatorProvider>
  );
}

export default App;
