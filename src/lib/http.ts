import ky from 'ky'

/**
 * HTTP Client
 * 
 * Wrapper around ky for consistent API calls.
 * Used primarily for loading static JSON data from the public folder.
 * 
 * Configuration:
 * - Automatic JSON parsing
 * - Retry on failure (3 attempts)
 * - 30 second timeout
 */
export const httpClient = ky.create({
  prefixUrl: '',
  timeout: 30000,
  retry: {
    limit: 3,
    methods: ['get'],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add any global request modifications here
        console.log(`[HTTP] ${request.method} ${request.url}`)
      },
    ],
  },
})

/**
 * Fetch JSON data from public folder
 */
export async function fetchPublicData<T>(path: string): Promise<T> {
  return httpClient.get(path).json<T>()
}
