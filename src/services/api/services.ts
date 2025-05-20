import { Stats, Ticket } from '@/types/interfaces/interface';
import axiosInstance from './axiosInstance';

export const ticketService = {
  getTickets: async (): Promise<Ticket[]> => {
    return [
      {
        id: 'T-1234',
        title: 'Dashboard not loading',
        client: 'Acme Corp',
        product: 'BP Analytics',
        status: 'New',
        priority: 'High',
        assignee: 'Sarah Johnson',
        created: '2h ago',
        lastUpdated: '2h ago'
      },
      {
        id: 'T-1235',
        title: 'Report export failing',
        client: 'TechStart Inc',
        product: 'BP CRM',
        status: 'In Progress',
        priority: 'Medium',
        assignee: 'Mike Chen',
        created: '3h ago',
        lastUpdated: '1h ago'
      },
      {
        id: 'T-1236',
        title: 'API integration issue',
        client: 'Global Systems',
        product: 'BP Ticket',
        status: 'Resolved',
        priority: 'Low',
        assignee: 'Alex Kim',
        created: '1d ago',
        lastUpdated: '4h ago'
      }
    ];
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await axiosInstance.get<Ticket>(`/api/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData: Omit<Ticket, 'id'>): Promise<Ticket> => {
    const response = await axiosInstance.post<Ticket>('/api/tickets', ticketData);
    return response.data;
  },

  updateTicket: async (id: string, ticketData: Partial<Ticket>): Promise<Ticket> => {
    const response = await axiosInstance.patch<Ticket>(`/api/tickets/${id}`, ticketData);
    return response.data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/tickets/${id}`);
  }
};

export const statsService = {
  getStats: async (): Promise<Stats[]> => {
    return [
      {
        name: 'Total Tickets',
        value: '127',
        change: '+5.2%',
        changeType: 'increase',
        info: 'from last month'
      },
      {
        name: 'Open Tickets',
        value: '42',
        change: '-2.5%',
        changeType: 'decrease',
        info: 'from last month'
      },
      {
        name: 'SLA Compliance',
        value: '94.3%',
        change: '+1.1%',
        changeType: 'increase',
        info: 'from last month'
      },
      {
        name: 'Avg. Response Time',
        value: '2.4h',
        change: '-0.3h',
        changeType: 'decrease',
        info: 'from last month'
      }
    ];
  }
};
