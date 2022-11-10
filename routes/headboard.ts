//order routes
import { Router } from "express";
import {
    createHeadboardController,
    deleteHeadboardController,
    getAllHeadboardsController,
    getHeadboardByIdController,
    updateHeadboardController,
} from "../controllers/headboard-controller";

const router = Router();

router.post("/", createHeadboardController);
router.get("/", getAllHeadboardsController);
router.get("/:id", getHeadboardByIdController);
router.put("/:id", updateHeadboardController);
router.delete("/:id", deleteHeadboardController);

export default router;
