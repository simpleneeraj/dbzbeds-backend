import { model, Schema } from "mongoose";
import headboardVariants from "./headboardVariants";

export interface IHeadboard {
    _id?: string;
    name: string;
    description: string;
    categories?: string[];
    variants?: string[];
    isDraft?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const headboardSchema = new Schema<IHeadboard>(
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
                ref: headboardVariants,
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

export default model<IHeadboard>("headboards", headboardSchema);
