/**
 * Hook for real-time data updates from simulator
 */

import { useState, useEffect, useCallback } from 'react';
import { simulatorClient } from '@/lib/api/simulator-client';

interface UseRealtimeDataOptions {
  refreshInterval?: number; // milliseconds
  enabled?: boolean;
}

export function useRealtimeData<T>(
  fetchFunction: () => Promise<T>,
  options: UseRealtimeDataOptions = {}
) {
  const { refreshInterval = 2000, enabled = true } = options; // Default 2 seconds for faster updates
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const result = await fetchFunction();
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, enabled]);

  return { data, loading, error, lastUpdate, refetch: fetchData };
}

// Specific hooks for each data type
export function useRealtimeClients(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getClients(), options);
}

export function useRealtimeLicenses(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getLicenses(), options);
}

export function useRealtimeLeads(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getLeads(), options);
}

export function useRealtimeTechnicians(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getTechnicians(), options);
}

export function useRealtimeDepartments(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getDepartments(), options);
}

export function useRealtimeVendors(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getVendors(), options);
}

export function useRealtimeContracts(options?: UseRealtimeDataOptions) {
  return useRealtimeData(() => simulatorClient.getContracts(), options);
}
