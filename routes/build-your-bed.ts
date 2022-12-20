import { Router } from "express";
import {
  createBuildYourBedController,
  createBuildYourBedVariantsController,
  createBuildYourBedVariantsWithColorController,
  deleteBuildYourBedController,
  getBuildYourBedBySizeController,
  getBuildYourBedController,
  getBuildYourBedsController,
  getBuildYourBedVariantsController,
  getBuildYourBedVariantsWithColorController,
  updateBuildYourBedController,
} from "../controllers/build-your-bed-controller";

const router = Router();

router.post("/create", createBuildYourBedController);
router.get("/:id", getBuildYourBedController);
router.get("/", getBuildYourBedsController);
router.put("/:id", updateBuildYourBedController);
router.delete("/:id", deleteBuildYourBedController);
router.post("/:id/variants", createBuildYourBedVariantsController);
router.get("/:id/variants", getBuildYourBedVariantsController);
router.post(
  "/variants/colors/:id",
  createBuildYourBedVariantsWithColorController
);
router.get("/size/:size", getBuildYourBedBySizeController);

router.get("/variants/colors/:id", getBuildYourBedVariantsWithColorController);

export default router;
