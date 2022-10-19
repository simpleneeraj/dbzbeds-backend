//orders schema
import { Schema, model } from "mongoose";
import Counter from "./counters";

export interface IOrder extends Document {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };

    orderId: Number;

    orderItems: [
        {
            name: string;
            size: string;
            quantity: number;
            accessories: string[];
            price: number;
            image: string;
        }
    ];

    totalPrice: number;

    shippingAddress: {
        address: string;
        townCity: string;
        postalCode: string;
        country: string;
        companyName: string;
    };

    orderNotes: string;

    payment: {
        paymentMethod: string;
        paymentResult: {
            id: string;
            status: string;
            update_time: string;
            email_address: string;
        };
    };

    isDelivered: boolean;

    deliveredAt: Date;

    createdAt: Date;

    updatedAt: Date;

    __v: number;
}

const orderSchema = new Schema<IOrder>(
    {
        user: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },

        orderId: { type: Number, required: false },

        orderItems: [
            {
                name: { type: String, required: true },
                size: { type: String, required: true },
                quantity: { type: Number, required: true },
                accessories: { type: Array, required: true },
                price: { type: Number, required: true },
                image: { type: String, required: true },
            },
        ],

        totalPrice: { type: Number, required: true },

        shippingAddress: {
            address: { type: String, required: false },
            townCity: { type: String, required: false },
            postalCode: { type: String, required: false },
            country: { type: String, required: false },
            companyName: { type: String, required: false },
        },

        orderNotes: { type: String, required: false },

        payment: {
            paymentMethod: { type: String, required: true },
            paymentResult: {
                id: { type: String },
                status: { type: String },
                update_time: { type: String },
                email_address: { type: String },
            },
            status: { type: String, required: true, default: "Processing" },
        },

        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },

        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.pre("save", function (next) {
    Counter.findByIdAndUpdate(
        { _id: "orderId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
        (err, counter) => {
            if (err) {
                return next(err);
            }
            this.orderId = counter.seq;
            next();
        }
    );
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
