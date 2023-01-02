import { model, Schema, Document } from "mongoose";

interface Coupons extends Document {
  label: string;
  percent: number;
  max: number;
  description: string;
}

const CouponsSchema = new Schema<Coupons>(
  {
    label: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Coupons>("coupons", CouponsSchema);
