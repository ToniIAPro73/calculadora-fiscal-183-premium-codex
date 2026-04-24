import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'node:stream/consumers';
import { query } from './_db.js';
import { getStripe } from './_stripe.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return response.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET is not configured.' });
  }

  const signature = request.headers['stripe-signature'];
  if (!signature || Array.isArray(signature)) {
    return response.status(400).json({ error: 'Missing Stripe signature.' });
  }

  try {
    const rawBody = await buffer(request);
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (session.client_reference_id && session.payment_status === 'paid') {
        await query(
          `update report_orders
           set status = 'paid',
               stripe_payment_intent_id = $1,
               paid_at = coalesce(paid_at, now()),
               updated_at = now()
           where id = $2`,
          [typeof session.payment_intent === 'string' ? session.payment_intent : null, session.client_reference_id],
        );
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('stripe_webhook_failed', error);
    const message = error instanceof Error ? error.message : 'Webhook processing failed.';
    return response.status(400).json({ error: message });
  }
}
