import { model, Schema } from "mongoose";

const bedSchema = new Schema(
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
                ref: "bedsVariants",
            },
        ],
        slug: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
                required: false,
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

export default model("beds", bedSchema);
