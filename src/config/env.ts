type RuntimeEnv = Record<string, string | number>

declare global {
  interface Window {
    env?: RuntimeEnv
  }
}

const runtime = window.env ?? {}

export const env: RuntimeEnv = {
  ...import.meta.env,
  ...runtime
}
