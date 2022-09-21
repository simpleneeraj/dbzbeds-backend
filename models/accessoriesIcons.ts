import { model, Schema, Document } from "mongoose";

interface Accessories extends Document {
    label: string;
    value: string;
    type: string;
    image: string;
    size: string;
}

const accessoriesIconSchema = new Schema<Accessories>(
    {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<Accessories>("accessoriesIcons", accessoriesIconSchema);
