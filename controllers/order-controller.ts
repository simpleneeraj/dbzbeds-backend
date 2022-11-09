import { Request, Response } from "express";
import { AcceptedOrderStatus, orderStatus } from "../constants/OrderStatus";
import {
    sendEmailWithTemplate,
    sendOrderDetailsService,
} from "../services/email-services";
import {
    createOrderService,
    deleteOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateOrderService,
    updateOrderStatusService,
} from "../services/order-services";
import { orderStatusTemplate } from "../templates/order-status";

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

//update order status
export const updateOrderStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            !req?.body?.status ||
            !AcceptedOrderStatus.includes(req?.body?.status)
        ) {
            res.status(400).json({ error: "Invalid Order Status" });
        }

        const order = await updateOrderStatusService(
            req.params.id,
            req.body?.status
        );
        res.status(200).json({ order });
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const sendOrderDetaisEmailController = async (
    req: Request,
    res: Response
) => {
    try {
        const orderEmail = await sendOrderDetailsService(
            req.body.email,
            req.body.message
        );
        res.status(200).json({ orderEmail: orderEmail });
    } catch (error) {
        res.status(400).json({ error });
    }
};
