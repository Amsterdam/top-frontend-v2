import { env } from "@/config/env"
import slashSandwich from "./slashSandwich"

/**
 * Utility function to create an API URL
 */
export const makeApiUrl = (...paths: Array<number | string | undefined>) =>
  slashSandwich([env.VITE_API_URL, ...paths.filter((p) => p !== undefined)])
