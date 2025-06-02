import { ReactNode, FormEvent, ButtonHTMLAttributes, InputHTMLAttributes} from "react"
import { Size, StatusType } from '@/types/index'
import { Client } from '@/types/clients'
import { Product } from '@/types/interfaces/product'

export interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  className?: string
  disabled?: boolean
}

export interface FormFieldProps {
  label?: string
  error?: string
  children: ReactNode
  className?: string
  required?: boolean
  helpText?: string
}

export interface FormActionsProps {
  children: ReactNode
  className?: string
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export interface CardProps {
  children: ReactNode
  className?: string
}

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export interface IconBaseProps {
  className?: string;
  size?: number;
  color?: string;
}

export interface IconProps extends IconBaseProps {
  'aria-hidden'?: boolean;
  role?: string;
}

export interface LoadingSpinnerProps {
  size?: Size;
  color?: 'primary' | 'secondary' | 'white';
}

export interface SearchComboboxProps {
  options: ComboboxOption[]
  value: ComboboxOption | null
  onChange: (value: ComboboxOption | null) => void
  label?: string
  placeholder?: string
  error?: string
  className?: string
}

export interface ComboboxOption<T = unknown> {
  id: string | number
  label: string
  value: T
}

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps {
  value: SelectOption
  onChange: (value: SelectOption) => void
  options: SelectOption[]
  label?: string
  error?: string
  className?: string
}

export interface StatusProps {
  type: StatusType
  className?: string
}

export interface TableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
  }[]
  onRowClick?: (item: T) => void
  className?: string
  emptyState?: ReactNode
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface ClientSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectClient: (client: Client) => void
  selectedClientIds: string[]
}

export interface ProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onRemoveProduct: (product: Product) => void
  selectedProductIds: string[]
  clientId: string
}
