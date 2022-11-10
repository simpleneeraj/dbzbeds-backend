import { Router } from "express";
import upload from "../config/multer";
import {
    deleteMultipleFiles,
    getAllMultipleFiles,
    getAllMultipleFilesById,
    updateMultipleFiles,
    UploadMutipleImageController
} from "../controllers/file-upload-controllers";

const router = Router();

// uploading multiple beds..
router.post('/multipleFiles', upload.array('files'), UploadMutipleImageController);

//get all multiple beds..
router.get('/getMultipleFiles', getAllMultipleFiles);

//get all beds with multiple images by id
router.get('/getMultipleFiles/:id', getAllMultipleFilesById);

// delete beds by id
router.delete('/deleteMultipleFiles/:id', deleteMultipleFiles);

// update beds by id
router.put('/updateMultipleFiles/:id', updateMultipleFiles);

export default router;
