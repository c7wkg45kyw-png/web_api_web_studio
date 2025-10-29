import { customerUpdateSchema } from "../../schemas/customers.schema.js";
import { updateCustomerByUserId } from "../../services/customer.service.js";

export default async function meUpdateController(req, res, next) {
  try {
    const patch = customerUpdateSchema.parse(req.body);
    const rec = await updateCustomerByUserId(req.user.sub, patch);
    if (!rec) return res.status(404).json({ ok: false, error: { message: "Customer profile not found" } });
    res.json({ ok: true, data: rec });
  } catch (err) { err.status ||= 400; next(err); }
}
