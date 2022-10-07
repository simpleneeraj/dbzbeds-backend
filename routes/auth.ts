import { Router } from "express";
import {
    handleAdminRegisterController,
    handleLoginController,
} from "../controllers/auth-controller";

const router = Router();

router.post("/register-admin", handleAdminRegisterController);
router.post("/login", handleLoginController);

export default router;
