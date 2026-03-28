/**
 * Offline Indicator Component
 * Shows network status banner when offline
 * Edge case #1: Visual feedback for offline mode
 * @module components/OfflineIndicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function OfflineIndicator(): React.JSX.Element | null {
  const { networkStatus, pendingSyncCount } = useSelector((state: RootState) => state.app);

  if (networkStatus === 'online') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        📡 {networkStatus === 'offline' ? 'You are offline' : 'Checking connection...'}
      </Text>
      {pendingSyncCount > 0 && (
        <Text style={styles.syncText}>
          {pendingSyncCount} item{pendingSyncCount > 1 ? 's' : ''} waiting to sync
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  text: { color: '#E65100', fontWeight: '600', fontSize: 14 },
  syncText: { color: '#F57C00', fontSize: 12, marginTop: 2 },
});
