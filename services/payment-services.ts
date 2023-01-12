import stripe from "stripe";
import { getDiscountCouponPrice } from "../utils/GetDiscountPrice";
import { getCouponByIdService } from "./coupon-services";
const sdk = require("api")("@afterpay-online/v2.2#1xm4b2plar2mo2h");

const stripeClient = new stripe(
  process.env.STRIPE_SECRET_KEY as any,
  undefined as any
);

export const createCheckoutSessionService = async (
  line_items: any,
  couponId: string
) => {
  if (couponId) {
    const coupon = await getCouponByIdService(couponId);
    if (coupon) {
      line_items?.map((item: any) => {
        return (item.price_data.unit_amount =
          getDiscountCouponPrice({
            percent: coupon.percent,
            max: coupon.max,
            price: item.price_data.unit_amount,
          }) * 100);
      });
    } else {
      line_items?.map((item: any) => {
        return (item.price_data.unit_amount =
          item.price_data.unit_amount * 100);
      });
    }
  }

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart?session_id={CHECKOUT_SESSION_ID}`,
  });
  return session;
};

export const createAfterpayCheckoutService = async (amount: any) => {
  sdk.auth();
  sdk
    .createCheckout1(
      {
        amount: { amount: "100.00", currency: "USD" },
        consumer: {
          givenNames: "Joe",
          surname: "Consumer",
          email: "test@example.com",
        },
        billing: {
          name: "Joe Consumer",
          line1: "123 Fake Street",
          postcode: "0000",
        },
        shipping: {
          name: "Joe Consumer",
          line1: "123 Fake Street",
          postcode: "0000",
        },
        merchant: {
          redirectConfirmUrl: "https://example.com/checkout/confirm",
          redirectCancelUrl: "https://example.com/checkout/cancel",
          popupOriginUrl: "https://example.com/cart",
        },
        taxAmount: { amount: "100.00", currency: "USD" },
        shippingAmount: { amount: "100.00", currency: "USD" },
      },
      {
        "user-agent": "Readme.io API Simulator",
      }
    )
    .then(({ data }: any) => console.log(data))
    .catch((err: any) => console.error(err));
};
