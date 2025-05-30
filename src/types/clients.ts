export type SupportTier = 'standard' | 'premium'
export type ClientStatus = 'active' | 'inactive'

export interface Client {
  id: number
  clientCode: string
  name: string
  contactName: string
  companyName: string
  products: string[]
  supportTier: SupportTier
  activeTickets: number
  status: ClientStatus
  createdAt: string
  updatedAt: string
  user: User
  userId?: string
}

export interface User {
  email: string
  firstName:string
  lastName:string
}

export interface CreateClientDto {
  companyName: string
  contactName: string
  contactEmail: string
  supportTier?: SupportTier
  status?: ClientStatus
  userId?: string
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  activeTickets?: number
}
