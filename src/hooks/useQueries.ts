import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketService, statsService } from '@/services/api/services';
import { Stats, Ticket } from "@/types/interfaces/interface";

export const queryKeys = {
  dashboardStats: ["dashboardStats"] as const,
  tickets: ["tickets"] as const,
  clients: ["clients"] as const,
  products: ["products"] as const,
};

export function useDashboardStatsQuery() {
  return useQuery<Stats[], Error>({
    queryKey: queryKeys.dashboardStats,
    queryFn: statsService.getStats,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });
}

export function useTicketsQuery() {
  return useQuery<Ticket[], Error>({
    queryKey: queryKeys.tickets,
    queryFn: ticketService.getTickets,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });
}

export function useTicketQuery(id: string) {
  return useQuery<Ticket, Error>({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicketById(id),
    enabled: !!id,
  });
}

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

  return useMutation<Ticket, Error, CreateTicketData>({
    mutationFn: (data: CreateTicketData) => ticketService.createTicket({
      ...data,
      status: 'New',
      assignee: 'Unassigned',
      created: new Date().toISOString(),
      lastUpdated: 'just now',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
};

export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, UpdateTicketData>({
    mutationFn: ({ id, changes }: UpdateTicketData) => 
      ticketService.updateTicket(id, changes),
    onSuccess: (data) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(ticket => 
          ticket.id === data.id ? { ...ticket, ...data } : ticket
        );
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
};

export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: ticketService.deleteTicket,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(ticket => ticket.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
};
