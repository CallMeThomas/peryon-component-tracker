import { useMutation, useQuery } from '@tanstack/react-query';
import { makeRequest, setAuthToken } from '../apiClient';
import { User } from '../../types';

export interface AuthResponse {
  user: User;
  token: string;
}

// Authenticate with Strava
export const useStravaAuth = () => {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: async (stravaAccessToken: string) => {
      return makeRequest<AuthResponse>({
        method: 'POST',
        url: '/auth/strava',
        data: { stravaAccessToken },
      });
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
    },
    onError: () => {
      setAuthToken(null);
    },
  });
};

// Refresh token
export const useRefreshToken = () => {
  return useMutation<{ token: string }, Error>({
    mutationFn: async () => {
      return makeRequest<{ token: string }>({
        method: 'POST',
        url: '/auth/refresh',
      });
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
    },
    onError: () => {
      setAuthToken(null);
    },
  });
};

// Get current user
export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery<User, Error>({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      return makeRequest<User>({
        method: 'GET',
        url: '/user/me',
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Update user
export const useUpdateUser = () => {
  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (userData) => {
      return makeRequest<User>({
        method: 'PUT',
        url: '/user/me',
        data: userData,
      });
    },
  });
};