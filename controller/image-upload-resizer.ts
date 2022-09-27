import path from "path";
import * as fs from "fs";
import sharp from "sharp";

export const resizeImageAndUpload = async (
    file: Express.Multer.File | undefined,
    filename: string
) => {
    if (!file) return undefined;

    const time = new Date().getTime();
    const fileName = `${filename}-${time}.webp`;

    const folderPath = path.join(__dirname, "../", "uploads", "beds");

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const uploadPath = path.join(__dirname, "../", "uploads", "beds", fileName);

    try {
        await sharp(file.path)
            .resize(1920, 1080, {
                fit: "cover",
            })
            .webp({ quality: 70 })
            .toFile(path.resolve(uploadPath));

        fs.unlinkSync(file.path);
        return `${process.env.BASE_URL}/beds-image/${fileName}`;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw error;
    }
};
