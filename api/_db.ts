import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });

  return pool;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params);
}

let schemaReady: Promise<void> | null = null;

export function ensureReportOrdersTable() {
  schemaReady ??= query(`
    create table if not exists report_orders (
      id uuid primary key,
      stripe_checkout_session_id text unique,
      stripe_payment_intent_id text,
      status text not null default 'pending'
        check (status in ('pending', 'paid', 'delivered', 'failed')),
      payload jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      paid_at timestamptz,
      downloaded_at timestamptz
    );

    create index if not exists report_orders_checkout_session_idx
      on report_orders (stripe_checkout_session_id);

    create index if not exists report_orders_status_created_idx
      on report_orders (status, created_at desc);
  `).then(() => undefined);

  return schemaReady;
}
