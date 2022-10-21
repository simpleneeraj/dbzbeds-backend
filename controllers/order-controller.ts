import { Request, Response } from "express";
import {
    createOrderService,
    deleteOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateOrderService,
} from "../services/order-services";

//create order controller
export const createOrderController = async (req: Request, res: Response) => {
    try {
        const order = await createOrderService(req.body);
        res.status(201).json({ order });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get order by id controller
export const getOrderByIdController = async (req: Request, res: Response) => {
    try {
        const order = await getOrderByIdService(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error });
    }
};

//get all orders controller
export const getAllOrdersController = async (req: Request, res: Response) => {
    try {
        const orders = await getAllOrdersService();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//update order controller
export const updateOrderController = async (req: Request, res: Response) => {
    try {
        const order = await updateOrderService(req.params.id, req.body);
        res.status(200).json({ order });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//delete order controller
export const deleteOrderController = async (req: Request, res: Response) => {
    try {
        const order = await deleteOrderService(req.params.id);
        res.status(200).json({ order });
    } catch (error) {
        res.status(400).json({ error });
    }
};
