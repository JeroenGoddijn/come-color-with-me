/**
 * Validates that required environment variables are present.
 * Throws an error if any required variable is missing.
 * Call from app/layout.tsx to catch misconfiguration early.
 */
export function validateEnv(): void {
  const required: string[] = [
    'NEXT_PUBLIC_API_URL',
  ]

  const missing = required.filter(
    (key) => !process.env[key]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Copy .env.local.example to .env.local and fill in real values.`
    )
  }
}
