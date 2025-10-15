import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../apiClient';
import { StravaActivity, StravaGear } from '../../types';

export interface SyncResult {
  activitiesProcessed: number;
  distanceUpdated: boolean;
  newActivities: number;
}

// Sync with Strava
export const useStravaSync = () => {
  const queryClient = useQueryClient();

  return useMutation<SyncResult, Error>({
    mutationFn: async () => {
      return makeRequest<SyncResult>({
        method: 'POST',
        url: '/strava/sync',
      });
    },
    onSuccess: () => {
      // Invalidate all relevant queries after sync
      queryClient.invalidateQueries({ queryKey: ['components'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      queryClient.invalidateQueries({ queryKey: ['strava', 'activities'] });
    },
  });
};

// Get Strava activities
export const useStravaActivities = (page: number = 1, perPage: number = 30) => {
  return useQuery<StravaActivity[], Error>({
    queryKey: ['strava', 'activities', page, perPage],
    queryFn: async () => {
      return makeRequest<StravaActivity[]>({
        method: 'GET',
        url: `/strava/activities?page=${page}&per_page=${perPage}`,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
};

// Get recent Strava activities (for dashboard)
export const useRecentStravaActivities = (limit: number = 5) => {
  return useQuery<StravaActivity[], Error>({
    queryKey: ['strava', 'activities', 'recent', limit],
    queryFn: async () => {
      return makeRequest<StravaActivity[]>({
        method: 'GET',
        url: `/strava/activities/recent?limit=${limit}`,
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get Strava gears (bikes)
export const useStravaGears = () => {
  return useQuery<StravaGear[], Error>({
    queryKey: ['strava', 'gears'],
    queryFn: async () => {
      return makeRequest<StravaGear[]>({
        method: 'GET',
        url: '/strava/gears',
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - gears don't change often
  });
};

// Setup Strava webhook
export const useSetupStravaWebhook = () => {
  return useMutation<{ subscriptionId: string }, Error>({
    mutationFn: async () => {
      return makeRequest<{ subscriptionId: string }>({
        method: 'POST',
        url: '/strava/webhook/setup',
      });
    },
  });
};

// Get Strava webhook status
export const useStravaWebhookStatus = () => {
  return useQuery<{ isActive: boolean; subscriptionId?: string }, Error>({
    queryKey: ['strava', 'webhook', 'status'],
    queryFn: async () => {
      return makeRequest<{ isActive: boolean; subscriptionId?: string }>({
        method: 'GET',
        url: '/strava/webhook/status',
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Link Strava gear to bike
export const useLinkStravaGear = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { bikeId: string; stravaGearId: string }>({
    mutationFn: async ({ bikeId, stravaGearId }: { bikeId: string; stravaGearId: string }) => {
      return makeRequest<void>({
        method: 'POST',
        url: `/bikes/${bikeId}/link-strava-gear`,
        data: { stravaGearId },
      });
    },
    onSuccess: () => {
      // Invalidate bikes and strava gears
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      queryClient.invalidateQueries({ queryKey: ['strava', 'gears'] });
    },
  });
};

// Unlink Strava gear from bike
export const useUnlinkStravaGear = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (bikeId: string) => {
      return makeRequest<void>({
        method: 'DELETE',
        url: `/bikes/${bikeId}/unlink-strava-gear`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      queryClient.invalidateQueries({ queryKey: ['strava', 'gears'] });
    },
  });
};

// Get sync history/logs
export const useSyncHistory = (limit: number = 20) => {
  return useQuery<any[], Error>({
    queryKey: ['strava', 'sync-history', limit],
    queryFn: async () => {
      return makeRequest<any[]>({
        method: 'GET',
        url: `/strava/sync-history?limit=${limit}`,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};
