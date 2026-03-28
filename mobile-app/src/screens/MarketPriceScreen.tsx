/**
 * Market Price Screen
 * Real-time market prices for local crops
 * @module screens/MarketPriceScreen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import OfflineIndicator from '../components/OfflineIndicator';

export default function MarketPriceScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <OfflineIndicator />

      <View style={styles.header}>
        <Text style={styles.title}>💰 Market Prices</Text>
        <Text style={styles.subtitle}>Latest prices from local markets</Text>
      </View>

      {/* Region Selector */}
      <View style={styles.regionSelector}>
        <Text style={styles.regionLabel}>📍 Region: Kashmir</Text>
      </View>

      {/* Price Table Placeholder */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Crop</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Unit</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Trend</Text>
        </View>

        {/* Placeholder rows */}
        {['Wheat', 'Rice', 'Corn', 'Tomatoes', 'Apples'].map((crop, index) => (
          <View key={crop} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{crop}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>--</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>per kg</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>--</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Prices are updated every 6 hours. Last update: --
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  regionSelector: {
    margin: 16, padding: 12, backgroundColor: '#E8F5E9',
    borderRadius: 8, borderWidth: 1, borderColor: '#C8E6C9',
  },
  regionLabel: { fontSize: 16, color: '#2E7D32', fontWeight: '500' },
  tableContainer: { margin: 16, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#2E7D32', padding: 12 },
  tableHeaderText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tableRowAlt: { backgroundColor: '#F9F9F9' },
  tableCell: { fontSize: 14, color: '#333' },
  disclaimer: { padding: 16, alignItems: 'center' },
  disclaimerText: { fontSize: 12, color: '#999', fontStyle: 'italic' },
});
