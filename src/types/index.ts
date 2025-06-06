import { IconProps } from './interfaces/Props'

export type GoogleIconProps = IconProps
export type Size = 'sm' | 'md' | 'lg'
export type Status = 'open' | 'in-progress' | 'resolved' | 'closed'
export type StatusType = 'open' | 'in-progress' | 'resolved' | 'closed'

export * from './clients'

export interface ActionItem {
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface ActionMenuProps {
  items: ActionItem[]
}
