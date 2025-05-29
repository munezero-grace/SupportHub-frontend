import { Session, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
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
  provider?: string;
  providerId?: string;
  role?: string | null;
}
export interface UserWithId extends User {
  id: string;
  role?: string;
}

export interface SessionWithId extends Session {
  user: UserWithId;
}

export interface ExtendedToken extends JWT {
  id?: string;
  role?: string;
}

export interface GoogleProfile extends Profile {
  given_name?: string;
  family_name?: string;
  sub?: string;
  picture?: string;
  role?: string;
}
