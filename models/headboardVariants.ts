import { Document, model, Schema } from "mongoose";

export interface HeadboardVariant extends Document {
    _id: string;
    size: string;
    image: string;
    price: {
        basePrice: number;
        salePrice: number;
    };
    isDraft: boolean;
    accessories: {
        color: [
            {
                _id: string;
                name: string;
                image: string;
            }
        ];
    };
}

const HeadboardVariantSchema = new Schema<HeadboardVariant>(
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
        accessories: {
            color: [
                {
                    name: {
                        type: Schema.Types.ObjectId,
                        ref: "accessoriesIcons",
                    },
                    image: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

export default model<HeadboardVariant>(
    "headboardVariants",
    HeadboardVariantSchema
);
