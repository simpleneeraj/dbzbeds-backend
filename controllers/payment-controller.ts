import { Request, Response } from "express";
import {
  createAfterpayCheckoutService,
  createCheckoutSessionService,
} from "../services/payment-services";

export const handlePaymentController = async (req: Request, res: Response) => {
  try {
    const { line_items, couponId } = req.body;
    const session = await createCheckoutSessionService(line_items, couponId);
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAfterpayPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { amount } = req.body;
    const session = await createAfterpayCheckoutService(amount);
    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
