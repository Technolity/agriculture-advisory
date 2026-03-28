/**
 * Weather Widget Component
 * Displays current weather data
 * @module components/WeatherWidget
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeatherWidget(): React.JSX.Element {
  // TODO: Connect to weather hook/service
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Weather</Text>
        <Text style={styles.location}>📍 Kashmir</Text>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.temperature}>--°C</Text>
        <Text style={styles.condition}>Loading...</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💧 Humidity</Text>
          <Text style={styles.detailValue}>--% </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🌧️ Rain</Text>
          <Text style={styles.detailValue}>-- mm</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💨 Wind</Text>
          <Text style={styles.detailValue}>-- km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16, backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  location: { fontSize: 14, color: '#666' },
  mainInfo: { alignItems: 'center', marginBottom: 16 },
  temperature: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  condition: { fontSize: 16, color: '#666', marginTop: 4 },
  details: { flexDirection: 'row', justifyContent: 'space-around' },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 4 },
});
