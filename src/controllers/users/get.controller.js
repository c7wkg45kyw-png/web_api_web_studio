import { getUserWithCustomer } from "../../services/user.service.js";

export default async function getUserController(req, res, next) {
  try {
    const data = await getUserWithCustomer(req.params.id);
    if (!data) return res.status(404).json({ ok: false, error: { message: "User not found" } });
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}
