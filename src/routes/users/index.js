import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import listUsersController from "../../controllers/users/list.controller.js";
import createEmployeeController from "../../controllers/users/create-employee.controller.js";
import getUserController from "../../controllers/users/get.controller.js";
import updateRoleController from "../../controllers/users/update-role.controller.js";
import removeUserController from "../../controllers/users/remove.controller.js";

const router = Router();

router.get("/", requireAuth, requireRole("employee"), listUsersController);
router.post("/", requireAuth, requireRole("employee"), createEmployeeController);
router.get("/:id", requireAuth, requireRole("employee"), getUserController);
router.patch("/:id/role", requireAuth, requireRole("employee"), updateRoleController);
router.delete("/:id", requireAuth, requireRole("employee"), removeUserController);

export default router;
