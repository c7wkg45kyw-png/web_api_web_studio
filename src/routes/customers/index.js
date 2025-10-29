import { Router } from "express";
import listController from "../../controllers/customers/list.controller.js";
import meGetController from "../../controllers/customers/me-get.controller.js";
import meUpdateController from "../../controllers/customers/me-update.controller.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";

const router = Router();

// พนักงานดูรายการลูกค้า
router.get("/", requireAuth, requireRole("employee"), listController);

// ลูกค้าดู/แก้โปรไฟล์ตัวเอง
router.get("/me", requireAuth, requireRole("customer"), meGetController);
router.put("/me", requireAuth, requireRole("customer"), meUpdateController);

export default router;
