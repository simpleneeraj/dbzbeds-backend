import { Router } from "express";
import upload from "../config/multer";
import { getallMultipleFiles, UploadMutipleImageController } from "../controllers/file-upload-controllers";

const router = Router();

// uploading multiple images..
router.post('/multipleFiles', upload.array('files'), UploadMutipleImageController);

//get all multiple images..
router.get('/getMultipleFiles', getallMultipleFiles);

export default router;
