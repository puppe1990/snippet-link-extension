const { createClient } = require("@libsql/client/web");
const crypto = require("crypto");

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

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, hash] = String(passwordHash || "").split(":");
  if (!salt || !hash) return false;
  const verify = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verify, "hex"));
}

function makeToken() {
  return crypto.randomBytes(48).toString("hex");
}

function getUserIdFromAuth(event) {
  const auth = getHeader(event.headers, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.replace(/^Bearer\s+/i, "").trim();
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

async function getSessionUser(token) {
  if (!token) return null;
  const now = new Date().toISOString();
  const rs = await db.execute({
    sql: `SELECT user_id FROM sessions WHERE token = ? AND expires_at > ? LIMIT 1`,
    args: [token, now],
  });
  return rs.rows[0] ? String(rs.rows[0].user_id) : null;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    await ensureSchema();

    if (event.httpMethod === "GET") {
      const token = getUserIdFromAuth(event);
      const userId = await getSessionUser(token);
      if (!userId) return jsonResponse(401, { error: "unauthorized" });

      const rs = await db.execute({
        sql: `
          SELECT
            id,
            email,
            created_at,
            COALESCE(subscription_status, 'inactive') AS subscription_status,
            subscription_current_period_end
          FROM users
          WHERE id = ?
          LIMIT 1
        `,
        args: [userId],
      });
      if (!rs.rows[0]) return jsonResponse(401, { error: "unauthorized" });
      const subscriptionStatus = String(rs.rows[0].subscription_status || "inactive");
      return jsonResponse(200, {
        user: {
          id: rs.rows[0].id,
          email: rs.rows[0].email,
          createdAt: rs.rows[0].created_at,
          subscription_status: subscriptionStatus,
          entitled: subscriptionStatus === "active",
          subscription_current_period_end: rs.rows[0].subscription_current_period_end || null,
        },
      });
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { error: "method not allowed" });
    }

    const payload = JSON.parse(event.body || "{}");
    const action = payload.action;

    if (action === "register") {
      const email = String(payload.email || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (!email || !password || password.length < 6) {
        return jsonResponse(400, { error: "email and password(min 6) required" });
      }

      const exists = await db.execute({
        sql: `SELECT id FROM users WHERE email = ? LIMIT 1`,
        args: [email],
      });
      if (exists.rows[0]) {
        return jsonResponse(409, { error: "email already exists" });
      }

      const userId = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.execute({
        sql: `
          INSERT INTO users (id, email, password_hash, created_at, updated_at, subscription_status)
          VALUES (?, ?, ?, ?, ?, 'inactive')
        `,
        args: [userId, email, hashPassword(password), now, now],
      });

      const token = makeToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
      await db.execute({
        sql: `INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
        args: [token, userId, now, expiresAt],
      });

      return jsonResponse(200, {
        token,
        user: {
          id: userId,
          email,
          subscription_status: "inactive",
          entitled: false,
          subscription_current_period_end: null,
        },
      });
    }

    if (action === "login") {
      const email = String(payload.email || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (!email || !password) {
        return jsonResponse(400, { error: "email and password required" });
      }

      const rs = await db.execute({
        sql: `
          SELECT
            id,
            email,
            password_hash,
            COALESCE(subscription_status, 'inactive') AS subscription_status,
            subscription_current_period_end
          FROM users
          WHERE email = ?
          LIMIT 1
        `,
        args: [email],
      });
      const user = rs.rows[0];
      if (!user || !verifyPassword(password, user.password_hash)) {
        return jsonResponse(401, { error: "invalid credentials" });
      }

      const token = makeToken();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
      await db.execute({
        sql: `INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
        args: [token, String(user.id), now, expiresAt],
      });

      return jsonResponse(200, {
        token,
        user: {
          id: String(user.id),
          email: String(user.email),
          subscription_status: String(user.subscription_status || "inactive"),
          entitled: String(user.subscription_status || "inactive") === "active",
          subscription_current_period_end: user.subscription_current_period_end || null,
        },
      });
    }

    if (action === "logout") {
      const auth = getUserIdFromAuth(event);
      if (!auth) return jsonResponse(200, { ok: true });
      await db.execute({
        sql: `DELETE FROM sessions WHERE token = ?`,
        args: [auth],
      });
      return jsonResponse(200, { ok: true });
    }

    return jsonResponse(400, { error: "invalid action" });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "internal error" });
  }
};
