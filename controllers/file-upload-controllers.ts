import { Request, Response, NextFunction } from "express";
import multiplefile from "../models/multiplefile";
import multipleFileUpload from "../services/image-service";


export const UploadMutipleImageController = async (req: Request, res: Response) => {
    try {
        const { name, price, des } = req.body;
        if (!name || !price || !des) {
            res.send(400).send("all fields are required {name,price,dec}")
        }
        const response = await multipleFileUpload(req.files, { name, price, des });
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error)
    }
}

export const getallMultipleFiles = async (req: Request, res: Response) => {
    try {
        const response = await multiplefile.find();
        res.status(200).send(response);
    } catch (error) {
     res.status(400).send(error);   
    }
}
