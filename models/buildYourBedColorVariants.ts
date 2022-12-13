import { Document, model, Schema } from "mongoose";

export interface BedColorVarient extends Document {
  _id: string;
  color: string;
  price?: number;
  image: string;
  headboard: [
    {
      _id: string;
      name: string;
      price: string;
      image: string;
    }
  ];
  storage: [
    {
      _id: string;
      name: string;
      price: string;
      image: string;
    }
  ];
  feet: [
    {
      _id: string;
      name: string;
      price: string;
      image: string;
    }
  ];
  mattress: [
    {
      _id: string;
      name: string;
      price: string;
      image: string;
    }
  ];
}

const bedVarientSchema = new Schema<BedColorVarient>(
  {
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
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
        image: {
          type: String,
          required: true,
        },
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
        image: {
          type: String,
          required: true,
        },
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
        image: {
          type: String,
          required: true,
        },
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
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

export default model<BedColorVarient>(
  "buildYourBedColorVariants",
  bedVarientSchema
);
