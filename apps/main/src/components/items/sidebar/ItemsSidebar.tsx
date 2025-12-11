import { useState, useMemo, useEffect } from 'react'
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { FilterConfig } from './filterConfigs'
import SelectFilter from './filters/SelectFilter'
import CheckboxFilter from './filters/CheckboxFilter'
import RangeFilter from './filters/RangeFilter'

type FilterValue = string | string[] | { from: string; to: string } | null

interface ItemsSidebarProps {
  type: 'cartas' | 'numismatica'
  filters: Record<string, FilterValue>
  filterConfigs: FilterConfig[]
  onFilterChange: (key: string, value: FilterValue) => void
  onResetFilters: () => void
}

const ItemsSidebar = ({
  type,
  filters,
  filterConfigs,
  onFilterChange,
  onResetFilters
}: ItemsSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Start with all sections expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filterConfigs.map((config) => config.key))
  )

  // Close mobile drawer on filter change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'category') return // Skip category filter since it's fixed

      if (Array.isArray(value) && value.length > 0) {
        count++
      } else if (
        typeof value === 'object' &&
        value !== null &&
        'from' in value &&
        (value.from || value.to)
      ) {
        count++
      } else if (typeof value === 'string' && value.length > 0) {
        count++
      }
    })
    return count
  }, [filters])

  const categoryTitle = type === 'cartas' ? 'Cartas' : 'Numismática'

  const renderFilter = (config: FilterConfig) => {
    const isExpanded = expandedSections.has(config.key)

    return (
      <div
        key={config.key}
        className="border-b border-gray-200 last:border-b-0 dark:border-gray-700"
      >
        <button
          onClick={() => toggleSection(config.key)}
          className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {config.label}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isExpanded && (
          <div className="px-4 pb-4">
            {config.type === 'select' && config.options && (
              <SelectFilter
                label=""
                value={(filters[config.key] as string) || ''}
                options={config.options}
                onChange={(value) => onFilterChange(config.key, value)}
              />
            )}
            {config.type === 'checkbox' && config.options && (
              <CheckboxFilter
                label=""
                value={(filters[config.key] as string[]) || []}
                options={config.options}
                onChange={(value) => onFilterChange(config.key, value)}
              />
            )}
            {config.type === 'range' && (
              <RangeFilter
                label=""
                value={
                  (filters[config.key] as { from: string; to: string }) || {
                    from: '',
                    to: ''
                  }
                }
                onChange={(value) => onFilterChange(config.key, value)}
                prefix={config.prefix}
                suffix={config.suffix}
                fromLabel={config.fromLabel}
                toLabel={config.toLabel}
              />
            )}
            {config.type === 'badge' && config.options && (
              <CheckboxFilter
                label=""
                value={(filters[config.key] as string[]) || []}
                options={config.options}
                onChange={(value) => onFilterChange(config.key, value)}
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-2xl drop-shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 lg:hidden"
        style={{
          boxShadow:
            '0 10px 30px rgba(37, 99, 235, 0.4), 0 5px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <FunnelIcon className="h-5 w-5" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="box rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 z-40 min-h-screen w-80 overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-[73px]
          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filtros
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activeFilterCount}
                </span>
              )}
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {categoryTitle}
          </p>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                onResetFilters()
                setIsMobileOpen(false)
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filter Sections Container */}
        <div>{filterConfigs.map((config) => renderFilter(config))}</div>
      </aside>
    </>
  )
}

export default ItemsSidebar
