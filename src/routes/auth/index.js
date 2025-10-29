import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";

import registerController from "../../controllers/auth/register.controller.js";
import loginController from "../../controllers/auth/login.controller.js";
import refreshController from "../../controllers/auth/refresh.controller.js";
import logoutController from "../../controllers/auth/logout.controller.js";
import meController from "../../controllers/auth/me.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, meController);

export default router;
