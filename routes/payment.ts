import { Router } from "express";
import { handlePaymentController } from "../controllers/payment-controller";

const router = Router();

router.post("/", handlePaymentController);

export default router;
