import { orderStatus } from "../constants/OrderStatus";
import Order from "../models/orders";
import { orderStatusTemplate } from "../templates/order-status";
import {
  findAccessoriesLocallyService,
  findBedVariantWithProductNameByIdService,
} from "./accessories-services";
import { sendEmailWithTemplate } from "./email-services";

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

        console.log({ total: data?.totalPrice });

        return {
          name: data?.name,
          categories: data?.categories,
          image: data?.variant?.image,
          quantity: orderItem?.quantity,
          price: data?.totalPrice * Number(orderItem?.quantity),
          accessories: {
            size: data?.size,
            headboard: data?.headboard,
            mattress: data?.mattress,
            color: data?.color,
            storage: data?.storage,
            feet: data?.feet,
          },
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
  const orders = await Order.find().sort("-createdAt");
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

//update order status
export const updateOrderStatusService = async (id: string, status: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { ["payment.status"]: status },
    { new: true }
  );

  if (status === orderStatus.Cancelled) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Cancelled",
      message: `Notification to let you know – order #${updatedOrder?.orderId}
            belonging to <strong>${updatedOrder?.user?.firstName} ${updatedOrder?.user?.lastName}</strong> has been cancelled:`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Cancelled"
    );
  } else if (status === orderStatus.Processing) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Processing",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been processed. We will send you an email when your order has been shipped. You can track your order by clicking the link below.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Processing"
    );
  } else if (status === orderStatus.Completed) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Completed",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been payment has been completed. Thank you for shopping with us. We will send you an email when your order has been shipped. You can track your order by clicking the link below.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Completed"
    );
  } else if (status === orderStatus.Delivered) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Delivered",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been delivered. Thank you for shopping with us.`,
    });
  } else if (status === orderStatus.PendingPayment) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Payment Pending",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been payment has been pending. Please pay to complete your order.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Payment Pending"
    );
  } else if (status === orderStatus.Refunded) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Refunded",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order money has been refunded to your account , Thank you for shopping with us.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Refunded"
    );
  } else if (status === orderStatus.OnHold) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order On Hold",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been placed on hold, due to some payment issues. Please contact us for more details.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order On Hold"
    );
  } else if (status === orderStatus.Failed) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Payment Failed",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order payment has been failed, Please try again.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Payment Failed"
    );
  } else if (status === orderStatus.Pending) {
    const template = orderStatusTemplate({
      orderId: updatedOrder?.orderId as any,
      orderAt: updatedOrder?.createdAt as any,
      orderItems: updatedOrder?.orderItems as any,
      totalPrice: updatedOrder?.totalPrice || 0,
      shippingPrice: 0,
      user: updatedOrder?.user as any,
      shippingAddress: updatedOrder?.shippingAddress as any,
      billingAddress: updatedOrder?.shippingAddress as any,
      subject: "Order Pending",
      message: `Hi ${updatedOrder?.user?.firstName}, Your order has been placed on pending, Please contact us for more details.`,
    });

    await sendEmailWithTemplate(
      updatedOrder?.user?.email as any,
      template,
      "Order Pending"
    );
  }

  return updatedOrder;
};
