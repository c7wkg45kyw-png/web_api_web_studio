import { listUsers } from "../../services/user.service.js";
export default async function listUsersController(_req, res, next) {
  try { res.json({ ok: true, data: await listUsers() }); }
  catch (err) { next(err); }
}
