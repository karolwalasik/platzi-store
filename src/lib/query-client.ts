import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000, // 10 seconds 
      gcTime: 300000, // 5 min
      refetchOnWindowFocus: true, 
      refetchOnReconnect: true, 
      retry: 1, 
    },
    mutations: {
      retry: false, 
    },
  },
})

