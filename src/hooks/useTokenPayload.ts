import { useAuth } from "react-oidc-context"
import { jwtDecode } from "jwt-decode"

export type DecodedToken = {
  given_name: string
  family_name: string
  name: string
  unique_name: string
  [key: string]: number | string | string[]
}

export const useTokenPayload = (): DecodedToken | undefined => {
  const { user } = useAuth()
  const token = user?.access_token

  if (!token) return

  return jwtDecode<DecodedToken>(token)
}
