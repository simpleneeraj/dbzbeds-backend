import path from "path";
import sharp from "sharp";
import fs, { PathLike } from "fs";
import { Request, Response } from "express";
import { uploadPath } from "../config/multer";
import { mkdir } from "fs";

export const uploadBedImage = async (
    req: Request,
    res: Response,
    color: string
) => {
    try {
        const time = new Date().getTime();
        const fileName = color + "-beds-" + time + ".webp";

        if (req?.file) {
            let compressImagePath = path.join(
                __dirname,
                "../",
                "uploads",
                "beds",
                fileName
            );

            try {
                sharp(req.file?.path)
                    .resize(1920, 1080, {
                        fit: "cover",
                    })
                    .webp({ quality: 70 })
                    .toFile(compressImagePath, async (err) => {
                        if (err) {
                            fs.unlinkSync(req.file?.path as PathLike);
                            res.json({ success: false, message: err });
                        } else {
                            console.log("running");
                            fs.unlinkSync(req.file?.path as PathLike);
                        }
                    });

                return {
                    success: true,
                    message: "Image uploaded successfully",
                    url: `${process.env.BASE_URL}/api/beds-image/${fileName}`,
                };
            } catch (error) {
                res.status(500).send(error);
            }
        } else {
            return {
                success: false,
                message: "no file provided",
            };
        }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export const uploadIcon = async (
    file: Express.Multer.File | undefined,
    color: string
) => {
    const time = new Date().getTime();
    const fileName = color + "-" + time + ".webp";

    if (!file) {
        return {
            success: false,
            message: "no file provided",
        };
    }

    let uploadPath = path.join(__dirname, "../", "uploads", "icons", fileName);

    try {
        const folderPath = path.join(__dirname, "../", "uploads", "icons");

        if (!fs.existsSync(folderPath)) {
            mkdir(folderPath, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }

        sharp(file.path)
            .resize(150, 150, {
                fit: "cover",
            })
            .webp({ quality: 70 })
            .toFile(uploadPath, async (err) => {
                if (err) {
                    fs.unlinkSync(file.path);
                    return { success: false, message: err };
                } else {
                    fs.unlinkSync(file.path);
                }
            });

        return `${process.env.BASE_URL}/api/icons-image/${fileName}`;
    } catch (error) {
        throw error;
    }
};
