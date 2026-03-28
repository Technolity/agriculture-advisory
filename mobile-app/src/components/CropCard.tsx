/**
 * Crop Card Component
 * Displays crop information in a card format
 * @module components/CropCard
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crop } from '../types';

interface CropCardProps {
  crop: Crop;
  onPress?: (crop: Crop) => void;
}

const seasonColors: Record<string, string> = {
  rabi: '#1565C0',
  kharif: '#2E7D32',
  zaid: '#F57F17',
};

export default function CropCard({ crop, onPress }: CropCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(crop)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.cropName}>{crop.name}</Text>
        <View style={[styles.seasonBadge, { backgroundColor: seasonColors[crop.season] || '#666' }]}>
          <Text style={styles.seasonText}>{crop.season.toUpperCase()}</Text>
        </View>
      </View>

      {crop.nameUrdu && (
        <Text style={styles.urduName}>{crop.nameUrdu}</Text>
      )}

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📍 Region</Text>
          <Text style={styles.detailValue}>{crop.region}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💧 Water</Text>
          <Text style={styles.detailValue}>{crop.waterNeeds}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🌍 Soil</Text>
          <Text style={styles.detailValue}>{crop.soilType}</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        <Text style={styles.timelineText}>
          🌱 Plant: Month {crop.plantingMonth} → 🌾 Harvest: Month {crop.harvestMonth}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cropName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seasonBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  seasonText: { color: '#FFF', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  urduName: { fontSize: 14, color: '#666', marginBottom: 12, fontStyle: 'italic' },
  details: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: {},
  detailLabel: { fontSize: 12, color: '#888' },
  detailValue: { fontSize: 14, color: '#333', fontWeight: '500', marginTop: 2, textTransform: 'capitalize' },
  timeline: { backgroundColor: '#F5F5F5', padding: 10, borderRadius: 8 },
  timelineText: { fontSize: 13, color: '#555' },
});
