import { model, Schema } from "mongoose"



// quantity: 1,
// price: 98.9,
// size: 3,
// options: {
//     image: "images/All-beds.png",
//     color: "grey light",
//     headBoard: "no",
//     storage: "single",
//     feet: "no",
//     matters: "no",
// },

const bedVarientSchema = new Schema({
    size:
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
    }
    ,
    accessories: {
        color: [
            {
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
            }
        ],

        headboard: [{
            name: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            // image: {
            //     type: String,
            //     required: true,
            // },


        }],
        storage: [{
            name: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            // image: {
            //     type: String,
            //     required: true,
            // },

        }],
        feet: [{
            name: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            // image: {
            //     type: String,
            //     required: true,
            // },

        }],
        mattress: [{
            name: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            // image: {
            //     type: String,
            //     required: true,
            // },
        }],
    }
}, {
    timestamps: true
})

export default model("bedsVariants", bedVarientSchema);