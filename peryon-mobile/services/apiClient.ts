import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://localhost:7001/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    if (authToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  // tslint:disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
      // You might want to trigger a logout here or redirect to login
    }

    return Promise.reject({
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 0,
      errors: error.response?.data?.errors || [],
    });
  }
);

// Helper function for making requests
export const makeRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient(config);
  return response.data.data || response.data;
};
