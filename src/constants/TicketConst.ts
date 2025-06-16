import { SelectOption } from "@/types"

export const TICKET_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'awaiting_client', label: 'Awaiting Client' },
  { value: 'resolved', label: 'Resolved' },
]

export const TICKET_PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
]
