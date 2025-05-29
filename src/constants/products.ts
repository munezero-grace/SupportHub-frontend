export const products = [
  {
    id: 'P-1001',
    name: 'BP Ticket',
    description: 'Support ticket management platform with Google Sign-In, Slack and ClickUp integration',
    activeClients: 3,
    developers: 2,
    activeTickets: 8,
    openTickets: 5,
    slaCompliance: '98%',
    status: 'Active' as const,
    lastUpdated: '2024-05-15'
  },
  {
    id: 'P-1002',
    name: 'BP CRM',
    description: 'Customer relationship management system for tracking client interactions',
    activeClients: 3,
    developers: 3,
    activeTickets: 5,
    openTickets: 3,
    slaCompliance: '95%',
    status: 'Active' as const,
    lastUpdated: '2024-05-14'
  },
  {
    id: 'P-1003',
    name: 'BP Analytics',
    description: 'Data visualization and analytics platform for business intelligence',
    activeClients: 3,
    developers: 2,
    activeTickets: 3,
    openTickets: 2,
    slaCompliance: '97%',
    status: 'Active' as const,
    lastUpdated: '2024-05-13'
  },
  {
    id: 'P-1004',
    name: 'BP Inventory',
    description: 'Inventory management system for tracking stock and orders',
    activeClients: 0,
    developers: 1,
    activeTickets: 0,
    openTickets: 0,
    slaCompliance: 'N/A',
    status: 'Inactive' as const,
    lastUpdated: '2024-05-12'
  }
] as const;
