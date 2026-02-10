import { env } from "@/config/env"

/**
 * Check if the current environment is ACC (acceptance) or LOCAL.
 * @returns {boolean} True if the environment is ACC or LOCAL, otherwise false.
 */
export const isAcceptanceOrLocalEnvironment = (): boolean => {
  return (
    env.VITE_ENVIRONMENT_SHORT === "ACC" ||
    env.VITE_ENVIRONMENT_SHORT === "LOCAL"
  )
}
