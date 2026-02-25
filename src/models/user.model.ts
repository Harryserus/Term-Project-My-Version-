export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  //avatar?: string;
}
