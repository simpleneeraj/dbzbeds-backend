import path from "path";
import sharp from "sharp";
import fs, { PathLike } from "fs";
import { Request, Response } from "express";

export const uploadBedImage = async (req: Request, res: Response, color: string) => {
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
                        fit: 'cover',
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
                    })

                return {
                    success: true,
                    message: "Image uploaded successfully",
                    url: `${process.env.BASE_URL}/beds-image/${fileName}`,
                };

            } catch (error) {
                res.status(500).send(error)
            }

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
