import { Router } from "express";
import upload from "../config/multer";
import { uploadBedImage } from "../controller";
import beds from "../models/beds";
import bedsVariants from "../models/bedsVariants";

const router = Router();

// GET INITIAL DATA 
router.get("/", async (req, res) => {
    let { page = 1, limit = 8 } = req.query;

    page = Number(page);
    limit = limit > 50 ? 50 : Number(limit);

    try {
        const getAllBeds = await beds.find({}).sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1)).lean();

        //Get Total Pages

        const totalBedsCount = await beds.countDocuments({});
        const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

        res.json({
            data: getAllBeds,
            totalPages: pages,
            nextPage: page < pages ? page + 1 : null
        })
    } catch (error: any) {
        res.status(500).send(error)
    }
})

// GET BED BY ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { size } = req.query;

    try {
        if (size) {
            const getCurrentSizeBed = await beds.findOne({ _id: id }).populate({
                path: "variants",
                match: {
                    size
                }
            });
            res.send(
                getCurrentSizeBed
            )

        } else {
            const getAllBeds = await beds.findOne({ _id: id }).populate("variants");
            res.json(
                getAllBeds
            )
        }
    } catch (error: any) {
        res.status(500).send(error)
    }
})
//UPLOAD NEW BED

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


//Upload image
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        const imageUploadUrl = await uploadBedImage(req, res, "red");
        res.send(imageUploadUrl)
    } catch (error) {
        res.status(500).send(error);
    }
})



// UPDATE BED BY ID
router.patch("/update-bed/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const updatedData = await beds.updateOne({ _id: id },
            {
                name: req.body.name,
                description: req.body.description,
            },
            {
                new: true,
                upsert: true
            })
        res.json({
            data: updatedData
        })
    } catch (error: any) {
        res.status(500).send(error)
    }
})

// DELETE BED BY ID
router.delete("/delete-bed/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBed = await beds.deleteOne({ _id: id })
        res.json({
            data: deletedBed
        })
    } catch (error: any) {
        res.status(500).send(error)
    }
})

export default router;


/**
 * FOR IMAGE API
 */

//  const apiRoute = ({
//     onError(error, req, res) {
//       res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//     },
//     onNoMatch(req, res) {
//       res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//     },
//   });

//   router.use(upload.array('image'));

//   router.post(async (req, res) => {
//     const uploader = async (path) => await uploads(path, 'Images');
//     const urls = [];
//     const files = req.files;

//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath.url);
//       fs.unlinkSync(path);
//     }

//     res.status(200).json(urls);
//   });


//   export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };
