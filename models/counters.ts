//counter schema

import { Schema, model } from "mongoose";

const counterSchema = new Schema(
    {
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Counter = model("Counter", counterSchema);

export default Counter;
