import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/solid'

export const statusConfig = {
  'open': {
    icon: ExclamationCircleIcon,
    text: 'Open',
    className: 'bg-yellow-50 text-yellow-700'
  },
  'in-progress': {
    icon: ClockIcon,
    text: 'In Progress',
    className: 'bg-blue-50 text-blue-700'
  },
  'resolved': {
    icon: CheckCircleIcon,
    text: 'Resolved',
    className: 'bg-green-50 text-green-700'
  },
  'closed': {
    icon: XCircleIcon,
    text: 'Closed',
    className: 'bg-gray-50 text-gray-700'
  }
}
