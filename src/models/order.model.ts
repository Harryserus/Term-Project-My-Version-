export type OrderStatus = "pending" | "paid" | "cancelled";
export interface OrderItem {
  gameId: string;
  title: string;
 thumbnailUrl: string;
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