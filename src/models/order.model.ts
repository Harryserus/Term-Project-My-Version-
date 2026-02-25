export type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";
export interface OrderItem {
  gameId: string;
  title: string;
 thumbnailUrl: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
paymentMethod:string;
  status: OrderStatus;
  dateCreated:String; //string for now
}