import multiplefile from "../models/multiplefile";
import MultipleFile from "../models/multiplefile";

import path from "path";
import * as fs from "fs";
import sharp from "sharp";

interface IDetails {
    name: string;
    price: string;
    des: string;
}

const multipleFileUpload = async (files: any, details: IDetails) => {
    if (!details.name || !details.price || !details.des) {
        throw Error("all fields are required");
    }
    let filesArray: any = [];
    files.forEach((element: any) => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
    });

    const multipleFiles = new MultipleFile({
        name: details.name,
        price: details.price,
        des: details.des,
        files: filesArray,
    });
    await multipleFiles.save();
    return "Files Uploaded Successfully";
};

//check file size here...
const fileSizeFormatter = (bytes: number, decimal: number) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) +
        " " +
        sizes[index]
    );
};
export default multipleFileUpload;

//  get all multiple beds 
export const getMultipleFilesService = async () => {
    const response = await multiplefile.find();
    return response;
};

// get multiple beds by id
export const getMultipleFilesByIdService = async (id: string) => {
    const response = await multiplefile.findById(id);
    return response;
};

// delete beds by id
export const deleteFileService = async (id: string) => {
    const deleteFile = await multiplefile.findByIdAndDelete(id);
    return deleteFile;
};

// resizeImageAndUpload
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
            .resize(1808, 678, {
                fit: "cover",
            })
            .webp({ quality: 70 })
            .toFile(path.resolve(uploadPath));

        fs.unlinkSync(file.path);
        return `${process.env.BASE_URL}/api/beds-image/${fileName}`;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw error;
    }
};

// resizeIconAndUpload
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
            .resize(200, 116, {
                fit: "cover",
            })
            .webp({ quality: 70 })
            .toFile(path.resolve(uploadPath));

        fs.unlinkSync(file.path);
        return `${process.env.BASE_URL}/api/icons-image/${fileName}`;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw error;
    }
};