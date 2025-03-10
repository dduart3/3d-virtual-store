import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { CartItem } from '../types/cart'; // You'll need to import your cart types

interface CreateOrderParams {
  cart_items: CartItem[];
  payment_intent_id: string;
  total: number;
  shipping_address?: Record<string, any>;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (params: CreateOrderParams) => {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: params
      });
      
      if (error) throw error;
      return data;
    }
  });
}
