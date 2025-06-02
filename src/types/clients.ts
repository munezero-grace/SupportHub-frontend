export type SupportTier = 'standard' | 'premium'
export type ClientStatus = 'active' | 'inactive'

export interface Client {
  id: string
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
  clientProducts?: { 
    id: string;
    product?: {
      id: string;
      productCode: string;
      name: string;
      description?: string;
      status: 'active' | 'inactive';
    };
  }[];
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

export interface SelectOption {
  value: string
  label: string
}

export type FormData = {
  productId: string
  clientId: string
}
