# Stripe Checkout Flow

## Runtime Requirements

- `STRIPE_SECRET_KEY`: Stripe test or live secret key. Server only.
- `STRIPE_WEBHOOK_SECRET`: signing secret for `/api/stripe-webhook`. Server only.
- `STRIPE_PRICE_ID`: one-time price for the premium report.
- `APP_URL`: public origin used in Checkout return URLs.
- `DATABASE_URL`: Neon/Postgres connection string.
- `VITE_STRIPE_PUBLISHABLE_KEY`: available for future client-side Stripe UI, not required by Hosted Checkout redirect.

## Flow

1. The user adds fiscal ranges and opens the report modal.
2. The client posts the report payload to `/api/create-checkout-session`.
3. The API validates the payload, stores it in `report_orders`, creates a Stripe Checkout Session, and returns the hosted Checkout URL.
4. Stripe redirects the user to `/payment-success?session_id=...`.
5. The user downloads from `/api/report?session_id=...`.
6. `/api/report` retrieves the Checkout Session from Stripe and only generates the PDF when `payment_status` is `paid`.

## Neon Setup

Run `docs/stripe-neon-schema.sql` before testing Checkout.

## Stripe Webhook

Configure a Stripe webhook endpoint:

```text
https://YOUR_DOMAIN/api/stripe-webhook
```

Listen for:

```text
checkout.session.completed
```

The download endpoint verifies payment directly with Stripe, so the webhook improves order state tracking but is not the only payment gate.
