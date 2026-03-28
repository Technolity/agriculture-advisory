/**
 * useOfflineMode Hook
 * Monitors network connectivity and manages offline state
 * Edge case #1: Offline mode detection and handling
 * @module hooks/useOfflineMode
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkStatus, setPendingSyncCount } from '../store/appSlice';
import { processSyncQueue, getPendingSyncCount } from '../services/syncService';
import { RootState } from '../store/store';
import { NetworkStatus } from '../types';

/**
 * Hook to monitor and manage offline state
 * Automatically syncs when coming back online
 */
export function useOfflineMode() {
  const dispatch = useDispatch();
  const { networkStatus, syncStatus } = useSelector((state: RootState) => state.app);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  useEffect(() => {
    // TODO: Use expo-network to monitor connectivity
    // NetInfo.addEventListener(handleConnectivityChange);
    checkConnection();

    // Placeholder: assume online
    dispatch(setNetworkStatus('online'));

    return () => {
      // Cleanup listener
    };
  }, []);

  const checkConnection = useCallback(async () => {
    setIsCheckingConnection(true);
    try {
      // TODO: Implement actual connectivity check using expo-network
      // const networkState = await Network.getNetworkStateAsync();
      // const status: NetworkStatus = networkState.isConnected ? 'online' : 'offline';
      // dispatch(setNetworkStatus(status));

      const pendingCount = await getPendingSyncCount();
      dispatch(setPendingSyncCount(pendingCount));
    } catch (error) {
      console.error('[useOfflineMode] Check failed:', error);
      dispatch(setNetworkStatus('offline'));
    } finally {
      setIsCheckingConnection(false);
    }
  }, [dispatch]);

  const syncNow = useCallback(async () => {
    if (networkStatus !== 'online') {
      console.log('[useOfflineMode] Cannot sync while offline');
      return;
    }

    try {
      const result = await processSyncQueue();
      const pendingCount = await getPendingSyncCount();
      dispatch(setPendingSyncCount(pendingCount));
      return result;
    } catch (error) {
      console.error('[useOfflineMode] Sync failed:', error);
    }
  }, [networkStatus, dispatch]);

  return {
    isOnline: networkStatus === 'online',
    isOffline: networkStatus === 'offline',
    networkStatus,
    syncStatus,
    isCheckingConnection,
    checkConnection,
    syncNow,
  };
}

export default useOfflineMode;
