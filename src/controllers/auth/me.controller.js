import { meFromReqUser } from "../../services/auth.service.js";

export default async function meController(req, res) {
  res.json({ ok: true, data: await meFromReqUser(req.user) });
}
