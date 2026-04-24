import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }

  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

export function getAppUrl() {
  const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
  return appUrl.replace(/\/$/, '');
}
