import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { SelectOption } from '@/types/interfaces/Props'
import { useState } from 'react'
import { ClientsIcon } from '@/components/icons'
import { FilterModalProps, FilterOptions } from '@/types/interfaces/Props'

const TICKET_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'awaiting_client', label: 'Awaiting Client' },
  { value: 'resolved', label: 'Resolved' },
]

const TICKET_PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
]

export function FilterModalTickets({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)

  const handleStatusChange = (value: SelectOption) => {
    setFilters((prev) => ({ ...prev, status: value }))
  }

  const handlePriorityChange = (value: SelectOption) => {
    setFilters((prev) => ({ ...prev, priority: value }))
  }

  const handleHasActiveClientsChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, hasActiveClients: checked }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleCancel = () => {
    setFilters(initialFilters)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Tickets"
      className="w-[480px]"
    >
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            options={TICKET_STATUS_OPTIONS}
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <Select
            options={TICKET_PRIORITY_OPTIONS}
            value={filters.priority}
            onChange={handlePriorityChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={filters.hasActiveClients || false}
            onCheckedChange={handleHasActiveClientsChange}
            id="activeClients"
          />
          <label
            htmlFor="activeClients"
            className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
          >
            <ClientsIcon className="w-4 h-4 text-blue-500" />
            Has Active Clients
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 px-6 py-4 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </Dialog>
  )
}
