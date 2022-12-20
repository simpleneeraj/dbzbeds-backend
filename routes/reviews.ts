import { Router } from "express";
import {
  approveReviewController,
  createReviewController,
  declineReviewController,
  deleteReviewController,
  getReviewsAdminController,
  getReviewsController,
} from "../controllers/review-controller";

const router = Router();

router.post("/create", createReviewController);
router.get("/admin", getReviewsAdminController);
router.get("/", getReviewsController);
router.put("/approve/:id", approveReviewController);
router.put("/deny/:id", declineReviewController);
router.delete("/:id", deleteReviewController);

export default router;
