// src/types/api.d.ts
import type * as ApiSchema from "@/__generated__/apiSchema"

declare global {
  type components = ApiSchema.components
}
