/**
 * useSync Hook
 * Manages sync queue state and processing
 * @module hooks/useSync
 */

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSyncStatus, setPendingSyncCount, setLastSyncAt } from '../store/appSlice';
import { processSyncQueue, getPendingSyncCount, addToSyncQueue } from '../services/syncService';
import { RootState } from '../store/store';
import { SyncStatus } from '../types';

/**
 * Hook to manage sync queue and processing
 */
export function useSync() {
  const dispatch = useDispatch();
  const { syncStatus, pendingSyncCount, lastSyncAt, networkStatus } = useSelector(
    (state: RootState) => state.app
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Check pending count on mount
  useEffect(() => {
    refreshPendingCount();
  }, []);

  const refreshPendingCount = useCallback(async () => {
    const count = await getPendingSyncCount();
    dispatch(setPendingSyncCount(count));
  }, [dispatch]);

  const sync = useCallback(async () => {
    if (networkStatus !== 'online') {
      console.log('[useSync] Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    dispatch(setSyncStatus('syncing'));

    try {
      const result = await processSyncQueue();
      dispatch(setSyncStatus('complete'));
      dispatch(setLastSyncAt(new Date().toISOString()));
      await refreshPendingCount();
      return result;
    } catch (error) {
      dispatch(setSyncStatus('error'));
      console.error('[useSync] Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [networkStatus, dispatch, refreshPendingCount]);

  const queueAction = useCallback(
    async (actionType: string, payload: Record<string, unknown>, priority: number = 0) => {
      await addToSyncQueue({ actionType, payload, priority });
      await refreshPendingCount();
    },
    [refreshPendingCount]
  );

  return {
    syncStatus,
    pendingSyncCount,
    lastSyncAt,
    isSyncing,
    sync,
    queueAction,
    refreshPendingCount,
  };
}

export default useSync;
