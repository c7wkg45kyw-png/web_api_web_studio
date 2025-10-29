import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { pool } from "../lib/db.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";

export async function registerCustomer(payload) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [dup] = await conn.query("SELECT id FROM users WHERE email = ?", [payload.email]);
    if (dup.length) {
      await conn.rollback();
      const err = new Error("Email already in use");
      err.status = 409;
      throw err;
    }

    const userId = uuidv4();
    const customerId = uuidv4();
    const passHash = await hashPassword(payload.password);

    await conn.query(
      "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, 'customer')",
      [userId, payload.email, passHash]
    );

    await conn.query(
      "INSERT INTO customers (id, user_id, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [customerId, userId, payload.first_name, payload.last_name, payload.phone || null, payload.address || null]
    );

    await conn.commit();
    return {
      user: { id: userId, email: payload.email, role: "customer" },
      customer: {
        id: customerId,
        user_id: userId,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone || null,
        address: payload.address || null
      }
    };
  } catch (e) {
    try { await conn.rollback(); } catch {}
    throw e;
  } finally {
    conn.release();
  }
}

export async function login({ email, password }) {
  const [rows] = await pool.query(
    "SELECT id, email, password_hash, role FROM users WHERE email = ?",
    [email]
  );
  if (!rows.length) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const access = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refresh = signRefreshToken({ sub: user.id });

  const tokenHash = crypto.createHash("sha256").update(refresh).digest("hex");
  const expires = new Date(Date.now() + (Number(process.env.JWT_REFRESH_EXPIRES || 1209600) * 1000));
  const rtId = uuidv4();

  await pool.query(
    "INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
    [rtId, user.id, tokenHash, expires]
  );

  return { user: { id: user.id, email: user.email, role: user.role }, tokens: { access, refresh } };
}

export async function refreshAccessToken(refresh_token) {
  // ตรวจลายเซ็น/หมดอายุก่อน
  verifyRefreshToken(refresh_token);

  const tokenHash = crypto.createHash("sha256").update(refresh_token).digest("hex");
  const [rows] = await pool.query(
    `SELECT rt.id, u.id AS user_id, u.email, u.role, rt.expires_at
     FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = ?`,
    [tokenHash]
  );
  if (!rows.length) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    throw err;
  }

  const rec = rows[0];
  if (new Date(rec.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM refresh_tokens WHERE id = ?", [rec.id]);
    const err = new Error("Refresh token expired");
    err.status = 401;
    throw err;
  }

  const access = signAccessToken({ sub: rec.user_id, role: rec.role, email: rec.email });
  return { access };
}

export async function logout(refresh_token) {
  const tokenHash = crypto.createHash("sha256").update(refresh_token).digest("hex");
  await pool.query("DELETE FROM refresh_tokens WHERE token_hash = ?", [tokenHash]);
  return true;
}

export async function meFromReqUser(reqUser) {
  // reqUser = { sub, role, email } ถูกเติมโดย requireAuth
  return { id: reqUser.sub, role: reqUser.role, email: reqUser.email };
}
