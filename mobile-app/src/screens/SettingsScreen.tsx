/**
 * Settings Screen
 * User preferences, language selection, and app settings
 * @module screens/SettingsScreen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setLanguage } from '../store/appSlice';
import { logout } from '../store/userSlice';
import LanguageSelector from '../components/LanguageSelector';
import SyncProgress from '../components/SyncProgress';

export default function SettingsScreen(): React.JSX.Element {
  const dispatch = useDispatch();
  const { language, pendingSyncCount, lastSyncAt } = useSelector((state: RootState) => state.app);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'Not logged in'}</Text>
          {user?.region && (
            <Text style={styles.profileRegion}>📍 {user.region}</Text>
          )}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language / زبان</Text>
        <LanguageSelector
          selectedLanguage={language}
          onSelect={(lang) => dispatch(setLanguage(lang))}
        />
      </View>

      {/* Sync Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Status</Text>
        <SyncProgress />
        <Text style={styles.syncInfo}>
          Pending items: {pendingSyncCount}
        </Text>
        <Text style={styles.syncInfo}>
          Last sync: {lastSyncAt || 'Never'}
        </Text>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch value={true} onValueChange={() => {}} trackColor={{ true: '#2E7D32' }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-sync on WiFi</Text>
          <Switch value={true} onValueChange={() => {}} trackColor={{ true: '#2E7D32' }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>High-quality images</Text>
          <Switch value={false} onValueChange={() => {}} trackColor={{ true: '#2E7D32' }} />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>Agricultural Advisory v1.0.0</Text>
        <Text style={styles.aboutText}>Cursor Hackathon 2026</Text>
      </View>

      {/* Logout */}
      {isAuthenticated && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => dispatch(logout())}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  profileCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#666', marginTop: 4 },
  profileRegion: { fontSize: 14, color: '#2E7D32', marginTop: 8 },
  syncInfo: { fontSize: 13, color: '#666', marginTop: 4 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 16, color: '#333' },
  aboutText: { fontSize: 14, color: '#666', marginBottom: 4 },
  logoutButton: {
    margin: 16, padding: 16, backgroundColor: '#FFEBEE',
    borderRadius: 12, alignItems: 'center',
  },
  logoutText: { color: '#C62828', fontSize: 16, fontWeight: '600' },
});
