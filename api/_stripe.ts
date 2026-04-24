import type { VercelRequest } from '@vercel/node';
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }

  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

export function getAppUrl(request?: VercelRequest) {
  const forwardedHost = request?.headers['x-forwarded-host'] ?? request?.headers.host;
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
  const forwardedProto = request?.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;

  if (host) {
    return `${protocol || 'https'}://${host}`.replace(/\/$/, '');
  }

  const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
  return appUrl.replace(/\/$/, '');
}
