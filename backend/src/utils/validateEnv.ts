const REQUIRED_ENV_VARS = ['PORT', 'DIRECTUS_URL', 'DIRECTUS_ADMIN_TOKEN'] as const

export function validateEnv(): void {
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      throw new Error(`Missing required env var: ${varName}`)
    }
  }
}
