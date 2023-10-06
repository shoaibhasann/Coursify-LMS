import { Router } from "express";
import { changePassword, editProfile, forgotPassword, getProfile, login, logout, register, resetPassword } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.put("/update", isLoggedIn,  upload.single("avatar"), editProfile);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);



export default router;