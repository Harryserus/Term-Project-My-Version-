import { OrderItem } from "./order.model";

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  cart: OrderItem[];
  //avatar?: string;
}
