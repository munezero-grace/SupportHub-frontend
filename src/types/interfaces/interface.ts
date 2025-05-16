
export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface Settings {
  fullName: string
  email: string
  emailNotifications: boolean
  slackNotifications: boolean
}

export interface PingResponse {
  message: string;
}
