import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../apiClient';
import { Bike } from '../../types';

// Get all bikes
export const useBikes = () => {
  return useQuery<Bike[], Error>({
    queryKey: ['bikes'],
    queryFn: async () => {
      return makeRequest<Bike[]>({
        method: 'GET',
        url: '/bikes',
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single bike
export const useBike = (id: string, enabled: boolean = true) => {
  return useQuery<Bike, Error>({
    queryKey: ['bikes', id],
    queryFn: async () => {
      return makeRequest<Bike>({
        method: 'GET',
        url: `/bikes/${id}`,
      });
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Create bike
export const useCreateBike = () => {
  const queryClient = useQueryClient();

  return useMutation<Bike, Error, Omit<Bike, 'id'>>({
    mutationFn: async bikeData => {
      return makeRequest<Bike>({
        method: 'POST',
        url: '/bikes',
        data: bikeData,
      });
    },
    onSuccess: newBike => {
      // Update the bikes list cache
      queryClient.setQueryData<Bike[]>(['bikes'], oldBikes => {
        return oldBikes ? [...oldBikes, newBike] : [newBike];
      });

      // Invalidate bikes query to refetch from server
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
};

// Update bike
export const useUpdateBike = () => {
  const queryClient = useQueryClient();

  return useMutation<Bike, Error, { id: string; data: Partial<Bike> }>({
    mutationFn: async ({ id, data }) => {
      return makeRequest<Bike>({
        method: 'PUT',
        url: `/bikes/${id}`,
        data,
      });
    },
    onSuccess: updatedBike => {
      // Update the bikes list cache
      queryClient.setQueryData<Bike[]>(['bikes'], oldBikes => {
        return (
          oldBikes?.map(bike =>
            bike.id === updatedBike.id ? updatedBike : bike
          ) || []
        );
      });

      // Update the specific bike cache
      queryClient.setQueryData(['bikes', updatedBike.id], updatedBike);
    },
  });
};

// Delete bike
export const useDeleteBike = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async id => {
      return makeRequest<void>({
        method: 'DELETE',
        url: `/bikes/${id}`,
      });
    },
    onSuccess: (_, deletedId) => {
      // Remove bike from bikes list cache
      queryClient.setQueryData<Bike[]>(['bikes'], oldBikes => {
        return oldBikes?.filter(bike => bike.id !== deletedId) || [];
      });

      // Remove the specific bike from cache
      queryClient.removeQueries({ queryKey: ['bikes', deletedId] });

      // Remove any components related to this bike
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
};
