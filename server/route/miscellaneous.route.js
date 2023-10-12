import { Router } from "express";
import { createQuery } from "../controller/miscellaneous.controller.js";

const router = Router();

router.post("/contact", createQuery);

export default router;