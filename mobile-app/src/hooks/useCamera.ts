/**
 * useCamera Hook
 * Manages camera permissions and photo capture
 * Edge case #9: Graceful degradation for missing permissions
 * @module hooks/useCamera
 */

import { useState, useCallback } from 'react';

interface UseCameraResult {
  hasPermission: boolean | null;
  isReady: boolean;
  capturedImage: string | null;
  requestPermission: () => Promise<boolean>;
  capturePhoto: () => Promise<string | null>;
  clearPhoto: () => void;
  error: string | null;
}

/**
 * Hook to manage camera functionality
 * Edge case #9: Falls back to gallery if camera permission denied
 */
export function useCamera(): UseCameraResult {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // TODO: Implement with expo-camera
      // const { status } = await Camera.requestCameraPermissionsAsync();
      // const granted = status === 'granted';
      const granted = true; // Placeholder

      setHasPermission(granted);
      setIsReady(granted);

      if (!granted) {
        setError('Camera permission denied. You can still upload images from your gallery.');
      }

      return granted;
    } catch (err) {
      setError('Failed to request camera permission');
      setHasPermission(false);
      return false;
    }
  }, []);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    try {
      if (!hasPermission) {
        setError('Camera permission required');
        return null;
      }

      // TODO: Implement actual capture with expo-camera
      const mockUri = `file:///mock-capture-${Date.now()}.jpg`;
      setCapturedImage(mockUri);
      return mockUri;
    } catch (err) {
      setError('Failed to capture photo');
      return null;
    }
  }, [hasPermission]);

  const clearPhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  return {
    hasPermission,
    isReady,
    capturedImage,
    requestPermission,
    capturePhoto,
    clearPhoto,
    error,
  };
}

export default useCamera;
