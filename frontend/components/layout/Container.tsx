import { cn } from '@/utils/cn'

type Props = {
  className?: string
  children: React.ReactNode
  as?: React.ElementType
}

export function Container({ className, children, as: Tag = 'div' }: Props) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  )
}
