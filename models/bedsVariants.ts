import { Document, model, Schema } from "mongoose";

interface BedVarient extends Document {
    size: string;
    image: string;
    price: {
        basePrice: number;
        salePrice: number;
    };
    accessories: {
        color: [
            {
                name: string;
                image: string;
            }
        ];
        headboard: [
            {
                name: string;
                price: string;
            }
        ];
        storage: [
            {
                name: string;
                price: string;
            }
        ];
        feet: [
            {
                name: string;
                price: string;
            }
        ];
        mattress: [
            {
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
