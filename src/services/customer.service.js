import { pool } from "../lib/db.js";

export async function listCustomers() {
  const [rows] = await pool.query(
    `SELECT c.id, c.user_id, u.email, c.first_name, c.last_name, c.phone, c.address, c.created_at
     FROM customers c JOIN users u ON u.id = c.user_id
     ORDER BY c.created_at DESC`
  );
  return rows;
}

export async function getCustomerByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, first_name, last_name, phone, address, created_at
     FROM customers WHERE user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

export async function updateCustomerByUserId(userId, patch) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(patch)) { sets.push(`${k}=?`); vals.push(v); }
  vals.push(userId);

  const [r] = await pool.query(`UPDATE customers SET ${sets.join(", ")} WHERE user_id = ?`, vals);
  if (r.affectedRows === 0) return null;

  return await getCustomerByUserId(userId);
}
