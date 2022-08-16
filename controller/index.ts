import path from "path";
import sharp from "sharp";
import fs, { PathLike } from "fs";
import { Request, Response } from "express";
import bedsVariants from "../models/bedsVariants";

export const updateAvatar = async (req: Request, res: Response, color: string) => {

    const { id } = req.params
    try {

        const time = new Date().getTime();
        const fileName = color + "-avatar-" + time + ".jpg";
        let compressImagePath = path.join(
            __dirname,
            "../",
            "upload",
            "beds",
            fileName
        );

        if (req?.file?.path) {
            sharp(req.file?.path)
                // .resize(200, 200)
                .jpeg({ quality: 80 })
                .toFile(compressImagePath, async (err) => {
                    if (err) {
                        fs.unlinkSync(req.file?.path as PathLike);
                        res.json({ success: false, message: err });
                    } else {
                        fs.unlinkSync(req.file?.path as PathLike);

                        await bedsVariants.findByIdAndUpdate(id, {
                            $set: {
                                avatar: `${process.env.BASE_URL}/user-avatar/${fileName}`,
                            },
                        });
                    }
                });
            return {
                success: true,
                message: "avatar uploaded successfully",
                url: `${process.env.BASE_URL}/user-avatar/${fileName}`,
            };
        } else {
            return {
                success: false,
                message: "no file uploaded",
            };
        }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
