import { Request, Response } from "express";
import {
  createBuildYourBed,
  createBuildYourBedVariants,
  createBuildYourBedVariantsWithColor,
  deleteBuildYourBed,
  deleteBuildYourBedVariants,
  deleteBuildYourBedVariantsWithColor,
  getAllBuildYourBedVariantsWithColor,
  getBuildYourBed,
  getBuildYourBedBySize,
  getBuildYourBeds,
  getBuildYourBedVariants,
  getBuildYourBedVariantsWithColor,
  updateBuildYourBed,
  updateBuildYourBedVariants,
  updateBuildYourBedVariantsWithColor,
} from "../services/build-your-bed-services";

export const createBuildYourBedController = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = req.body;
    const bed = await createBuildYourBed(payload);
    res.status(201).json({
      message: "Bed Created Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const bed = await getBuildYourBed(id);
    res.status(200).json(bed);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedBySizeController = async (
  req: Request,
  res: Response
) => {
  try {
    const size = req.params.size;
    const bed = await getBuildYourBedBySize(size);
    res.status(200).json(bed);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedsController = async (
  req: Request,
  res: Response
) => {
  try {
    const beds = await getBuildYourBeds();
    res.status(200).json(beds);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedVariantsController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const beds = await getBuildYourBedVariants(id);
    res.status(200).json(beds);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedVariantsWithColorController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const beds = await getAllBuildYourBedVariantsWithColor(id);
    res.status(200).json(beds);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildYourBedVariantsWithColorByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const beds = await getBuildYourBedVariantsWithColor(id);
    res.status(200).json(beds);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateBuildYourBedController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const bed = await updateBuildYourBed(id, payload);
    res.status(200).json({
      message: "Bed Updated Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBuildYourBedController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const bed = await deleteBuildYourBed(id);
    res.status(200).json({
      message: "Bed Deleted Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createBuildYourBedVariantsController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("createBuildYourBedVariantsController");
    const id = req.params.id;
    const payload = req.body;
    const bed = await createBuildYourBedVariants(id, payload);
    res.status(200).json({
      message: "Bed Variants Created Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createBuildYourBedVariantsWithColorController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const bed = await createBuildYourBedVariantsWithColor(id, payload);
    res.status(200).json({
      message: "Bed Variants Created Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateBuildYourBedVariantsController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const bed = await updateBuildYourBedVariants(id, payload);
    res.status(200).json({
      message: "Bed Updated Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBuildYourBedVariantsController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const bed = await deleteBuildYourBedVariants(id);
    res.status(200).json({
      message: "Bed Deleted Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateBuildYourBedVariantsWithColorController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const bed = await updateBuildYourBedVariantsWithColor(id, payload);
    res.status(200).json({
      message: "Bed Updated Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBuildYourBedVariantsWithColorController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const bed = await deleteBuildYourBedVariantsWithColor(id);
    res.status(200).json({
      message: "Bed Deleted Successfully",
      data: bed,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
