import { loginSchema } from "../../schemas/auth.schema.js";
import { login } from "../../services/auth.service.js";

export default async function loginController(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const data = await login(payload);
    res.json({ ok: true, data });
  } catch (err) { err.status ||= 400; next(err); }
}
