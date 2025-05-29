export interface Client {
  id: string
  name: string
  contact: {
    name: string
    email: string
  }
  products: string[]
  supportTier: 'Premium' | 'Standard'
  activeTickets: number
  status: 'active' | 'inactive'
}
