import { Document, model, Schema } from "mongoose";

export interface mattressVariant extends Document {
    _id: string;
    size: string;
    image: string;
    price: {
        basePrice: number;
        salePrice: number;
    };
    isDraft: boolean;
}

const mattressVariantSchema = new Schema<mattressVariant>(
    {
        size: {
            type: String,
            required: true,
        },
        image: {
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
    },
    {
        timestamps: true,
    }
);

export default model<mattressVariant>(
    "mattressVariants",
    mattressVariantSchema
);
