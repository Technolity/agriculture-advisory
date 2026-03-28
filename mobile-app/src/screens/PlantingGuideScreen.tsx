/**
 * Planting Guide Screen
 * Season-specific crop guidance and recommendations
 * @module screens/PlantingGuideScreen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import CropCard from '../components/CropCard';
import OfflineIndicator from '../components/OfflineIndicator';

export default function PlantingGuideScreen(): React.JSX.Element {
  const { crops, isLoading } = useSelector((state: RootState) => state.crops);

  return (
    <View style={styles.container}>
      <OfflineIndicator />

      <View style={styles.header}>
        <Text style={styles.title}>🌱 Planting Guide</Text>
        <Text style={styles.subtitle}>
          Season-specific crop guidance for your region
        </Text>
      </View>

      {/* Season Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {['All', 'Rabi', 'Kharif', 'Zaid'].map((season) => (
          <View key={season} style={styles.filterChip}>
            <Text style={styles.filterChipText}>{season}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Crop List */}
      {crops.length > 0 ? (
        <FlatList
          data={crops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CropCard crop={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌾</Text>
          <Text style={styles.emptyText}>No crops loaded yet</Text>
          <Text style={styles.emptySubtext}>
            {isLoading ? 'Loading...' : 'Pull down to refresh or check your connection'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  filterBar: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 56 },
  filterChip: {
    backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginRight: 8,
  },
  filterChipText: { color: '#2E7D32', fontWeight: '500' },
  listContent: { padding: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center' },
});
