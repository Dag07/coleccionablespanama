import { ReactNode } from 'react'
import ItemsSidebar from './sidebar/ItemsSidebar'
import { FilterConfig } from './sidebar/filterConfigs'

type FilterValue = string | string[] | { from: string; to: string } | null

interface ItemsListingLayoutProps {
  type: 'cartas' | 'numismatica'
  filters: Record<string, FilterValue>
  filterConfigs: FilterConfig[]
  onFilterChange: (key: string, value: FilterValue) => void
  onResetFilters: () => void
  children: ReactNode
}

const ItemsListingLayout = ({
  type,
  filters,
  filterConfigs,
  onFilterChange,
  onResetFilters,
  children
}: ItemsListingLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ItemsSidebar
        type={type}
        filters={filters}
        filterConfigs={filterConfigs}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />

      {/* Main content area */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default ItemsListingLayout
