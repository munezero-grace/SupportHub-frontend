import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { clientsApi } from '../services/clients'
import { Client, CreateClientDto, UpdateClientDto } from '../types/clients'
import { AxiosError } from 'axios'

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
}

export const useClients = (options?: UseQueryOptions<Client[], AxiosError>) => {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => clientsApi.getAll(),
    ...options,
  })
}

export const useClient = (
  clientCode: string,
  options?: UseQueryOptions<Client, AxiosError>
) => {
  return useQuery({
    queryKey: clientKeys.detail(clientCode),
    queryFn: () => clientsApi.getById(clientCode),
    ...options,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newClient: CreateClientDto) => clientsApi.create(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      clientCode,
      data,
    }: {
      clientCode: string
      data: UpdateClientDto
    }) => clientsApi.update(clientCode, data),
    onSuccess: (_, { clientCode }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientCode) })
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientCode: string) => clientsApi.delete(clientCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}
