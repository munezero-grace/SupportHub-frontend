import { Client } from '../types/clients'

export const mockClients: Client[] = [
  {
    id: 'C-1001',
    name: 'Acme Corp',
    contact: {
      name: 'John Smith',
      email: 'john@acmecorp.com',
    },
    products: ['BP CRM', 'BP Analytics'],
    supportTier: 'Premium',
    activeTickets: 5,
    status: 'Active',
  },
  {
    id: 'C-1002',
    name: 'Globex Inc',
    contact: {
      name: 'Jane Doe',
      email: 'jane@globexinc.com',
    },
    products: ['BP Ticket', 'BP Analytics'],
    supportTier: 'Standard',
    activeTickets: 2,
    status: 'Active',
  },
  {
    id: 'C-1003',
    name: 'Stark Industries',
    contact: {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
    },
    products: ['BP CRM'],
    supportTier: 'Premium',
    activeTickets: 3,
    status: 'Active',
  },
  {
    id: 'C-1004',
    name: 'Wayne Enterprises',
    contact: {
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
    },
    products: ['BP Ticket', 'BP CRM', 'BP Analytics'],
    supportTier: 'Premium',
    activeTickets: 1,
    status: 'Active',
  },
  {
    id: 'C-1005',
    name: 'Umbrella Corp',
    contact: {
      name: 'Albert Wesker',
      email: 'wesker@umbrellacorp.com',
    },
    products: ['BP CRM'],
    supportTier: 'Standard',
    activeTickets: 0,
    status: 'Inactive',
  },
  {
    id: 'C-1006',
    name: 'Cyberdyne Systems',
    contact: {
      name: 'Miles Dyson',
      email: 'miles@cyberdyne.com',
    },
    products: ['BP Analytics'],
    supportTier: 'Standard',
    activeTickets: 0,
    status: 'Inactive',
  },
]
