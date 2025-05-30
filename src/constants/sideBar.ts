import { NavItem } from '../types/interfaces/interface'
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

export const sideBar: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tickets', href: '/dashboard/tickets', icon: TicketIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UsersIcon  },
  { name: 'Products', href: '/dashboard/products', icon: CubeIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]
