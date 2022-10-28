import { Document, model, Schema } from "mongoose";

export interface BedVarient extends Document {
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
        headboard: [
            {
                _id: string;
                name: string;
                price: string;
            }
        ];
        storage: [
            {
                _id: string;
                name: string;
                price: string;
            }
        ];
        feet: [
            {
                _id: string;
                name: string;
                price: string;
            }
        ];
        mattress: [
            {
                _id: string;
                name: string;
                price: string;
            }
        ];
    };
}

const bedVarientSchema = new Schema<BedVarient>(
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

            headboard: [
                {
                    name: {
                        type: Schema.Types.ObjectId,
                        ref: "accessoriesIcons",
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    // image: {
                    //     type: String,
                    //     required: true,
                    // },
                },
            ],
            storage: [
                {
                    name: {
                        type: Schema.Types.ObjectId,
                        ref: "accessoriesIcons",
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    // image: {
                    //     type: String,
                    //     required: true,
                    // },
                },
            ],
            feet: [
                {
                    name: {
                        type: Schema.Types.ObjectId,
                        ref: "accessoriesIcons",
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    // image: {
                    //     type: String,
                    //     required: true,
                    // },
                },
            ],
            mattress: [
                {
                    name: {
                        type: Schema.Types.ObjectId,
                        ref: "accessoriesIcons",
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    // image: {
                    //     type: String,
                    //     required: true,
                    // },
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

export default model<BedVarient>("bedsVariants", bedVarientSchema);
