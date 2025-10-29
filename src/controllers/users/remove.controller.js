import { deleteUser } from "../../services/user.service.js";
export default async function removeUserController(req, res, next) {
  try {
    const ok = await deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: { message: "User not found" } });
    res.status(204).send();
  } catch (err) { next(err); }
}
