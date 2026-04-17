import { cn } from '@/utils/cn'

type Variant = 'purple' | 'pink' | 'green' | 'yellow' | 'gray'

type Props = {
  variant?: Variant
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  purple: 'bg-[#C4B5FD]/30 text-[#9B6FD4]',
  pink:   'bg-[#F472B6]/20 text-[#db2777]',
  green:  'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  gray:   'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'purple', className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-nunito font-700 tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
