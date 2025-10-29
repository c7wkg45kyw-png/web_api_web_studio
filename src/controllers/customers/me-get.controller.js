import { getCustomerByUserId } from "../../services/customer.service.js";

export default async function meGetController(req, res, next) {
  try {
    const rec = await getCustomerByUserId(req.user.sub);
    if (!rec) return res.status(404).json({ ok: false, error: { message: "Customer profile not found" } });
    res.json({ ok: true, data: rec });
  } catch (err) { next(err); }
}
