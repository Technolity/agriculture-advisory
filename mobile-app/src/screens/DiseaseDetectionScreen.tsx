/**
 * Disease Detection Screen
 * Camera capture + disease classification interface
 * Edge case #5: Handles blurry images
 * Edge case #9: Camera permission fallback
 * @module screens/DiseaseDetectionScreen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentImage, setProcessing } from '../store/diseaseSlice';
import CameraCapture from '../components/CameraCapture';
import DiseaseResult from '../components/DiseaseResult';
import OfflineIndicator from '../components/OfflineIndicator';

export default function DiseaseDetectionScreen(): React.JSX.Element {
  const dispatch = useDispatch();
  const { currentImage, currentDetection, isProcessing, error } = useSelector(
    (state: RootState) => state.disease
  );
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (imageUri: string) => {
    dispatch(setCurrentImage(imageUri));
    setShowCamera(false);

    // TODO: Send image for analysis
    dispatch(setProcessing(true));
    console.log('[DiseaseDetection] Image captured, processing...');

    // Simulate processing delay
    setTimeout(() => {
      dispatch(setProcessing(false));
    }, 2000);
  };

  const handleRetake = () => {
    dispatch(setCurrentImage(null));
    setShowCamera(true);
  };

  return (
    <View style={styles.container}>
      <OfflineIndicator />

      {showCamera ? (
        <CameraCapture
          onCapture={handleCapture}
          onCancel={() => setShowCamera(false)}
        />
      ) : currentDetection ? (
        <DiseaseResult
          detection={currentDetection}
          onRetake={handleRetake}
        />
      ) : (
        <View style={styles.startContainer}>
          <Text style={styles.title}>🔬 Disease Detection</Text>
          <Text style={styles.description}>
            Take a photo of your crop to identify diseases and get treatment recommendations.
          </Text>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.captureButtonText}>📸 Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              // Edge case #9: Fallback to gallery if camera permission denied
              Alert.alert('Gallery', 'Image picker would open here');
            }}
          >
            <Text style={styles.uploadButtonText}>📁 Upload from Gallery</Text>
          </TouchableOpacity>

          {isProcessing && (
            <View style={styles.processingBanner}>
              <Text style={styles.processingText}>🔄 Analyzing image...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 12 },
  description: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  captureButton: {
    backgroundColor: '#2E7D32', paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12,
  },
  captureButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  uploadButton: {
    backgroundColor: '#FFF', paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 12, width: '100%', alignItems: 'center',
    borderWidth: 2, borderColor: '#2E7D32',
  },
  uploadButtonText: { color: '#2E7D32', fontSize: 18, fontWeight: '600' },
  processingBanner: { backgroundColor: '#FFF9C4', padding: 16, borderRadius: 8, marginTop: 24, width: '100%' },
  processingText: { textAlign: 'center', color: '#F57F17', fontWeight: '500' },
  errorBanner: { backgroundColor: '#FFEBEE', padding: 16, borderRadius: 8, marginTop: 12, width: '100%' },
  errorText: { textAlign: 'center', color: '#C62828' },
});
