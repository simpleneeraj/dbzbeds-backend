import { Router } from "express";
import {
  handleAfterpayPaymentController,
  handlePaymentController,
} from "../controllers/payment-controller";

const router = Router();

router.post("/", handlePaymentController);
router.post("/afterpay", handleAfterpayPaymentController);

export default router;
