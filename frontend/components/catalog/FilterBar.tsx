'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/utils/cn'

type FilterOption = { label: string; value: string }

type Props = {
  typeOptions?:     FilterOption[]
  categoryOptions?: FilterOption[]
  ageOptions?:      FilterOption[]
  sortOptions?:     FilterOption[]
  /** Which filter chips to show. Defaults to all. */
  show?: ('type' | 'category' | 'age' | 'sort')[]
}

const DEFAULT_TYPES: FilterOption[] = [
  { label: 'All',            value: '' },
  { label: '🖍 Coloring',   value: 'coloring_page' },
  { label: '✨ Artwork',     value: 'finished_artwork' },
]

const DEFAULT_CATS: FilterOption[] = [
  { label: 'All',       value: '' },
  { label: 'Animals',   value: 'animals' },
  { label: 'Fantasy',   value: 'fantasy' },
  { label: 'Food',      value: 'food' },
  { label: 'Holidays',  value: 'holidays' },
  { label: 'Cards',     value: 'cards' },
  { label: 'Buildings', value: 'buildings' },
]

const DEFAULT_AGES: FilterOption[] = [
  { label: 'All Ages', value: '' },
  { label: '3–5',      value: '3-5' },
  { label: '6–8',      value: '6-8' },
  { label: '9+',       value: '9+' },
]

const DEFAULT_SORT: FilterOption[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'A → Z',        value: 'title_asc' },
  { label: 'Z → A',        value: 'title_desc' },
]

function ChipGroup({
  label,
  options,
  param,
  current,
  onChange,
}: {
  label: string
  options: FilterOption[]
  param: string
  current: string
  onChange: (param: string, value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-nunito font-semibold text-[#8B7BA8] uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(param, opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-nunito font-semibold transition-all',
            current === opt.value
              ? 'bg-[#9B6FD4] text-white shadow-sm'
              : 'bg-white border border-[#C4B5FD]/60 text-[#9B6FD4] hover:border-[#9B6FD4]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function FilterBar({
  typeOptions     = DEFAULT_TYPES,
  categoryOptions = DEFAULT_CATS,
  ageOptions      = DEFAULT_AGES,
  sortOptions     = DEFAULT_SORT,
  show            = ['type', 'category', 'age', 'sort'],
}: Props) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const current = {
    type:     searchParams.get('type')     ?? '',
    category: searchParams.get('category') ?? '',
    age:      searchParams.get('age')      ?? '',
    sort:     searchParams.get('sort')     ?? 'newest',
  }

  const handleChange = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(param, value)
      } else {
        params.delete(param)
      }
      params.delete('page') // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const hasFilters = current.type || current.category || current.age ||
    (current.sort && current.sort !== 'newest')

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-[#C4B5FD]/30 rounded-[20px] p-5 flex flex-col gap-4">
      {show.includes('type') && (
        <ChipGroup label="Type" options={typeOptions} param="type"
          current={current.type} onChange={handleChange} />
      )}
      {show.includes('category') && (
        <ChipGroup label="Category" options={categoryOptions} param="category"
          current={current.category} onChange={handleChange} />
      )}
      {show.includes('age') && (
        <ChipGroup label="Age" options={ageOptions} param="age"
          current={current.age} onChange={handleChange} />
      )}
      {show.includes('sort') && (
        <ChipGroup label="Sort" options={sortOptions} param="sort"
          current={current.sort} onChange={handleChange} />
      )}
      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="self-start text-xs font-nunito font-semibold text-[#8B7BA8] hover:text-[#F472B6] transition-colors underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
