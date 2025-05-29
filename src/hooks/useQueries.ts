import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats, getRecentTickets, pingBackend } from "@/lib/api";
import { PingResponse, Stats, Ticket } from "@/types/interfaces/interface";

// Query key constants
export const queryKeys = {
  ping: ["ping"],
  dashboardStats: ["dashboardStats"],
  recentTickets: ["recentTickets"],
  tickets: ["tickets"],
  clients: ["clients"],
  products: ["products"],
} as const;

export function usePingQuery() {
  return useQuery<PingResponse | null>({
    queryKey: queryKeys.ping,
    queryFn: pingBackend,
  });
}

export function useDashboardStatsQuery() {
  return useQuery<Stats[]>({
    queryKey: queryKeys.dashboardStats,
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useRecentTicketsQuery() {
  return useQuery<Ticket[]>({
    queryKey: queryKeys.recentTickets,
    queryFn: getRecentTickets,
    staleTime: 30 * 1000, 
  });
}

// Mutation Hooks
interface CreateTicketData {
  title: string;
  client: string;
  product: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface UpdateTicketData {
  id: string;
  changes: Partial<Ticket>;
}

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTicket: Ticket = {
        id: `T-${Math.floor(Math.random() * 10000)}`,
        ...data,
        status: 'New',
        assignee: 'Unassigned',
        created: new Date().toISOString(),
        lastUpdated: 'just now',
      };
      return newTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets });
    },
  });
};

export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, changes }: UpdateTicketData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, ...changes };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(ticket => 
          ticket.id === data.id ? { ...ticket, ...data } : ticket
        );
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets });
    },
  });
};

export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(ticket => ticket.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets });
    },
  });
};
