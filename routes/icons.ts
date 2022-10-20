import { Router } from "express";
import upload from "../config/multer";
import accessoriesIcons from "../models/accessoriesIcons";
import { rm } from "fs/promises";
import { existsSync } from "fs";
import { isValidObjectId } from "mongoose";
import path from "path";
import beds from "../models/beds";
import { resizeIconAndUpload } from "../controllers/icon-upload-resizer";
import { isAdmin } from "../middlewares/authentication";

const router = Router();
// GET ALL ACCESSORIES
router.get("/accessories", (req, res) => {
    const getColorIcons = accessoriesIcons.find({});
    getColorIcons.exec((err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

// CREATE ICON
router.post("/accessories", upload.single("image"), async (req, res) => {
    try {
        let { label, value, type, size } = req.body;

        size = size ? size : undefined;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "IMAGE is required",
            });
        }

        if (!label || !value || !type) {
            return res.status(400).send({
                success: false,
                message: "label, value, and type are required",
            });
        }

        const findDuplicatecolorIcon = await accessoriesIcons.findOne({
            value: value,
            type: type,
            size, //color ,headboard, size
        });

        if (findDuplicatecolorIcon) {
            return res.status(400).send({
                success: false,
                message: "Value already exists & must be unique",
            });
        }

        const getUrl = await resizeIconAndUpload(req.file, value);

        const accessoriesIcon = new accessoriesIcons({
            label: label,
            value: value,
            image: getUrl,
            type: type,
            size: size,
        });

        accessoriesIcon.save((err, data) => {
            if (err) throw err;
            res.send(data);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET ALL ICONS BY TYPE
router.get("/accessories/all/:type", async (req, res) => {
    const { type } = req.params;
    const size = req.query.size as string;

    if (!type) {
        return res
            .status(400)
            .json({ success: false, message: "invalid params" });
    }

    if (size) {
        const getIcons = await accessoriesIcons.find({
            type: type,
            size: size,
        });
        res.send(getIcons);
    } else {
        const getIcons = await accessoriesIcons.find({ type: type }).lean();
        res.send(getIcons);
    }
});

// GET ICON BY ID AND TYPE
router.get("/accessories/:type/:id", async (req, res) => {
    const { type, id } = req.params;

    if (!type || !id) {
        return res
            .status(400)
            .json({ success: false, message: "invalid params" });
    }

    const getColorIcons = await accessoriesIcons.find({ type: type }).lean();
    if (type === "SIZE") {
        const getAllbedSizes = (await beds
            .findOne({ _id: id }, { variants: 1, _id: 0 })
            .populate({
                path: "variants",
                select: "size -_id",
            })
            .lean()) as any;

        const availableSizes = getColorIcons.filter((item: any) => {
            return !getAllbedSizes?.variants.find(
                (variant: any) => variant.size === item.value
            );
        });
        res.send(availableSizes);
    } else {
        res.send(getColorIcons);
    }
});

// GET ICONS BY ID

router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({
            success: false,
            message: "id is required",
        });
    }

    const getColorIcons = accessoriesIcons.findById(id);

    getColorIcons.exec((err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

// UPDATE ICONS BY ID
router.patch("/update/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const file = req.file ? req.file : undefined;
    const { label, value, type, size } = req.body;

    if (!id || !isValidObjectId(id)) {
        if (file) {
            await rm(file.path);
        }

        return res.status(400).send({
            success: false,
            message: "valid id is required",
        });
    }

    try {
        const imageUrl = await resizeIconAndUpload(req.file, value);
        await accessoriesIcons
            .findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        label: label,
                        value: value,
                        type: type,
                        size: size,
                        image: file ? imageUrl : undefined,
                    },
                },
                { multi: false, omitUndefined: true, new: false }
            )
            .then((data) => {
                if (file) {
                    // Delete old image
                    const pathname = path.join(
                        __dirname,
                        `../uploads/icons/${data?.image.split("/").pop()}`
                    );
                    if (existsSync(pathname)) {
                        rm(pathname);
                    }
                }

                res.send(data);
            })
            .catch(async (err) => {
                if (file) {
                    await rm(file.path);
                }
                res.status(500).send(err);
            });
    } catch (error) {
        if (file) {
            await rm(file.path);
        }
        res.status(500).send(error);
    }
});

router.delete("/accessories/:id", isAdmin, (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid id",
            });
        }

        const deleteColorIcon = accessoriesIcons.findByIdAndDelete(id);

        deleteColorIcon.exec((err, data) => {
            if (err) throw err;
            res.send(data);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
