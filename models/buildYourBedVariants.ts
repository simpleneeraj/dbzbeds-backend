import { Document, model, Schema } from "mongoose";
import { BedColorVarient } from "./buildYourBedColorVariants";

export interface BedVarient extends Document {
  _id: string;
  size: string;
  price: {
    basePrice: number;
    salePrice: number;
  };
  isDraft: boolean;
  colors: any;
}

const bedVarientSchema = new Schema<BedVarient>(
  {
    size: {
      type: String,
      required: true,
    },
    price: {
      basePrice: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
    },
    isDraft: {
      type: Boolean,
      required: true,
      default: false,
    },
    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: "buildYourBedColorVariants",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<BedVarient>("buildYourBedVariants", bedVarientSchema);
