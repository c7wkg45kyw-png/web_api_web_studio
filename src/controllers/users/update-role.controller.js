import { updateRoleSchema } from "../../schemas/users.schema.js";
import { updateUserRole } from "../../services/user.service.js";

export default async function updateRoleController(req, res, next) {
  try {
    const { role } = updateRoleSchema.parse(req.body);
    const data = await updateUserRole(req.params.id, role);
    if (!data) return res.status(404).json({ ok: false, error: { message: "User not found" } });
    res.json({ ok: true, data });
  } catch (err) { err.status ||= 400; next(err); }
}
