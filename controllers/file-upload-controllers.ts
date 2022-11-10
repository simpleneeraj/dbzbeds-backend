import { Request, Response, NextFunction } from "express";
import multiplefile from "../models/multiplefile";
import multipleFileUpload, {
    deleteFileService,
    getMultipleFilesByIdService,
    getMultipleFilesService
} from "../services/image-service";

{/* upload multiple beds */ }
export const UploadMutipleImageController = async (req: Request, res: Response) => {
    try {
        const { name, price, des } = req.body;
        if (!name || !price || !des) {
            res.send(400).send("all fields are required {name,price,dec}")
        }
        const uploadbeds = await multipleFileUpload(req.files, { name, price, des });
        res.status(200).send(uploadbeds);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

{/* get all multiple beds */ }
export const getAllMultipleFiles = async (req: Request, res: Response) => {
    try {
        const response = await getMultipleFilesService();
        res.status(200).send({ response });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

{/* get multiple beds by id*/ }
export const getAllMultipleFilesById = async (req: Request, res: Response) => {
    try {
        const response = await getMultipleFilesByIdService(req.params.id);
        res.status(200).json({ response });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

{/* delete multiple beds by id*/ }
export const deleteMultipleFiles = async (req: Request, res: Response) => {
    try {
        const deleteFile = await deleteFileService(req.params.id);
        res.status(200).json({ deleteFile });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

{/* update beds by id*/ }
export const updateMultipleFiles = async (req: Request, res: Response) => {
    try {
        const updateFiles = await multiplefile.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true }
        );
        res.status(200).json({ updateFiles });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}