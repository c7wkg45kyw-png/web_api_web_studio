import { refreshSchema } from "../../schemas/auth.schema.js";
import { refreshAccessToken } from "../../services/auth.service.js";

export default async function refreshController(req, res, next) {
  try {
    const { refresh_token } = refreshSchema.parse(req.body);
    const data = await refreshAccessToken(refresh_token);
    res.json({ ok: true, data });
  } catch (err) { err.status ||= 401; next(err); }
}
