import { Router } from "express";
import { getMyselfController } from "../controllers/user-controller";
import { isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.get("/", isAuthenticated, getMyselfController);

export default router;
