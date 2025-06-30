import { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Custom hook for real-time data fetching
export function useSupabaseQuery<T>(
  table: keyof Database['public']['Tables'],
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let query = supabase.from(table).select(options?.select || '*');

        // Apply filters
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // Apply ordering
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending ?? false 
          });
        }

        // Apply limit
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

// Hook for dashboard statistics
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBikes: 0,
    activeTrips: 0,
    dailyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const dashboardStats = await dbHelpers.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
}

// Hook for real-time bike status updates
export function useBikeStatus() {
  const [bikes, setBikes] = useState<Database['public']['Tables']['bikes']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    dbHelpers.getBikes().then(data => {
      setBikes(data);
      setLoading(false);
    });

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('bikes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bikes'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBikes(prev => [payload.new as any, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBikes(prev => prev.map(bike => 
              bike.id === payload.new.id ? payload.new as any : bike
            ));
          } else if (payload.eventType === 'DELETE') {
            setBikes(prev => prev.filter(bike => bike.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { bikes, loading };
}

// Hook for system alerts
export function useSystemAlerts() {
  const [alerts, setAlerts] = useState<Database['public']['Tables']['system_alerts']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    dbHelpers.getSystemAlerts(false).then(data => {
      setAlerts(data);
      setLoading(false);
    });

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_alerts'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as any, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(alert => 
              alert.id === payload.new.id ? payload.new as any : alert
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const resolveAlert = async (id: string) => {
    try {
      await dbHelpers.resolveAlert(id, 'admin'); // In real app, use actual admin ID
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, is_resolved: true } : alert
      ));
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  return { alerts, loading, resolveAlert };
}