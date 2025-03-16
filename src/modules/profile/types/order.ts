export type OrderStatus = 'created' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: OrderStatus;
  total: number;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product: {
    id: string;
    name: string;
    thumbnail_path?: string;
  };
}
