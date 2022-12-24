import { Request, Response } from "express";
import {
  approveReviewService,
  createReviewService,
  deleteReviewService,
  denyReviewService,
  getPaginationsService,
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
    const { limit = 10, page = 1 } = req.query;
    const reviews = await getReviewsAdminService();
    const pagination = await getPaginationsService(
      {},
      Number(limit),
      Number(page)
    );
    res.status(200).json({ reviews, ...pagination });
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
    const { limit = 10, page = 1 } = req.query;
    const reviews = await getReviewsByProductIdAdminService(id);
    const pagination = await getPaginationsService(
      { _id: id },
      Number(limit),
      Number(page)
    );
    res.status(200).json({ reviews, ...pagination });
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
    const { limit = 10, page = 1 } = req.query;

    const reviews = await getReviewsByProductIdService(id);
    const pagination = await getPaginationsService(
      { _id: id, isApproved: true },
      Number(limit),
      Number(page)
    );
    res.status(200).json({ reviews, ...pagination });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const reviews = await getReviewsService();
    const pagination = await getPaginationsService(
      { isApproved: true },
      Number(limit),
      Number(page)
    );
    res.status(200).json({ reviews, ...pagination });
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
