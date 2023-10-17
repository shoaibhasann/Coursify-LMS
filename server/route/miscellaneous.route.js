import { Router } from "express";
import { contactUs, userStats } from "../controller/miscellaneous.controller.js";
import { isLoggedIn, authorizedRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/contact", contactUs);
router.get("/admin/stats/users", isLoggedIn, authorizedRoles("admin"), userStats);

export default router;