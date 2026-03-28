/**
 * Sync Progress Component
 * Displays sync queue processing status
 * @module components/SyncProgress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function SyncProgress(): React.JSX.Element {
  const { syncStatus, pendingSyncCount } = useSelector((state: RootState) => state.app);

  const statusConfig = {
    idle: { color: '#9E9E9E', label: '⏸️ Idle', bg: '#F5F5F5' },
    syncing: { color: '#1565C0', label: '🔄 Syncing...', bg: '#E3F2FD' },
    error: { color: '#C62828', label: '❌ Sync Error', bg: '#FFEBEE' },
    complete: { color: '#2E7D32', label: '✅ Synced', bg: '#E8F5E9' },
  };

  const config = statusConfig[syncStatus];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
      {pendingSyncCount > 0 && syncStatus !== 'complete' && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '30%', backgroundColor: config.color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 8 },
  statusText: { fontWeight: '600', fontSize: 14 },
  progressBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
