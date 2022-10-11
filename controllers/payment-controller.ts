import { Request, Response } from "express";
import { createCheckoutSessionService } from "../services/payment-services";

export const handlePaymentController = async (req: Request, res: Response) => {
    try {
        const { line_items } = req.body;
        const session = await createCheckoutSessionService(line_items);
        res.status(200).json({ session });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
