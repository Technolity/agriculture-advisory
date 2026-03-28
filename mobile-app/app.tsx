/**
 * Mobile App Entry Point
 * Agricultural Advisory App
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

/**
 * Root application component
 * Wraps the app with Redux Provider, Navigation, and Error Boundary
 */
export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <BottomTabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}
