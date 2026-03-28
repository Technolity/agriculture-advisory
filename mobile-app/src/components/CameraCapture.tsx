/**
 * Camera Capture Component
 * Edge case #9: Handles camera permission denied gracefully
 * Edge case #5: UI prompt for blurry images
 * @module components/CameraCapture
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface CameraCaptureProps {
  onCapture: (imageUri: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: Request camera permission using expo-camera
    // Edge case #9: Handle permission denied
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      // TODO: Replace with actual Camera.requestCameraPermissionsAsync()
      // const { status } = await Camera.requestCameraPermissionsAsync();
      // setHasPermission(status === 'granted');
      setHasPermission(true); // Placeholder
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    }
  };

  const handleCapture = () => {
    // TODO: Implement actual camera capture
    // Placeholder: generate a mock URI
    const mockUri = `file:///mock-image-${Date.now()}.jpg`;
    onCapture(mockUri);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  // Edge case #9: Camera permission denied fallback
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.message}>Camera access denied</Text>
        <Text style={styles.subMessage}>
          Please enable camera access in your device settings, or use the gallery upload option.
        </Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      {/* TODO: Replace with actual Expo Camera component */}
      <View style={styles.cameraPreview}>
        <Text style={styles.previewText}>📸 Camera Preview</Text>
        <Text style={styles.previewSubtext}>(Camera component placeholder)</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureCircle} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <View style={{ width: 60 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#1a1a1a' },
  icon: { fontSize: 48, marginBottom: 16 },
  message: { fontSize: 18, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  subMessage: { fontSize: 14, color: '#AAA', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraPreview: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  previewText: { fontSize: 24, color: '#FFF' },
  previewSubtext: { fontSize: 14, color: '#888', marginTop: 8 },
  controls: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cancelButton: { padding: 12 },
  cancelText: { color: '#FFF', fontSize: 16 },
  captureCircle: {
    width: 70, height: 70, borderRadius: 35, borderWidth: 4,
    borderColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF' },
});
