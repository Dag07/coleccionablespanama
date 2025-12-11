interface RangeValue {
  from: string
  to: string
}

interface RangeFilterProps {
  label: string
  value: RangeValue
  onChange: (value: RangeValue) => void
  fromLabel?: string
  toLabel?: string
  prefix?: string
  suffix?: string
  type?: 'number' | 'text'
}

const RangeFilter = ({
  label,
  value = { from: '', to: '' },
  onChange,
  fromLabel = 'Desde',
  toLabel = 'Hasta',
  prefix,
  suffix,
  type = 'number'
}: RangeFilterProps) => {
  const handleFromChange = (newFrom: string) => {
    onChange({ ...value, from: newFrom })
  }

  const handleToChange = (newTo: string) => {
    onChange({ ...value, to: newTo })
  }

  return (
    <div className="w-full">
      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
            {fromLabel}
          </label>
          <div className="relative">
            {prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                {prefix}
              </span>
            )}
            <input
              type={type}
              value={value.from}
              onChange={(e) => handleFromChange(e.target.value)}
              placeholder="0"
              className={`w-full rounded-lg border border-gray-300 bg-white py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
                prefix ? 'pl-7 pr-3' : 'px-3'
              } ${suffix ? 'pr-7' : ''}`}
            />
            {suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
            {toLabel}
          </label>
          <div className="relative">
            {prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                {prefix}
              </span>
            )}
            <input
              type={type}
              value={value.to}
              onChange={(e) => handleToChange(e.target.value)}
              placeholder=""
              className={`w-full rounded-lg border border-gray-300 bg-white py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
                prefix ? 'pl-7 pr-3' : 'px-3'
              } ${suffix ? 'pr-7' : ''}`}
            />
            {suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RangeFilter
