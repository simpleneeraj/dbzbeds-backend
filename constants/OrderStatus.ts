//Order Status
export const orderStatus = {
    PendingPayment: "PENDING_PAYMENT",
    Processing: "PROCESSING",
    OnHold: "ON_HOLD",
    Completed: "COMPLETED",
    Cancelled: "CANCELLED",
    Refunded: "REFUNDED",
    Failed: "FAILED",
    Pending: "PENDING",
    Delivered: "DELIVERED",
    Draft: "DRAFT",
};

export const AcceptedOrderStatus = [
    orderStatus.PendingPayment,
    orderStatus.Processing,
    orderStatus.OnHold,
    orderStatus.Completed,
    orderStatus.Cancelled,
    orderStatus.Refunded,
    orderStatus.Failed,
    orderStatus.Pending,
    orderStatus.Delivered,
];
