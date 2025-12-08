import slashSandwich from "./slashSandwich"

/**
 * Utility function to create an API URL
 */
export const makeApiUrl = (...paths: Array<number | string | undefined>) =>
  slashSandwich([import.meta.env.VITE_API_URL, ...paths])
