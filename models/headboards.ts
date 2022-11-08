import { model, Schema } from "mongoose";

const headboardSchema = new Schema(
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
                ref: "headboardVariants",
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

export default model("headboards", headboardSchema);
