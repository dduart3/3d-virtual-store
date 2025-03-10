import { loadStripe } from '@stripe/stripe-js';

// Initialize once and export for reuse
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
