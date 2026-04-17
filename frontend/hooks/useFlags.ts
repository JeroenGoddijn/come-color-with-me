import { useFlagsContext } from '@/context/FlagsContext'
import type { FeatureFlags } from '@/types/flags'

export function useFlags(): FeatureFlags {
  return useFlagsContext()
}

export function useFlag(flag: keyof FeatureFlags): boolean {
  const flags = useFlagsContext()
  return flags[flag]
}
