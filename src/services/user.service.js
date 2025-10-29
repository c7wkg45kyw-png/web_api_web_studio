import { v4 as uuidv4 } from "uuid";
import { pool } from "../lib/db.js";
import { hashPassword } from "../lib/password.js";

export async function listUsers() {
  const [rows] = await pool.query(
    `SELECT id, email, role, created_at FROM users ORDER BY created_at DESC`
  );
  return rows;
}

export async function createEmployee({ email, password }) {
  const [dup] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (dup.length) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const id = uuidv4();
  const hash = await hashPassword(password);
  await pool.query(
    "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, 'employee')",
    [id, email, hash]
  );
  return { id, email, role: "employee" };
}

export async function getUserWithCustomer(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.role, u.created_at,
            c.id AS customer_id, c.first_name, c.last_name, c.phone, c.address
     FROM users u
     LEFT JOIN customers c ON c.user_id = u.id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function updateUserRole(id, role) {
  const [r] = await pool.query(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
  if (r.affectedRows === 0) return null;

  if (role === "customer") {
    const [has] = await pool.query(`SELECT id FROM customers WHERE user_id = ?`, [id]);
    if (!has.length) {
      await pool.query(
        `INSERT INTO customers (id, user_id, first_name, last_name, phone, address)
         VALUES (UUID(), ?, NULL, NULL, NULL, NULL)`,
        [id]
      );
    }
  }
  return { id, role };
}

export async function deleteUser(id) {
  const [r] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
  return r.affectedRows > 0;
}
