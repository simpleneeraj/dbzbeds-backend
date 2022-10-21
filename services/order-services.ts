import Order from "../models/orders";
import {
    findAccessoriesLocallyService,
    findBedVariantWithProductNameByIdService,
} from "./accessories-services";

//create order
export const createOrderService = async (order: any) => {
    if (order?.orderItems && order?.orderItems?.length > 0) {
        const test = order.orderItems.map(async (orderItem: any) => {
            const bedVariantWithProductName =
                await findBedVariantWithProductNameByIdService(
                    orderItem?.bedId,
                    orderItem._id
                );

            if (bedVariantWithProductName) {
                const data = findAccessoriesLocallyService(
                    bedVariantWithProductName as any,
                    orderItem?.headboard,
                    orderItem?.feet,
                    orderItem?.mattress,
                    orderItem?.color,
                    orderItem?.storage
                );

                return {
                    name: data?.name,
                    categories: data?.categories,
                    size: data?.variant?.size,
                    image: data?.variant?.image,
                    quantity: orderItem?.quantity,
                    accessories: {
                        headboard: data?.headboard,
                        mattress: data?.mattress,
                        color: data?.color,
                        storage: data?.storage,
                        feet: data?.feet,
                    },
                    price: data?.totalPrice * Number(orderItem?.quantity),
                };
            }
        });

        order.orderItems = await Promise.all(test);
        order.totalPrice = order.orderItems.reduce(
            (acc: any, item: any) => acc + item.price,
            0
        );

        const newOrder = await Order.create(order);
        return newOrder;
    }
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
