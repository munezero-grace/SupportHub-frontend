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

  return (
    <div className="absolute top-80 right-10 bg-white rounded-lg shadow-lg p-5 border border-gray-200 z-50 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-900">
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
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  )
}
