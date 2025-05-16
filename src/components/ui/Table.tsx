import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TableProps } from '@/types/interfaces/Props'

export function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  className,
  emptyState,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyState || (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  'py-3.5 px-3 text-left text-sm font-semibold text-gray-900',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              className={cn(
                'hover:bg-gray-50',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={cn(
                    'whitespace-nowrap py-4 px-3 text-sm text-gray-500',
                    column.className
                  )}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
