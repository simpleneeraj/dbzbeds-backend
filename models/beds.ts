import { model, Schema } from "mongoose"


const bedSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    variants: [{
        type: Schema.Types.ObjectId,
        ref: "bedsVariants"
    }],
    categories: [{
        type: String,
        required: false,
    }]

}, {
    timestamps: true
})

export default model("beds", bedSchema);