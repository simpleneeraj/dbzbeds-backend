//order routes
import { Router } from "express";

import {
    createOrderController,
    deleteOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderController,
} from "../controllers/order-controller";

const router = Router();

router.post("/", createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", updateOrderController);
router.delete("/:id", deleteOrderController);

export default router;
