import { Router } from "express";
import beds from "../models/beds";
import bedsVariants from "../models/bedsVariants";

const router = Router();



router.get("/", async (req, res) => {
    try {
        const getAllBeds = await beds.find({}).populate("variants");

        res.json({
            data: getAllBeds
        })
    } catch (error: any) {
        res.status(500).send(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const getAllBeds = await beds.findOne({ _id: id }).populate("variants");

        res.json({
            data: getAllBeds
        })
    } catch (error: any) {
        res.status(500).send(error)
    }
})



//UPLOAD BED

router.post("/create", async (req, res) => {
    const { name, description, categories } = req.body;

    if (!name) {
        return res.status(404).json({ message: "Product name cannot be empty" })
    }

    try {
        const createBed = await beds.create({ name, description, categories: Array.isArray(categories) ? categories : undefined })
        res.json({
            message: "Bed Created Successfully",
            data: createBed,
        })


    } catch (error) {
        res.status(500).send(error)

    }

})


//ADD/CREATE BED VARIANTS
router.post("/add-bed/:id", async (req, res) => {
    const { id } = req.params;
    const { color, storage, headboard, feet, mattress } = req.body;



    const bedFind = await beds.findOne({ _id: id });


    if (!bedFind) {
        return res.status(404).json({ message: "Invalid ID provided." })
    }


    bedsVariants.create(req.body, async (err: any, data: any) => {
        if (err) {
            return res.status(500).send(err)
        }

        await beds.findByIdAndUpdate(id, {
            $push: {
                variants: data._id
            }
        })

        res.status(200).json({
            message: "Bed Added Successfully",
            data
        })
    });
})



export default router;


