//order routes
import { Router } from "express";
import {
    createHeadboardController,
    createHeadboardVariantController,
    deleteHeadboardController,
    getAllHeadboardsController,
    getAllHeadboardWithImageController,
    getHeadboardByIdController,
    updateHeadboardController,
} from "../controllers/headboard-controller";

const router = Router();

router.post("/create", createHeadboardController);
router.post("/add-headboard/:id", createHeadboardVariantController);
router.get("/", getAllHeadboardsController);
router.get("/get-headboard-with-image", getAllHeadboardWithImageController);
router.get("/:id", getHeadboardByIdController);
router.put("/:id", updateHeadboardController);
router.delete("/:id", deleteHeadboardController);

export default router;
