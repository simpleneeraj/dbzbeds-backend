import { model, Schema, Document } from "mongoose";

interface Reviews extends Document {
  name: string;
  email: string;
  review: string;
  images: string[];
  isApproved: boolean;
  ratings: number;
  productId: string;
}

const reviewsSchema = new Schema<Reviews>(
  {
    name: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Reviews>("reviews", reviewsSchema);
