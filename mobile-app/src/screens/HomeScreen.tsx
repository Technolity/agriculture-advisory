/**
 * Home Screen
 * Dashboard with crops overview, weather widget, and quick actions
 * @module screens/HomeScreen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import OfflineIndicator from '../components/OfflineIndicator';
import WeatherWidget from '../components/WeatherWidget';

export default function HomeScreen(): React.JSX.Element {
  const { networkStatus } = useSelector((state: RootState) => state.app);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <ScrollView style={styles.container}>
      <OfflineIndicator />

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>
          Welcome, {user?.name || 'Farmer'} 👋
        </Text>
        <Text style={styles.subtitle}>
          Your agricultural advisory dashboard
        </Text>
      </View>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionLabel}>Detect Disease</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🌾</Text>
            <Text style={styles.actionLabel}>My Crops</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💹</Text>
            <Text style={styles.actionLabel}>Market Prices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Planting Guide</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent activity</Text>
          <Text style={styles.emptySubtext}>Start by detecting a disease or browsing crops</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  welcomeSection: { padding: 20, backgroundColor: '#2E7D32', paddingTop: 10 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#C8E6C9', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 20, alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionLabel: { fontSize: 14, fontWeight: '500', color: '#333', textAlign: 'center' },
  emptyState: { alignItems: 'center', padding: 32, backgroundColor: '#FFF', borderRadius: 12 },
  emptyText: { fontSize: 16, color: '#666', fontWeight: '500' },
  emptySubtext: { fontSize: 13, color: '#999', marginTop: 4, textAlign: 'center' },
});
