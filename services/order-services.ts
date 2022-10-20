import Order from "../models/orders";

//create order
export const createOrderService = async (order: any) => {
    const bed = 
    const newOrder = await Order.create(order);
    return newOrder;
};

//get order by id
export const getOrderByIdService = async (id: string) => {
    const order = await Order.findById(id);
    return order;
};

//get all orders
export const getAllOrdersService = async () => {
    const orders = await Order.find();
    return orders;
};

//update order
export const updateOrderService = async (id: string, order: any) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
        new: true,
    });
    return updatedOrder;
};

//delete order
export const deleteOrderService = async (id: string) => {
    const deletedOrder = await Order.findByIdAndDelete(id);
    return deletedOrder;
};
