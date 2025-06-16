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
    <div className={cn('w-full', className)}>
      <div className="inline-block w-full align-middle">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-300">
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
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[role="menu"]') || target.closest('button')) {
                      return;
                    }
                    onRowClick?.(item);
                  }}
                >
                  {columns.map((column, index) => {
                    const content = typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : item[column.accessor as keyof T]

                    return (
                      <td
                        key={index}
                        className={cn(
                          'py-4 px-3 text-sm text-gray-900 overflow-hidden',
                          column.className
                        )}
                      >
                        <div className="truncate w-full">
                          {content as ReactNode}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}