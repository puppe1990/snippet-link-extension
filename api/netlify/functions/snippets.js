const { createClient } = require("@libsql/client/web");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const MOBILE_BYPASS_EMAIL = "matheus.puppe@gmail.com";

function getHeader(headers, name) {
  if (!headers) return "";
  const direct = headers[name];
  if (direct) return String(direct);
  const lower = headers[name.toLowerCase()];
  if (lower) return String(lower);
  return "";
}

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

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function ensureSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS snippets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      is_favorite INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    )
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_snippets_user_updated
    ON snippets (user_id, updated_at)
  `);

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

async function getAuthenticatedUserId(event) {
  const auth = getHeader(event.headers, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const now = new Date().toISOString();
  const rs = await db.execute({
    sql: `SELECT user_id FROM sessions WHERE token = ? AND expires_at > ? LIMIT 1`,
    args: [token, now],
  });
  if (!rs.rows[0]) return null;
  return String(rs.rows[0].user_id);
}

function getLegacyApiKeyAuthorized(event) {
  const apiKey = getHeader(event.headers, "X-API-Key");
  return Boolean(apiKey && process.env.EXTENSION_API_KEY && apiKey === process.env.EXTENSION_API_KEY);
}

async function userHasEntitlement(userId) {
  if (!userId) return false;
  const rs = await db.execute({
    sql: `SELECT COALESCE(subscription_status, 'inactive') AS subscription_status FROM users WHERE id = ? LIMIT 1`,
    args: [userId],
  });
  if (!rs.rows[0]) return false;
  return String(rs.rows[0].subscription_status) === "active";
}

async function userMatchesBypassEmail(userId) {
  if (!userId) return false;
  const rs = await db.execute({
    sql: `SELECT email FROM users WHERE id = ? LIMIT 1`,
    args: [userId],
  });
  const email = String(rs.rows?.[0]?.email || "").trim().toLowerCase();
  return email === MOBILE_BYPASS_EMAIL;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    requireEnv("TURSO_DATABASE_URL");
    requireEnv("TURSO_AUTH_TOKEN");
  } catch (error) {
    return jsonResponse(500, { error: error.message });
  }

  try {
    await ensureSchema();

    const authUserId = await getAuthenticatedUserId(event);
    const legacyAuthorized = getLegacyApiKeyAuthorized(event);

    if (!authUserId && !legacyAuthorized) {
      return jsonResponse(401, { error: "unauthorized" });
    }

    if (authUserId) {
      let entitled = await userHasEntitlement(authUserId);
      if (!entitled) {
        const bypassRequested = getHeader(event.headers, "X-Mobile-Bypass-Subscription") === "1";
        if (bypassRequested) {
          const bypassAllowed = await userMatchesBypassEmail(authUserId);
          if (bypassAllowed) {
            entitled = true;
          }
        }
      }
      if (!entitled) {
        console.log("entitlement_denied", { user_id: authUserId });
        return jsonResponse(402, { error: "subscription_required" });
      }
    }

    if (event.httpMethod === "GET") {
      const userId = authUserId || (event.queryStringParameters && event.queryStringParameters.userId) || "default-user";

      const rs = await db.execute({
        sql: `
          SELECT id, user_id, title, type, content, tags, is_favorite, is_archived, created_at, updated_at
          FROM snippets
          WHERE user_id = ? AND deleted_at IS NULL
          ORDER BY updated_at DESC
        `,
        args: [userId],
      });

      const rows = rs.rows.map((row) => ({
        ...row,
        tags: parseTags(row.tags),
      }));

      return jsonResponse(200, rows);
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      if (!payload.id || !payload.type || !payload.content) {
        return jsonResponse(400, { error: "id, type and content are required" });
      }

      const userId = authUserId || payload.userId || "default-user";
      const now = new Date().toISOString();
      const createdAt = payload.createdAt || now;
      const updatedAt = payload.updatedAt || now;

      await db.execute({
        sql: `
          INSERT INTO snippets (
            id, user_id, title, type, content, tags, is_favorite, is_archived, created_at, updated_at, deleted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
          ON CONFLICT(id) DO UPDATE SET
            user_id = excluded.user_id,
            title = excluded.title,
            type = excluded.type,
            content = excluded.content,
            tags = excluded.tags,
            is_favorite = excluded.is_favorite,
            is_archived = excluded.is_archived,
            updated_at = excluded.updated_at,
            deleted_at = NULL
        `,
        args: [
          String(payload.id),
          userId,
          payload.title || null,
          payload.type,
          payload.content,
          JSON.stringify(parseTags(payload.tags)),
          payload.isFavorite ? 1 : 0,
          payload.isArchived ? 1 : 0,
          createdAt,
          updatedAt,
        ],
      });

      return jsonResponse(200, { ok: true });
    }

    if (event.httpMethod === "DELETE") {
      const payload = JSON.parse(event.body || "{}");
      if (!payload.id) {
        return jsonResponse(400, { error: "id is required" });
      }

      const userId = authUserId || payload.userId || "default-user";
      const updatedAt = payload.updatedAt || new Date().toISOString();

      await db.execute({
        sql: `
          UPDATE snippets
          SET deleted_at = ?, updated_at = ?
          WHERE id = ? AND user_id = ?
        `,
        args: [updatedAt, updatedAt, String(payload.id), userId],
      });

      return jsonResponse(200, { ok: true });
    }

    return jsonResponse(405, { error: "method not allowed" });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "internal error" });
  }
};
