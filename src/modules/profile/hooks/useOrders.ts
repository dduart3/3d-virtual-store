import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Order, OrderWithItems } from '../types/order';
import { getProductThumbnailUrl } from '../../experience/store/utils/supabaseStorageUtils';
import { useAuth } from '../../auth/hooks/useAuth';

export function useOrders() {
  const { user } = useAuth(); // Get the current authenticated user
  
  return useQuery({
    queryKey: ['orders', user?.id], // Include user ID in the query key for proper cache invalidation
    queryFn: async (): Promise<Order[]> => {
      // If no user is authenticated, return an empty array
      if (!user) return [];
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id) // Filter orders by the current user's ID
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      return orders || [];
    },
    // Only run the query if we have a user
    enabled: !!user
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
            name
          )
        `)
        .eq('order_id', orderId);
        
        if (itemsError) {
          throw new Error(`Error cargando los productos de la compra: ${itemsError.message}`);
        }

        const itemsWithThumbnails = items?.map((item) => {
          return {
            ...item,
            product: {
              ...item.product,
              thumbnail_url: getProductThumbnailUrl(item.product.id)
            }
          };
        });
      
      return {
        ...order,
        items: itemsWithThumbnails || []
      };
    },
    enabled: !!orderId
  });
}
