import { Router } from "express";
import {
  approveReviewController,
  createReviewController,
  declineReviewController,
  deleteReviewController,
  getReviewsAdminController,
  getReviewsByProductIdAdminController,
  getReviewsByProductIdController,
  getReviewsController,
} from "../controllers/review-controller";

const router = Router();

router.get("/", getReviewsController);
router.post("/create", createReviewController);
router.get("/admin", getReviewsAdminController);
router.get("/admin/:id", getReviewsByProductIdAdminController);
router.put("/approve/:id", approveReviewController);
router.put("/deny/:id", declineReviewController);
router.delete("/:id", deleteReviewController);
router.get("/:id", getReviewsByProductIdController);

export default router;
