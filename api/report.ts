import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateTaxReport } from '../src/lib/generatePdf';
import { normalizeReportCheckoutPayload, type ReportCheckoutPayload } from '../src/lib/reportPayload';
import { query } from './_db';
import { getStripe } from './_stripe';

type ReportOrderRow = {
  id: string;
  payload: ReportCheckoutPayload;
  stripe_checkout_session_id: string;
};

function getSessionId(request: VercelRequest) {
  const value = request.query.session_id;
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const sessionId = getSessionId(request);
    if (!sessionId) {
      return response.status(400).json({ error: 'Missing checkout session id.' });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return response.status(402).json({ error: 'Payment has not been confirmed.' });
    }

    const result = await query<ReportOrderRow>(
      `select id, payload, stripe_checkout_session_id
       from report_orders
       where stripe_checkout_session_id = $1
       limit 1`,
      [session.id],
    );
    const order = result.rows[0];

    if (!order) {
      return response.status(404).json({ error: 'Paid report order was not found.' });
    }

    const payload = normalizeReportCheckoutPayload(order.payload);
    const doc = await generateTaxReport({
      name: payload.name,
      email: payload.email,
      taxId: payload.taxId,
      documentType: payload.documentType,
      ranges: payload.ranges.map((range) => ({ start: range.start, end: range.end })),
      fiscalYear: payload.fiscalYear,
      language: payload.language,
    });
    const pdf = Buffer.from(doc.output('arraybuffer'));

    await query(
      `update report_orders
       set status = 'delivered', downloaded_at = now(), updated_at = now()
       where id = $1`,
      [order.id],
    );

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Length', String(pdf.byteLength));
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="fiscal-183-report-${payload.fiscalYear}-${new Date().toISOString().slice(0, 10)}.pdf"`,
    );
    return response.status(200).send(pdf);
  } catch (error) {
    console.error('paid_report_generation_failed', error);
    const message = error instanceof Error ? error.message : 'Unable to generate paid report.';
    return response.status(500).json({ error: message });
  }
}
