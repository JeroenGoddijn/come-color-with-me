import { useFlag } from '@/hooks/useFlags'
import type { FeatureFlags } from '@/types/flags'

type Props = {
  flag: keyof FeatureFlags
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FlagGate({ flag, children, fallback = null }: Props) {
  const enabled = useFlag(flag)
  return enabled ? <>{children}</> : <>{fallback}</>
}
