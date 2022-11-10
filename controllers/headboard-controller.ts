import { Request, Response } from "express";
import {
    createHeadboardService,
    deleteHeadboardService,
    getAllHeadboardsService,
    getHeadboardByIdService,
    updateHeadboardService,
} from "../services/headboard-services";

//create headboard controller
export const createHeadboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, description, categories, variants } = req.body;

        const headboard = await createHeadboardService({
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

        res.status(201).json({ headboard });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get headboard by id controller
export const getHeadboardByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const headboard = await getHeadboardByIdService(req.params.id);
        res.status(200).json(headboard);
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get all headboards controller
export const getAllHeadboardsController = async (
    req: Request,
    res: Response
) => {
    try {
        const headboards = await getAllHeadboardsService();
        res.status(200).json({ headboards });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//update headboard controller
export const updateHeadboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, description, categories, variants } = req.body;

        const headboard = await updateHeadboardService(req.params.id, {
            name,
            description,
            categories,
            variants,
        });

        res.status(200).json({ headboard });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//delete headboard controller
export const deleteHeadboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const headboard = await deleteHeadboardService(req.params.id);
        res.status(200).json({ headboard });
    } catch (error) {
        res.status(400).json({ error });
    }
};
