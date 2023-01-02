import { Request, Response } from "express";
import {
  createCouponService,
  deleteCouponService,
  getAllCouponsService,
  getCouponByIdService,
  getCouponByLabelService,
  updateCouponService,
} from "../services/coupon-services";
export const createCouponController = async (req: Request, res: Response) => {
  try {
    const { label, percent, max, description } = req.body;
    const coupon = await createCouponService({
      label,
      percent,
      max,
      description,
    });
    res.status(201).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllCouponsController = async (req: Request, res: Response) => {
  try {
    const coupon = await getAllCouponsService();
    res.status(200).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCouponByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const coupon = await getCouponByIdService(id);
    res.status(200).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCouponByLabelController = async (
  req: Request,
  res: Response
) => {
  try {
    const label = req.params.label;
    const coupon = await getCouponByLabelService(label);
    res.status(200).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCouponController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const coupon = await updateCouponService(id, payload);
    res.status(200).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteCouponController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const coupon = await deleteCouponService(id);
    res.status(200).json(coupon);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
