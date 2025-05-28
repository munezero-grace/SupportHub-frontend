import type { User } from "next-auth";

export interface ExtendedUser extends User {
  firstName?: string;
  lastName?: string;
  provider?: string;
  providerId?: string;
}
