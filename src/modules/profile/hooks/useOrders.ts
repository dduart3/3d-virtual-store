import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Order, OrderWithItems } from '../types/order';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      return orders || [];
    }
  });
}

export function useOrderWithItems(orderId: string | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<OrderWithItems | null> => {
      if (!orderId) return null;
      
      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) {
        throw new Error(`Error fetching order: ${orderError.message}`);
      }
      
      if (!order) return null;
      
      // Fetch order items with product information
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:product_id (
            id,
            name,
            thumbnail_path
          )
        `)
        .eq('order_id', orderId);
      
      if (itemsError) {
        throw new Error(`Error fetching order items: ${itemsError.message}`);
      }
      
      return {
        ...order,
        items: items || []
      };
    },
    enabled: !!orderId
  });
}
