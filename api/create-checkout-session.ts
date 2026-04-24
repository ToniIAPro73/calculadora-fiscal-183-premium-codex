import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { normalizeReportCheckoutPayload } from './_reportPayload.js';
import { ensureReportOrdersTable, query } from './_db.js';
import { getAppUrl, getStripe } from './_stripe.js';

function getRequestBody(request: VercelRequest) {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body);
  }

  return request.body;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return response.status(500).json({ error: 'STRIPE_PRICE_ID is not configured.' });
    }

    const payload = normalizeReportCheckoutPayload(getRequestBody(request));
    const reportId = randomUUID();
    const appUrl = getAppUrl(request);
    const stripe = getStripe();

    await ensureReportOrdersTable();

    await query(
      `insert into report_orders (id, status, payload)
       values ($1, 'pending', $2::jsonb)`,
      [reportId, JSON.stringify(payload)],
    );

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      customer_email: payload.email,
      client_reference_id: reportId,
      metadata: {
        report_order_id: reportId,
        fiscal_year: String(payload.fiscalYear),
        document_language: payload.language,
      },
      success_url: `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
    });

    await query(
      `update report_orders
       set stripe_checkout_session_id = $1, updated_at = now()
       where id = $2`,
      [session.id, reportId],
    );

    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error('create_checkout_session_failed', error);
    const message = error instanceof Error ? error.message : 'Unable to create checkout session.';
    return response.status(400).json({ error: message });
  }
}
