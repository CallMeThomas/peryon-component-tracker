import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../apiClient';
import { BikeComponent } from '../../types';

// Get all components (optionally filtered by bike)
export const useComponents = (bikeId?: string) => {
  return useQuery<BikeComponent[], Error>({
    queryKey: ['components', ...(bikeId ? [bikeId] : [])],
    queryFn: async () => {
      const queryParams = bikeId ? `?bikeId=${bikeId}` : '';
      return makeRequest<BikeComponent[]>({
        method: 'GET',
        url: `/components${queryParams}`,
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single component
export const useComponent = (id: string, enabled: boolean = true) => {
  return useQuery<BikeComponent, Error>({
    queryKey: ['components', 'detail', id],
    queryFn: async () => {
      return makeRequest<BikeComponent>({
        method: 'GET',
        url: `/components/${id}`,
      });
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Get components due for maintenance
export const useComponentsDue = () => {
  return useQuery<BikeComponent[], Error>({
    queryKey: ['components', 'due'],
    queryFn: async () => {
      return makeRequest<BikeComponent[]>({
        method: 'GET',
        url: '/components/due',
      });
    },
    staleTime: 1 * 60 * 1000, // 1 minute - refresh more frequently
  });
};

// Create component
export const useCreateComponent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BikeComponent, Error, Omit<BikeComponent, 'id'>>({
    mutationFn: async (componentData) => {
      return makeRequest<BikeComponent>({
        method: 'POST',
        url: '/components',
        data: componentData,
      });
    },
    onSuccess: (newComponent) => {
      // Update all components cache
      queryClient.setQueryData<BikeComponent[]>(['components'], (oldComponents) => {
        return oldComponents ? [...oldComponents, newComponent] : [newComponent];
      });
      
      // Update bike-specific components cache if applicable
      if (newComponent.bikeId) {
        queryClient.setQueryData<BikeComponent[]>(
          ['components', newComponent.bikeId], 
          (oldComponents) => {
            return oldComponents ? [...oldComponents, newComponent] : [newComponent];
          }
        );
      }
      
      // Invalidate queries to refetch from server
      queryClient.invalidateQueries({ queryKey: ['components'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] }); // Bikes might have updated component counts
    },
  });
};

// Update component
export const useUpdateComponent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BikeComponent, Error, { id: string; data: Partial<BikeComponent> }>({
    mutationFn: async ({ id, data }) => {
      return makeRequest<BikeComponent>({
        method: 'PUT',
        url: `/components/${id}`,
        data,
      });
    },
    onSuccess: (updatedComponent) => {
      // Update all components cache
      queryClient.setQueryData<BikeComponent[]>(['components'], (oldComponents) => {
        return oldComponents?.map((component) => 
          component.id === updatedComponent.id ? updatedComponent : component
        ) || [];
      });
      
      // Update bike-specific components cache
      if (updatedComponent.bikeId) {
        queryClient.setQueryData<BikeComponent[]>(
          ['components', updatedComponent.bikeId], 
          (oldComponents) => {
            return oldComponents?.map((component) => 
              component.id === updatedComponent.id ? updatedComponent : component
            ) || [];
          }
        );
      }
      
      // Update the specific component cache
      queryClient.setQueryData(['components', 'detail', updatedComponent.id], updatedComponent);
      
      // Invalidate due components as status might have changed
      queryClient.invalidateQueries({ queryKey: ['components', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
};

// Delete component
export const useDeleteComponent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      return makeRequest<void>({
        method: 'DELETE',
        url: `/components/${id}`,
      });
    },
    onSuccess: (_, deletedId) => {
      // Remove from all components cache
      queryClient.setQueryData<BikeComponent[]>(['components'], (oldComponents) => {
        return oldComponents?.filter((component) => component.id !== deletedId) || [];
      });
      
      // Remove from bike-specific caches (we don't know which bike, so invalidate all)
      queryClient.invalidateQueries({ queryKey: ['components'] });
      
      // Remove the specific component from cache
      queryClient.removeQueries({ queryKey: ['components', 'detail', deletedId] });
      
      // Invalidate bikes query as component counts might have changed
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
};

// Replace component (mark old as inactive, create new one)
export const useReplaceComponent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BikeComponent, Error, { 
    oldComponentId: string; 
    newComponentData: Omit<BikeComponent, 'id'> 
  }>({
    mutationFn: async ({ oldComponentId, newComponentData }) => {
      return makeRequest<BikeComponent>({
        method: 'POST',
        url: `/components/${oldComponentId}/replace`,
        data: newComponentData,
      });
    },
    onSuccess: () => {
      // Invalidate all component-related queries
      queryClient.invalidateQueries({ queryKey: ['components'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
  });
};