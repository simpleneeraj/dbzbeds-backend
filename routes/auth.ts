import { Router } from "express";
import {
    handleAdminRegisterController,
    handleLoginController,
    handleUserRegisterController,
    handleVerifyTokenController,
} from "../controllers/auth-controller";

const router = Router();

router.post("/register-admin", handleAdminRegisterController);
router.post("/login", handleLoginController);
router.post("/register", handleUserRegisterController);
router.post("/verify-token", handleVerifyTokenController);

export default router;
