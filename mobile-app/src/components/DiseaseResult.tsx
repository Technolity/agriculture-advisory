/**
 * Disease Result Component
 * Displays disease detection results with treatment recommendations
 * @module components/DiseaseResult
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { DiseaseDetection } from '../types';

interface DiseaseResultProps {
  detection: DiseaseDetection;
  onRetake: () => void;
}

export default function DiseaseResult({ detection, onRetake }: DiseaseResultProps): React.JSX.Element {
  const confidenceColor = detection.confidence > 0.8 ? '#4CAF50' : detection.confidence > 0.5 ? '#FF9800' : '#F44336';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultCard}>
        <Text style={styles.title}>Detection Result</Text>

        {/* Confidence Score */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <Text style={[styles.confidenceValue, { color: confidenceColor }]}>
            {Math.round(detection.confidence * 100)}%
          </Text>
        </View>

        {/* Disease Info Placeholder */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Disease</Text>
          <Text style={styles.infoValue}>{detection.diseaseId || 'Processing...'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Treatment</Text>
          <Text style={styles.infoValue}>
            Treatment recommendations will be displayed here once the analysis is complete.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Severity</Text>
          <View style={styles.severityBadge}>
            <Text style={styles.severityText}>--</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeText}>📸 Take Another Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.feedbackButton}>
          <Text style={styles.feedbackText}>👍 Was this helpful?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  resultCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  confidenceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 },
  confidenceLabel: { fontSize: 16, color: '#666' },
  confidenceValue: { fontSize: 28, fontWeight: 'bold' },
  infoSection: { marginBottom: 16 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 16, color: '#333', lineHeight: 24 },
  severityBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start' },
  severityText: { color: '#E65100', fontWeight: '600' },
  actions: { marginTop: 16, gap: 12 },
  retakeButton: { backgroundColor: '#2E7D32', padding: 16, borderRadius: 12, alignItems: 'center' },
  retakeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  feedbackButton: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  feedbackText: { color: '#666', fontSize: 16 },
});
