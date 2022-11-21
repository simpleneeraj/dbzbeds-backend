//order routes
import { Router } from "express";
import {
    createHeadboardController,
    createHeadboardVariantController,
    deleteHeadboardController,
    getAllHeadboardsController,
    getAllHeadboardWithImageController,
    getHeadboardByIdController,
    getHeadboardVariantByIdController,
    updateHeadboardController,
    updateHeadboardVariantController,
} from "../controllers/headboard-controller";

const router = Router();

router.post("/create", createHeadboardController);
router.get("/get-headboard-with-image", getAllHeadboardWithImageController);
router.post("/add-headboard/:id", createHeadboardVariantController);
router.put("/update-headboard/:id", updateHeadboardVariantController);
router.get("/get-headboard/:id", getHeadboardVariantByIdController);
router.get("/", getAllHeadboardsController);
router.get("/:id", getHeadboardByIdController);
router.put("/:id", updateHeadboardController);
router.delete("/:id", deleteHeadboardController);

export default router;
