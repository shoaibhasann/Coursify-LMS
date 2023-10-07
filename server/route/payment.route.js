import { Router } from "express";
import { allSubscriptions, buySubscription, cancelSubscription, getRazorpayKey, verifySubscription } from "../controller/payment.controller.js";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/apikey", isLoggedIn, getRazorpayKey);
router.post("/subscribe", isLoggedIn, buySubscription);
router.post("/verify", isLoggedIn, verifySubscription);
router.post("/unsubscribe", isLoggedIn, cancelSubscription);
router.get("/", isLoggedIn, authorizedRoles("admin"), allSubscriptions);

export default router;
