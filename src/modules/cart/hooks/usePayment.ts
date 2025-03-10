import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Stripe, StripeElements, PaymentIntent } from '@stripe/stripe-js';

interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
}

// Interface for the response from creating a payment intent
interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
  [key: string]: any;
}

interface ConfirmPaymentParams {
  stripe: Stripe;
  elements: StripeElements;
}

// Hook for creating a payment intent
export function useCreatePaymentIntent() {
  return useMutation<PaymentIntentResponse, Error, CreatePaymentIntentParams>({
    mutationFn: async ({ amount, currency = 'usd' }: CreatePaymentIntentParams) => {
      
      console.log('Calling create-payment-intent with:', { amount, currency });
      
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, currency }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create payment intent');
      }
      
      // Validate the response
      if (!data || !data.clientSecret) {
        console.error('Invalid response from create-payment-intent:', data);
        throw new Error('Invalid response from payment service');
      }
      
      return data;
    }
  });
}

// Hook for confirming payment - using PaymentIntent directly from Stripe
export function useConfirmPayment() {
  return useMutation<PaymentIntent, Error, ConfirmPaymentParams>({
    mutationFn: async ({ stripe, elements }: ConfirmPaymentParams) => {
      if (!stripe || !elements) {
        throw new Error('Stripe has not been properly initialized');
      }
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      
      if (error) {
        console.error('Payment confirmation error:', error);
        throw new Error(error.message || 'Payment confirmation failed');
      }
      
      if (!paymentIntent) {
        throw new Error('No payment intent returned from Stripe');
      }
      
      return paymentIntent;
    }
  });
}
