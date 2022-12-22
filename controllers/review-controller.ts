import { Request, Response } from "express";
import {
  approveReviewService,
  createReviewService,
  deleteReviewService,
  denyReviewService,
  getReviewsAdminService,
  getReviewsByProductIdAdminService,
  getReviewsByProductIdService,
  getReviewsService,
} from "../services/review-services";

export const createReviewController = async (req: Request, res: Response) => {
  try {
    const { name, email, review, images, ratings = 1, productId } = req.body;

    if (!name || !email || !review || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const createReview = await createReviewService({
      name,
      email,
      review,
      images,
      ratings,
      productId,
    });
    res.status(200).json(createReview);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getReviewsAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const reviews = await getReviewsAdminService();
    res.status(200).json({ reviews });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getReviewsByProductIdAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const reviews = await getReviewsByProductIdAdminService(id);
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getReviewsByProductIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const reviews = await getReviewsByProductIdService(id);
    res.status(200).json({ reviews });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await getReviewsService();
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const approveReviewController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const review = await approveReviewService(id);
    res.status(200).json(review);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const declineReviewController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const review = await denyReviewService(id);
    res.status(200).json(review);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const review = await deleteReviewService(id);
    res.status(200).json(review);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
