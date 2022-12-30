import { Router } from "express";
import {
  createBuildYourBedController,
  createBuildYourBedVariantsController,
  createBuildYourBedVariantsWithColorController,
  deleteBuildYourBedController,
  deleteBuildYourBedVariantsController,
  deleteBuildYourBedVariantsWithColorController,
  getBuildYourBedBySizeController,
  getBuildYourBedController,
  getBuildYourBedsController,
  getBuildYourBedVariantsController,
  getBuildYourBedVariantsWithColorByIdController,
  getBuildYourBedVariantsWithColorController,
  updateBuildYourBedController,
  updateBuildYourBedVariantsController,
  updateBuildYourBedVariantsWithColorController,
} from "../controllers/build-your-bed-controller";

const router = Router();

router.post("/create", createBuildYourBedController);
router.get("/:id", getBuildYourBedController);
router.get("/", getBuildYourBedsController);
router.put("/:id", updateBuildYourBedController);
router.delete("/:id", deleteBuildYourBedController);
router.post("/:id/variants", createBuildYourBedVariantsController);
router.get("/:id/variants", getBuildYourBedVariantsController);
router.put("/:id/variants", updateBuildYourBedVariantsController);
router.delete("/:id/variants", deleteBuildYourBedVariantsController);
router.post(
  "/variants/colors/:id",
  createBuildYourBedVariantsWithColorController
);
router.get("/size/:size", getBuildYourBedBySizeController);
router.get("/variants/colors/:id", getBuildYourBedVariantsWithColorController);
router.get(
  "/variants/color/:id",
  getBuildYourBedVariantsWithColorByIdController
);
router.put(
  "/variants/colors/:id",
  updateBuildYourBedVariantsWithColorController
);
router.delete(
  "/variants/colors/:id",
  deleteBuildYourBedVariantsWithColorController
);

export default router;
