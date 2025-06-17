'use client'

import * as React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { FilterModalTicketsProps, SelectOption } from '@/types/interfaces/Props'
import { TICKET_PRIORITY_OPTIONS, TICKET_STATUS_OPTIONS } from '@/constants/ticketconfig'

export function FilterModalTickets({
  isOpen,
  onClose,
  onApply,
  initialFilters
}: FilterModalTicketsProps): React.ReactElement {
  const [filters, setFilters] = React.useState(initialFilters)
  const [isApplying, setIsApplying] = React.useState(false)
  const initialFocusRef = React.useRef<HTMLButtonElement>(null)

  const handleStatusChange = React.useCallback((option: SelectOption): void => {
    setFilters(prev => ({ ...prev, status: option }))
  }, [])

  const handlePriorityChange = React.useCallback((option: SelectOption): void => {
    setFilters(prev => ({ ...prev, priority: option }))
  }, [])

  const handleApply = React.useCallback(async (): Promise<void> => {
    try {
      setIsApplying(true)
      await onApply(filters)
      onClose()
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsApplying(false)
    }
  }, [filters, onApply, onClose])

  const handleReset = React.useCallback((): void => {
    const resetFilters = {
      status: TICKET_STATUS_OPTIONS[0],
      priority: TICKET_PRIORITY_OPTIONS[0]
    }
    setFilters(resetFilters)
    onApply(resetFilters)
  }, [onApply])

  const handleClose = React.useCallback((): void => {
    setFilters(initialFilters)
    onClose()
  }, [initialFilters, onClose])

  const handleSubmit = React.useCallback((e: React.FormEvent): void => {
    e.preventDefault()
    void handleApply()
  }, [handleApply])

  const filterChanged = React.useMemo(() => {
    return filters.status.value !== initialFilters.status.value ||
      filters.priority.value !== initialFilters.priority.value
  }, [filters, initialFilters])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Filter Tickets"
      className="max-w-md w-full"
      description="Filter tickets by status and priority."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-label="Filter tickets form"
      >
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <Select
              label="Status"
              value={filters.status}
              onChange={handleStatusChange}
              options={TICKET_STATUS_OPTIONS}
              className="w-full"
              aria-label="Filter by ticket status"
            />
          </div>

          <div className="space-y-1">
            <Select
              label="Priority"
              value={filters.priority}
              onChange={handlePriorityChange}
              options={TICKET_PRIORITY_OPTIONS}
              className="w-full"
              aria-label="Filter by ticket priority"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            ref={initialFocusRef}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!filterChanged || isApplying}
          >
            Reset
          </Button>
          <Button
            type="submit"
            loading={isApplying}
            disabled={!filterChanged || isApplying}
          >
            Apply Filters
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
