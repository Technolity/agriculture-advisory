import { QueryClient, QueryCache } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('[Query Error]', {
        queryKey: query.queryKey,
        message: error instanceof Error ? error.message : String(error),
      })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      onError: (error: unknown) => {
        console.error('[Mutation Error]', {
          message: error instanceof Error ? error.message : String(error),
        })
      },
    },
  },
})
