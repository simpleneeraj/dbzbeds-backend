import { Router } from "express";
import {
  createBuildYourBedController,
  createBuildYourBedVariantsController,
  createBuildYourBedVariantsWithColorController,
  deleteBuildYourBedController,
  getBuildYourBedController,
  getBuildYourBedsController,
  updateBuildYourBedController,
} from "../controllers/build-your-bed-controller";

const router = Router();

router.post("/create", createBuildYourBedController);
router.get("/:id", getBuildYourBedController);
router.get("/", getBuildYourBedsController);
router.put("/:id", updateBuildYourBedController);
router.delete("/:id", deleteBuildYourBedController);
router.post("/:id/variants", createBuildYourBedVariantsController);
router.post(
  "/:id/variants/:variantId/colors",
  createBuildYourBedVariantsWithColorController
);

export default router;
