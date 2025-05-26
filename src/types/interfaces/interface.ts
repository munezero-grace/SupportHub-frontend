
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

export interface Stats {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  info: string;
}

export interface Ticket {
  id: string;
  title: string;
  client: string;
  product: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  created: string;
  lastUpdated: string;
}

export interface Settings {
  fullName: string;
  email: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  provider?: string | null;
  providerId?: string | null;
  role?: string | null;
}
