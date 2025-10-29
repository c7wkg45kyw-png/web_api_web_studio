import { registerSchema } from "../../schemas/auth.schema.js";
import { registerCustomer } from "../../services/auth.service.js";

export default async function registerController(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const data = await registerCustomer(payload);
    res.status(201).json({ ok: true, data });
  } catch (err) { err.status ||= 400; next(err); }
}
