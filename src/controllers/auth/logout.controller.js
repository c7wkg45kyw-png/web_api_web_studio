import { logout } from "../../services/auth.service.js";

export default async function logoutController(req, res, next) {
  try {
    const { refresh_token } = req.body || {};
    if (!refresh_token) return res.status(400).json({ ok: false, error: { message: "refresh_token required" } });
    await logout(refresh_token);
    res.status(204).send();
  } catch (err) { next(err); }
}
