import stripe from "stripe";

const stripeClient = new stripe(
    process.env.STRIPE_SECRET_KEY as any,
    undefined as any
);

export const createCheckoutSessionService = async (line_items: any) => {
    const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/order/success`,
        cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
    });
    return session;
};

// export const createCheckoutSessionService = async ({ amount, id }: any) => {
//     const payment = await stripeClient.paymentIntents.create({
//         amount: amount,
//         currency: "USD",
//         description: "Your Company Description",
//         payment_method: id,
//         confirm: true,
//     });
//     return payment;
// };
