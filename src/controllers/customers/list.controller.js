import { listCustomers } from "../../services/customer.service.js";

export default async function listCustomersController(_req, res, next) {
  try {
    res.json({ ok: true, data: await listCustomers() });
  } catch (err) { next(err); }
}
