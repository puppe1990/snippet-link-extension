const { createClient } = require("@libsql/client/web");
const Stripe = require("stripe");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function getHeader(headers, name) {
  if (!headers) return "";
  const direct = headers[name];
  if (direct) return String(direct);
  const lower = headers[name.toLowerCase()];
  if (lower) return String(lower);
  return "";
}

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

async function ensureSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  const columnsRs = await db.execute(`PRAGMA table_info(users)`);
  const existing = new Set(columnsRs.rows.map((row) => String(row.name)));
  const missingColumns = [
    { name: "stripe_customer_id", sql: "TEXT" },
    { name: "subscription_status", sql: "TEXT NOT NULL DEFAULT 'inactive'" },
    { name: "subscription_id", sql: "TEXT" },
    { name: "subscription_price_id", sql: "TEXT" },
    { name: "subscription_current_period_end", sql: "TEXT" },
    { name: "updated_at", sql: "TEXT" },
  ];

  for (const column of missingColumns) {
    if (!existing.has(column.name)) {
      await db.execute(`ALTER TABLE users ADD COLUMN ${column.name} ${column.sql}`);
    }
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS stripe_webhook_events (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id
    ON users (stripe_customer_id)
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_users_subscription_status
    ON users (subscription_status)
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_users_subscription_id
    ON users (subscription_id)
  `);
}

function toIsoFromUnix(seconds) {
  if (!seconds || !Number.isFinite(Number(seconds))) return null;
  return new Date(Number(seconds) * 1000).toISOString();
}

function mapStripeStatus(status) {
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "canceled") return "canceled";
  if (["past_due", "unpaid", "incomplete", "incomplete_expired"].includes(status)) return "past_due";
  return "inactive";
}

async function markEventProcessed(eventId, eventType) {
  const rs = await db.execute({
    sql: `
      INSERT OR IGNORE INTO stripe_webhook_events (event_id, event_type, created_at)
      VALUES (?, ?, ?)
    `,
    args: [eventId, eventType, new Date().toISOString()],
  });
  return Number(rs.rowsAffected || 0) > 0;
}

async function findUserIdByCustomerId(customerId) {
  if (!customerId) return null;
  const rs = await db.execute({
    sql: `SELECT id FROM users WHERE stripe_customer_id = ? LIMIT 1`,
    args: [String(customerId)],
  });
  return rs.rows[0] ? String(rs.rows[0].id) : null;
}

async function upsertSubscriptionState({
  userId,
  customerId,
  subscriptionId,
  priceId,
  subscriptionStatus,
  currentPeriodEnd,
}) {
  if (!userId && !customerId) return;

  const now = new Date().toISOString();
  if (userId) {
    await db.execute({
      sql: `
        UPDATE users
        SET
          stripe_customer_id = COALESCE(?, stripe_customer_id),
          subscription_status = ?,
          subscription_id = ?,
          subscription_price_id = ?,
          subscription_current_period_end = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [
        customerId ? String(customerId) : null,
        subscriptionStatus,
        subscriptionId ? String(subscriptionId) : null,
        priceId ? String(priceId) : null,
        currentPeriodEnd,
        now,
        String(userId),
      ],
    });
    return;
  }

  await db.execute({
    sql: `
      UPDATE users
      SET
        subscription_status = ?,
        subscription_id = ?,
        subscription_price_id = ?,
        subscription_current_period_end = ?,
        updated_at = ?
      WHERE stripe_customer_id = ?
    `,
    args: [
      subscriptionStatus,
      subscriptionId ? String(subscriptionId) : null,
      priceId ? String(priceId) : null,
      currentPeriodEnd,
      now,
      String(customerId),
    ],
  });
}

async function handleCheckoutCompleted(event, stripe) {
  const session = event.data.object;
  const customerId = session.customer ? String(session.customer) : null;
  const userIdFromMetadata = session.metadata && session.metadata.user_id ? String(session.metadata.user_id) : null;

  let subscription = null;
  if (session.subscription) {
    subscription = await stripe.subscriptions.retrieve(String(session.subscription));
  }

  const status = mapStripeStatus(subscription?.status || "inactive");
  const priceId = subscription?.items?.data?.[0]?.price?.id || null;
  const currentPeriodEnd = toIsoFromUnix(subscription?.current_period_end);

  const resolvedUserId = userIdFromMetadata || (await findUserIdByCustomerId(customerId));
  await upsertSubscriptionState({
    userId: resolvedUserId,
    customerId,
    subscriptionId: subscription?.id || session.subscription || null,
    priceId,
    subscriptionStatus: status,
    currentPeriodEnd,
  });

  console.log("checkout_completed", {
    event_id: event.id,
    customer: customerId,
    subscription: subscription?.id || session.subscription || null,
    price: priceId,
    user_id: resolvedUserId,
  });
}

async function handleSubscriptionUpdatedOrDeleted(event) {
  const subscription = event.data.object;
  const customerId = subscription.customer ? String(subscription.customer) : null;
  const priceId = subscription?.items?.data?.[0]?.price?.id || null;
  const currentPeriodEnd = toIsoFromUnix(subscription.current_period_end);
  const status = mapStripeStatus(subscription.status || "inactive");

  const resolvedUserId = await findUserIdByCustomerId(customerId);
  await upsertSubscriptionState({
    userId: resolvedUserId,
    customerId,
    subscriptionId: subscription.id || null,
    priceId,
    subscriptionStatus: status,
    currentPeriodEnd,
  });
}

async function handleInvoicePaymentFailed(event, stripe) {
  const invoice = event.data.object;
  const customerId = invoice.customer ? String(invoice.customer) : null;
  let subscription = null;

  if (invoice.subscription) {
    subscription = await stripe.subscriptions.retrieve(String(invoice.subscription));
  }

  const resolvedUserId = await findUserIdByCustomerId(customerId);
  await upsertSubscriptionState({
    userId: resolvedUserId,
    customerId,
    subscriptionId: subscription?.id || invoice.subscription || null,
    priceId: subscription?.items?.data?.[0]?.price?.id || null,
    subscriptionStatus: "past_due",
    currentPeriodEnd: toIsoFromUnix(subscription?.current_period_end),
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "method not allowed" });
  }

  try {
    requireEnv("TURSO_DATABASE_URL");
    requireEnv("TURSO_AUTH_TOKEN");
    requireEnv("STRIPE_SECRET_KEY");
    requireEnv("STRIPE_WEBHOOK_SECRET");
    await ensureSchema();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const signature = getHeader(event.headers, "Stripe-Signature");
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return jsonResponse(400, { error: `invalid signature: ${error.message}` });
    }

    const accepted = await markEventProcessed(stripeEvent.id, stripeEvent.type);
    if (!accepted) {
      return jsonResponse(200, { ok: true, duplicate: true });
    }

    if (stripeEvent.type === "checkout.session.completed") {
      await handleCheckoutCompleted(stripeEvent, stripe);
    } else if (stripeEvent.type === "customer.subscription.updated" || stripeEvent.type === "customer.subscription.deleted") {
      await handleSubscriptionUpdatedOrDeleted(stripeEvent);
    } else if (stripeEvent.type === "invoice.payment_failed") {
      await handleInvoicePaymentFailed(stripeEvent, stripe);
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "internal error" });
  }
};
