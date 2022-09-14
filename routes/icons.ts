import { Router } from "express";
import upload from "../config/multer";
import { uploadIcon } from "../controller";
import accessoriesIcons from "../models/accessoriesIcons";

import fs from "fs";
import { isValidObjectId } from "mongoose";
import path from "path";

const router = Router();

router.get("/accessories", (req, res) => {
    const getColorIcons = accessoriesIcons.find({});
    getColorIcons.exec((err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

router.post("/accessories", upload.single("image"), async (req, res) => {
    try {
        const { label, value, type } = req.body;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "icon is required",
            });
        }

        if (!label || !value || !type) {
            fs.unlinkSync(req.file.path);
            return res.status(400).send({
                success: false,
                message: "label, value and type are required",
            });
        }

        const findDuplicatecolorIcon = await accessoriesIcons.findOne({
            value: value,
            type: type,
        });

        if (findDuplicatecolorIcon) {
            fs.unlinkSync(req.file.path);
            return res.status(400).send({
                success: false,
                message: "Value already exists & must be unique",
            });
        }

        const getUrl = await uploadIcon(req.file, value);
        const accessoriesIcon = new accessoriesIcons({
            label: label,
            value: value,
            image: getUrl,
            type: type,
        });

        accessoriesIcon.save((err, data) => {
            if (err) throw err;
            res.send(data);
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send(error);
    }
});

router.get("/accessories/:type", (req, res) => {
    const { type } = req.params;
    const getColorIcons = accessoriesIcons.find({ type: type });

    getColorIcons.exec((err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

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

router.patch("/update/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const file = req.file ? req.file : undefined;
    const { label, value, type } = req.body;

    if (!id || !isValidObjectId(id)) {
        if (file) {
            fs.unlinkSync(file.path);
        }
        return res.status(400).send({
            success: false,
            message: "valid id is required",
        });
    }

    try {
        const imageUrl = await uploadIcon(file, value);
        await accessoriesIcons
            .findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        label: label,
                        value: value,
                        type: type,
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
                    if (fs.existsSync(pathname)) {
                        fs.unlinkSync(pathname);
                    }
                }

                res.send(data);
            })
            .catch((err) => {
                if (file) {
                    fs.unlinkSync(file.path);
                }
                res.status(500).send(err);
            });
    } catch (error) {
        if (file) {
            fs.unlinkSync(file.path);
        }
        res.status(500).send(error);
    }
});

router.delete("/accessories/:id", (req, res) => {
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
