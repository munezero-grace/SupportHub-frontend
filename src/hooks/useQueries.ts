import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDashboardStats, getRecentTickets, pingBackend } from '@/lib/api'
import { PingResponse, Stats, Ticket } from '@/types/interfaces/interface'
import { ticketService } from '../services/services'
import { clientsApi } from '../services'
import type { Client, CreateClientDto, UpdateClientDto } from '../types/clients'

export const queryKeys = {
  ping: ['ping'],
  dashboardStats: ['dashboardStats'],
  recentTickets: ['recentTickets'],
  tickets: ['tickets'],
  clients: ['clients'],
  products: ['products'],
} as const

export function usePingQuery() {
  return useQuery<PingResponse | null>({
    queryKey: queryKeys.ping,
    queryFn: pingBackend,
  })
}

export function useDashboardStatsQuery() {
  return useQuery<Stats[]>({
    queryKey: queryKeys.dashboardStats,
    queryFn: getDashboardStats,

    staleTime: 5 * 60 * 1000,
  })
}

export function useRecentTicketsQuery() {
  return useQuery<Ticket[]>({
    queryKey: queryKeys.recentTickets,
    queryFn: getRecentTickets,
    staleTime: 30 * 1000,
  })
}

export function useTicketsQuery() {
  return useQuery<Ticket[], Error>({
    queryKey: queryKeys.tickets,
    queryFn: ticketService.getTickets,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useTicketQuery(id: string) {
  return useQuery<Ticket, Error>({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicketById(id),
    enabled: !!id,
  })
}

interface CreateTicketData {
  title: string
  client: string
  product: string
  priority: 'High' | 'Medium' | 'Low'
}

interface UpdateTicketData {
  id: string
  changes: Partial<Ticket>
}

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newTicket: Ticket = {
        id: `T-${Math.floor(Math.random() * 10000)}`,
        ...data,
        status: 'New',
        assignee: 'Unassigned',
        created: new Date().toISOString(),
        lastUpdated: 'just now',
      }
      return newTicket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets })
    },
  })
}

export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, changes }: UpdateTicketData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, ...changes }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData
        return oldData.map((ticket) =>
          ticket.id === data.id ? { ...ticket, ...data } : ticket
        )
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets })
    },
  })
}

export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Ticket[]>(queryKeys.tickets, (oldData) => {
        if (!oldData) return oldData
        return oldData.filter((ticket) => ticket.id !== deletedId)
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentTickets })
    },
  })
}

export function useClientsQuery() {
  return useQuery<Client[], Error>({
    queryKey: queryKeys.clients,
    queryFn: clientsApi.getAll,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
  })
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient()

  return useMutation<Client, Error, CreateClientDto>({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
    },
  })
}

export function useUpdateClientMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    Client,
    Error,
    { clientCode: string; data: UpdateClientDto }
  >({
    mutationFn: ({ clientCode, data }) => clientsApi.update(clientCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
    },
  })
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
    },
  })
}
