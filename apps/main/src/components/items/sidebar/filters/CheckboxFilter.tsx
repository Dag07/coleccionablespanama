interface Option {
  value: string
  label: string
}

interface CheckboxFilterProps {
  label: string
  value: string[]
  options: Option[]
  onChange: (value: string[]) => void
}

const CheckboxFilter = ({
  label,
  value = [],
  options,
  onChange
}: CheckboxFilterProps) => {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="w-full">
      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default CheckboxFilter
