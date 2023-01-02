import { Router } from "express";
import {
  createCouponController,
  deleteCouponController,
  getAllCouponsController,
  getCouponByIdController,
  getCouponByLabelController,
  updateCouponController,
} from "../controllers/coupon-controller";

const router = Router();

router.post("/create", createCouponController);
router.get("/", getAllCouponsController);
router.get("/:id", getCouponByIdController);
router.get("/label/:label", getCouponByLabelController);
router.put("/:id", updateCouponController);
router.delete("/:id", deleteCouponController);

export default router;
