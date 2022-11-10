import { model, Schema } from "mongoose";

export interface IMattress {
    _id?: string;
    name: string;
    description: string;
    categories?: string[];
    variants?: string[];
    isDraft?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const mattressSchema = new Schema<IMattress>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        categories: [
            {
                type: String,
                required: false,
            },
        ],
        variants: [
            {
                type: Schema.Types.ObjectId,
                ref: "mattressVariants",
            },
        ],
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

export default model<IMattress>("mattresses", mattressSchema);
