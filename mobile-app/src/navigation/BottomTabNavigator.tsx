/**
 * Bottom Tab Navigator
 * Main navigation structure with 5 tabs
 * @module navigation/BottomTabNavigator
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { RootTabParamList } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DiseaseDetectionScreen from '../screens/DiseaseDetectionScreen';
import PlantingGuideScreen from '../screens/PlantingGuideScreen';
import MarketPriceScreen from '../screens/MarketPriceScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Tab icon component (placeholder using emoji)
 * TODO: Replace with proper icon library (e.g., @expo/vector-icons)
 */
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    DiseaseDetection: '🔬',
    PlantingGuide: '🌱',
    MarketPrice: '💰',
    Settings: '⚙️',
  };

  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[label] || '📱'}
    </Text>
  );
}

export default function BottomTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="DiseaseDetection"
        component={DiseaseDetectionScreen}
        options={{ title: 'Detect' }}
      />
      <Tab.Screen
        name="PlantingGuide"
        component={PlantingGuideScreen}
        options={{ title: 'Guides' }}
      />
      <Tab.Screen
        name="MarketPrice"
        component={MarketPriceScreen}
        options={{ title: 'Prices' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
