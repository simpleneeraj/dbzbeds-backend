import { Request, Response } from "express";
import {
    createMattressService,
    getAllMattressesService,
    getMattressByIdService,
    updateMattressService,
    deleteMattressService,
} from "../services/mattresses-services";

//create mattress controller
export const createMattressController = async (req: Request, res: Response) => {
    try {
        const { name, description, categories, variants } = req.body;

        const mattress = await createMattressService({
            name,
            description,
            categories,
            variants,
        });

        //validations
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        res.status(201).json({ mattress });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get mattress by id controller
export const getMattressByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const mattress = await getMattressByIdService(req.params.id);
        res.status(200).json(mattress);
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get all mattresses controller
export const getAllMattressesController = async (
    req: Request,
    res: Response
) => {
    try {
        const mattresses = await getAllMattressesService();
        res.status(200).json({ mattresses });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//update mattress controller
export const updateMattressController = async (req: Request, res: Response) => {
    try {
        const { name, description, categories, variants } = req.body;

        const mattress = await updateMattressService(req.params.id, {
            name,
            description,
            categories,
            variants,
        });

        res.status(200).json({ mattress });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//delete mattress controller
export const deleteMattressController = async (req: Request, res: Response) => {
    try {
        const mattress = await deleteMattressService(req.params.id);
        res.status(200).json({ message: "Mattress deleted" });
    } catch (error) {
        res.status(400).json({ error });
    }
};
