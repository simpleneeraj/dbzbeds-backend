import { Request, Response, Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import upload from "../config/multer";
import { resizeImageAndUpload } from "../controllers/image-upload-resizer";
import { isAdmin } from "../middlewares/authentication";
import accessoriesIcons from "../models/accessoriesIcons";
import beds from "../models/beds";
import bedsVariants from "../models/bedsVariants";

const router = Router();

//GET BED VARIANT BY ID
router.get("/get-bed-variant/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({
                success: false,
                message: "ID is required",
            });
        }
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid ID provided." });
        }

        const getBedVariant = await bedsVariants.findById(id);

        if (!getBedVariant) {
            return res.status(400).json({ message: "No Bed Variant Found" });
        }

        res.status(200).json(getBedVariant);
    } catch (error) {
        res.status(500).send(error);
    }
});
// GET INITIAL DATA
router.get("/", async (req, res) => {
    let { page = 1, limit = 8 } = req.query;

    page = Number(page);
    limit = limit > 50 ? 50 : Number(limit);

    try {
        const getAllBeds = await beds
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .lean();

        //Get Total Pages

        const totalBedsCount = await beds.countDocuments({});
        const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

        res.json({
            data: getAllBeds,
            totalPages: pages,
            nextPage: page < pages ? page + 1 : null,
        });
    } catch (error: any) {
        res.status(500).send(error);
    }
});

// GET ALL BEDS WITH BASE IMAGE
router.get("/get-all-beds-with-base-image", async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    try {
        const bedsWithBaseImage = (await beds
            .find({ "variants.0": { $exists: true } })
            .populate({
                path: "variants",
                select: "_id accessories.color size price image",
                perDocumentLimit: 1,
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(limit) * (Number(page) - 1))
            .lean()) as any;

        bedsWithBaseImage.map((bed: any) => {
            if (bed && bed?.variants[0]?.image) {
                bed.image = bed?.variants[0]?.image;
                bed.price = bed?.variants[0]?.price;
            }
        });
        //Get Total Pages

        const totalBedsCount = await beds.countDocuments({
            "variants.0": { $exists: true },
        });
        const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

        res.json({
            data: bedsWithBaseImage,
            totalPages: pages,
            nextPage: Number(page) < pages ? Number(page) + 1 : null,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/get-all-beds-with-base-image-admin", async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    try {
        const bedsWithBaseImage = (await beds
            .find({})
            .populate({
                path: "variants",
                select: "_id accessories.color size price image",
                perDocumentLimit: 1,
            })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(limit) * (Number(page) - 1))
            .lean()) as any;

        bedsWithBaseImage.map((bed: any) => {
            if (bed && bed?.variants[0]?.image) {
                bed.image = bed?.variants[0]?.image;
                bed.price = bed?.variants[0]?.price;
            }
        });

        //Get Total Pages

        const totalBedsCount = await beds.countDocuments({
            "variants.0": { $exists: true },
        });
        const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

        res.json({
            data: bedsWithBaseImage,
            totalPages: pages,
            nextPage: Number(page) < pages ? Number(page) + 1 : null,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET BED BY ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { size } = req.query;
    try {
        if (size) {
            const getCurrentSizeBed = (await beds
                .findOne({ _id: id })
                .populate({
                    path: "variants",
                    populate: {
                        path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
                        select: "label value image",
                    },
                    match: { size },
                })
                .lean()) as any;
            const getAllbedSizes = (await beds
                .findOne({ _id: id }, { variants: 1, _id: 0 })
                .populate({
                    path: "variants",
                    select: "size -_id",
                })
                .lean()) as any;

            getCurrentSizeBed.availabeSizes = await Promise.all(
                getAllbedSizes?.variants?.map(
                    async (item: any) =>
                        await accessoriesIcons.findOne({
                            value: item.size,
                        })
                )
            );

            res.send(getCurrentSizeBed);
        } else {
            const getAllBeds = await beds
                .findOne({ _id: id })
                .populate("variants");
            res.json(getAllBeds);
        }
    } catch (error: any) {
        res.status(500).send(error);
    }
});
//UPLOAD NEW BED

router.post("/create", isAdmin, async (req: Request, res: Response) => {
    const { name, description, categories } = req.body;
    if (!name) {
        return res
            .status(404)
            .json({ message: "Product name cannot be empty" });
    }
    try {
        const createBed = await beds.create({
            name,
            description,
            categories: Array.isArray(categories) ? categories : undefined,
        });
        res.json({
            message: "Bed Created Successfully",
            data: createBed,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//ADD/CREATE BED VARIANTS
router.post("/add-bed/:id", isAdmin, async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    if (!req.body?.size) {
        return res.status(400).json({ message: "Bed Size cannot be empty." });
    }

    const bedFind = await beds
        .findOne({ _id: id })
        .populate("variants", "size")
        .lean();

    if (!bedFind) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    //CHECKING FOR DUPLICATE BED SIZES (START)
    const bedVariants = (bedFind && bedFind.variants) || [];

    const findDuplicateBedSize = bedVariants.find(
        (variant: any) => variant.size == req.body.size
    );

    if (findDuplicateBedSize) {
        return res.status(400).json({ message: "Size Already Exists" });
    }
    //CHECKING FOR DUPLICATE BED SIZES (END)

    bedsVariants.create(req.body, async (err: any, data: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        await beds.findByIdAndUpdate(id, {
            $push: {
                variants: data._id,
            },
        });
        res.status(200).json({
            message: "Bed Added Successfully",
            data,
        });
    });
});

//UPDATE BED VARIANTS
router.patch("/update-bed-variant/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const { size, image, price, accessories } = req.body;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    const findBedVarient = bedsVariants.findById(id);

    if (!findBedVarient) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    const updatedBed = await bedsVariants.findByIdAndUpdate(
        { _id: id },
        {
            size,
            image,
            price,
            accessories,
        },
        {
            new: true,
        }
    );

    res.status(200).json({
        message: "Bed Variant Updated Succesfully",
        data: updatedBed,
    });
});

//Upload image
router.post(
    "/upload-image",

    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send({
                    success: false,
                    message: "IMAGE is required",
                });
            }
            const imageUploadUrl = await resizeImageAndUpload(req.file, "red");
            res.send(imageUploadUrl);
        } catch (error) {
            res.status(500).send(error);
        }
    }
);

// UPDATE BED BY ID
router.patch("/update-bed/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID provided." });
    }

    try {
        const updatedData = await beds.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                categories: Array.isArray(req.body.categories)
                    ? req.body.categories
                    : undefined,
            },
            {
                new: true,
            }
        );
        res.json({ message: "Bed Updated Succesfully", data: updatedData });
    } catch (error: any) {
        res.status(500).send(error);
    }
});

// DELETE BED BY ID
router.delete("/delete-bed/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBed = await beds.findByIdAndDelete(id);
        res.json({
            message: "Bed Deleted Succesfully",
            data: deletedBed,
        });
    } catch (error: any) {
        res.status(500).send(error);
    }
});

// DELETE VARIANT BY ID
router.delete("/delete-bed-variant/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBed = await bedsVariants.findByIdAndDelete(id);
        res.json({
            message: "Bed Variant Deleted Succesfully",
            data: deletedBed,
        });
    } catch (error: any) {
        res.status(500).send(error);
    }
});

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
