const { createClient } = require("@libsql/client/web");
const Stripe = require("stripe");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

function getAuthToken(event) {
  const auth = getHeader(event.headers, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return "";
  return auth.replace(/^Bearer\s+/i, "").trim();
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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
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

async function getSessionUserId(token) {
  if (!token) return null;
  const now = new Date().toISOString();
  const rs = await db.execute({
    sql: `SELECT user_id FROM sessions WHERE token = ? AND expires_at > ? LIMIT 1`,
    args: [token, now],
  });
  return rs.rows[0] ? String(rs.rows[0].user_id) : null;
}

async function getUserById(userId) {
  const rs = await db.execute({
    sql: `
      SELECT
        id,
        email,
        stripe_customer_id,
        COALESCE(subscription_status, 'inactive') AS subscription_status,
        subscription_current_period_end
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    args: [userId],
  });
  return rs.rows[0] || null;
}

async function updateStripeCustomerId(userId, customerId) {
  await db.execute({
    sql: `UPDATE users SET stripe_customer_id = ?, updated_at = ? WHERE id = ?`,
    args: [customerId, new Date().toISOString(), userId],
  });
}

async function ensureStripeCustomer(stripe, user) {
  if (user.stripe_customer_id) {
    return String(user.stripe_customer_id);
  }

  const customer = await stripe.customers.create({
    email: String(user.email),
    metadata: { user_id: String(user.id) },
  });

  await updateStripeCustomerId(String(user.id), String(customer.id));
  return String(customer.id);
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    requireEnv("TURSO_DATABASE_URL");
    requireEnv("TURSO_AUTH_TOKEN");
    await ensureSchema();

    const token = getAuthToken(event);
    const userId = await getSessionUserId(token);
    if (!userId) {
      return jsonResponse(401, { error: "unauthorized" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return jsonResponse(401, { error: "unauthorized" });
    }

    if (event.httpMethod === "GET") {
      const subscriptionStatus = String(user.subscription_status || "inactive");
      return jsonResponse(200, {
        subscription_status: subscriptionStatus,
        entitled: subscriptionStatus === "active",
        subscription_current_period_end: user.subscription_current_period_end || null,
      });
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { error: "method not allowed" });
    }

    requireEnv("STRIPE_SECRET_KEY");
    requireEnv("APP_BASE_URL");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const payload = JSON.parse(event.body || "{}");
    const action = String(payload.action || "");

    if (action === "create_checkout") {
      requireEnv("STRIPE_PRICE_ID_MONTHLY_USD_1");

      const currentStatus = String(user.subscription_status || "inactive");
      if (currentStatus === "active") {
        return jsonResponse(409, { error: "already_subscribed" });
      }

      const customerId = await ensureStripeCustomer(stripe, user);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: process.env.STRIPE_PRICE_ID_MONTHLY_USD_1, quantity: 1 }],
        success_url: `${process.env.APP_BASE_URL}/web/mobile-app.html?billing=success`,
        cancel_url: `${process.env.APP_BASE_URL}/web/mobile-app.html?billing=cancel`,
        metadata: {
          user_id: String(user.id),
        },
      });

      console.log("checkout_started", {
        user_id: user.id,
        customer: customerId,
        price: process.env.STRIPE_PRICE_ID_MONTHLY_USD_1,
      });

      return jsonResponse(200, { url: session.url });
    }

    if (action === "create_portal") {
      if (!user.stripe_customer_id) {
        return jsonResponse(404, { error: "stripe_customer_not_found" });
      }

      const portal = await stripe.billingPortal.sessions.create({
        customer: String(user.stripe_customer_id),
        return_url: `${process.env.APP_BASE_URL}/web/mobile-app.html`,
      });

      console.log("portal_opened", {
        user_id: user.id,
        customer: user.stripe_customer_id,
      });

      return jsonResponse(200, { url: portal.url });
    }

    return jsonResponse(400, { error: "invalid action" });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "internal error" });
  }
};
