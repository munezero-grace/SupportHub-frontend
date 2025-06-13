import React from 'react'

import { FilterModalProps } from '@/types/interfaces/interface'

export const FilterPopup: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  fields,
  values,
  onChange,
  onApply,
  title = 'Filter',
}) => {
  if (!isOpen) return null

  const isFilterActive = fields.some(
    (field) => values[field.name] && values[field.name] !== ''
  )

  return (
    <div className="absolute top-100 right-10 bg-white rounded-lg shadow-lg p-5 border border-gray-200 z-50 w-full sm:w-[250px] transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-900 text-2xl"
        >
          &times;
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onApply()
        }}
      >
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {field.type === 'select' && field.options ? (
                <select
                  className="w-full border rounded px-2 py-1"
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                >
                  <option value="">All</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full border rounded px-2 py-1"
                  type={field.type || 'text'}
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6 min-h-[42px] items-center transition-all duration-200 w-full">
          {isFilterActive ? (
            <>
              <button
                type="button"
                onClick={() => {
                  fields.forEach((field) => onChange(field.name, ''))
                }}
                className="flex-1 rounded border bg-gray-200 hover:bg-gray-300 font-medium shadow-sm border-gray-300 px-4 py-1 transition-all duration-200"
              >
                Cancel
              </button>
              <div
                className="transition-opacity duration-200"
                style={{ minWidth: '110px' }}
              >
                <button
                  type="submit"
                  className="px-4 py-1 rounded border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-medium shadow-sm"
                >
                  Clear Filter
                </button>
              </div>
            </>
          ) : (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => {
                  fields.forEach((field) => onChange(field.name, ''))
                }}
                className="rounded border bg-gray-200 hover:bg-gray-300 font-medium shadow-sm border-gray-300 px-4 py-1 transition-all duration-200 w-1/2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}