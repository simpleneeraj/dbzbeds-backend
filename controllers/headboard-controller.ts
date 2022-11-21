import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import headboards from "../models/headboards";
import headboardVariants from "../models/headboardVariants";
import {
    createHeadboardService,
    deleteHeadboardService,
    getAllHeadboardsService,
    getHeadboardByIdService,
    getHeadboardByIdServiceWithVariants,
    getHeadboardCountService,
    getHeadboardVariantByIdService,
    getHeadboardWithVariantService,
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
        const headboard = await getHeadboardByIdServiceWithVariants(
            req.params.id
        );

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

export const getAllHeadboardWithImageController = async (
    req: Request,
    res: Response
) => {
    try {
        const { page = 1, limit = 20 } = req.query as any;
        const headboards = await getHeadboardWithVariantService(page, limit);

        headboards?.map((headboard: any) => {
            if (headboard && headboard?.variants[0]?.image) {
                headboard.image = headboard?.variants[0]?.image;
                // headboard.price = headboard?.variants[0]?.price;
            }
        });

        //PAGINATION
        const totalHeadboardCount = await getHeadboardCountService({});
        const pages = Math.ceil(Number(totalHeadboardCount) / Number(limit));

        res.json({
            data: headboards,
            totalPages: pages,
            nextPage: Number(page) < pages ? Number(page) + 1 : null,
        });
    } catch (error: any) {
        res.status(400).json({ error: error?.message });
    }
};

export const createHeadboardVariantController = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    if (!req.body?.size) {
        return res.status(400).json({ message: "Bed Size cannot be empty." });
    }

    const headboardFind = await headboards
        .findOne({ _id: id })
        .populate("variants", "size")
        .lean();

    if (!headboardFind) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    //CHECKING FOR DUPLICATE BED SIZES (START)
    const allHeadboardVariants =
        (headboardFind && headboardFind.variants) || [];

    const findDuplicateBedSize = allHeadboardVariants.find(
        (variant: any) => variant.size == req.body.size
    );

    if (findDuplicateBedSize) {
        return res.status(400).json({ message: "Size Already Exists" });
    }
    //CHECKING FOR DUPLICATE BED SIZES (END)

    headboardVariants.create(req.body, async (err: any, data: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        await headboards.findByIdAndUpdate(id, {
            $push: {
                variants: data._id,
            },
        });
        res.status(200).json({
            message: "Headboard Added Successfully",
            data,
        });
    });
};

export const updateHeadboardVariantController = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    const findHeadboardVarient = headboardVariants.findById(id);

    if (!findHeadboardVarient) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    const updateHeadboard = await headboardVariants.findByIdAndUpdate(
        { _id: id },
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json({
        message: "Bed Variant Updated Succesfully",
        data: updateHeadboard,
    });
};

export const getHeadboardVariantByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        const findHeadboardVarient = await getHeadboardVariantByIdService(id);

        res.status(200).json(findHeadboardVarient);
    } catch (error) {
        res.status(400).json({ error });
    }
};
