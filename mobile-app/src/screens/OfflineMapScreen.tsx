/**
 * Offline Map Screen
 * Shows offline-available map data and nearby resources
 * @module screens/OfflineMapScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OfflineIndicator from '../components/OfflineIndicator';

export default function OfflineMapScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <OfflineIndicator />

      <View style={styles.content}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Offline Map</Text>
        <Text style={styles.description}>
          Map functionality will be available here showing nearby agricultural markets,
          extension offices, and weather stations.
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>📍 Nearby markets</Text>
          <Text style={styles.featureItem}>🏢 Extension offices</Text>
          <Text style={styles.featureItem}>🌡️ Weather stations</Text>
          <Text style={styles.featureItem}>💊 Pesticide dealers</Text>
        </View>
        <Text style={styles.comingSoon}>Coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  description: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  featureList: { alignSelf: 'flex-start', marginLeft: 32 },
  featureItem: { fontSize: 16, color: '#444', marginBottom: 8 },
  comingSoon: { fontSize: 14, color: '#999', fontStyle: 'italic', marginTop: 24 },
});
