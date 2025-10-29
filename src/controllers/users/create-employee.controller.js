import { createEmployeeSchema } from "../../schemas/users.schema.js";
import { createEmployee } from "../../services/user.service.js";

export default async function createEmployeeController(req, res, next) {
  try {
    const payload = createEmployeeSchema.parse(req.body);
    const data = await createEmployee(payload);
    res.status(201).json({ ok: true, data });
  } catch (err) { err.status ||= 400; next(err); }
}
