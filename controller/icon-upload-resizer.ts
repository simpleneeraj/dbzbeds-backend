import path from "path";
import * as fs from "fs";
import sharp from "sharp";

export const resizeIconAndUpload = async (
    file: Express.Multer.File | undefined,
    filename: string
) => {
    if (!file) return undefined;

    const time = new Date().getTime();
    const fileName = `${filename}-${time}.webp`;

    const folderPath = path.join(__dirname, "../", "uploads", "icons");

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const uploadPath = path.join(
        __dirname,
        "../",
        "uploads",
        "icons",
        fileName
    );

    try {
        await sharp(file.path)
            .resize(150, 150, {
                fit: "cover",
            })
            .webp({ quality: 70 })
            .toFile(path.resolve(uploadPath));

        fs.unlinkSync(file.path);
        return `${process.env.BASE_URL}/icons-image/${fileName}`;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw error;
    }
};
