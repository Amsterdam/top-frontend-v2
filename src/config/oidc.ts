import { env } from "./env.ts"

export const oidcConfig = {
  authority:
    "https://login.microsoftonline.com/72fca1b1-2c2e-4376-a445-294d80196804",
  client_id: `${env.VITE_OIDC_CLIENT_ID}`,
  redirect_uri: `${env.VITE_OIDC_REDIRECT_URL}`,
  response_type: "code",
  scope: `openid email api://${env.VITE_OIDC_CLIENT_ID}/user_impersonation`,
  post_logout_redirect_uri: `${env.VITE_OIDC_REDIRECT_URL}`,
  metadata: {
    issuer:
      "https://login.microsoftonline.com/72fca1b1-2c2e-4376-a445-294d80196804/v2.0",
    authorization_endpoint:
      "https://login.microsoftonline.com/72fca1b1-2c2e-4376-a445-294d80196804/oauth2/v2.0/authorize",
    token_endpoint:
      "https://login.microsoftonline.com/72fca1b1-2c2e-4376-a445-294d80196804/oauth2/v2.0/token",
    end_session_endpoint:
      "https://login.microsoftonline.com/common/oauth2/v2.0/logout"
  }
}
