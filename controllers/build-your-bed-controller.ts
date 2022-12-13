import { Request, Response } from "express";
import {
  createBuildYourBed,
  createBuildYourBedVariants,
  createBuildYourBedVariantsWithColor,
  deleteBuildYourBed,
  getBuildYourBed,
  getBuildYourBeds,
  updateBuildYourBed,
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
