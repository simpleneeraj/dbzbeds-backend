import { Request as DefaultRequest, Response, NextFunction } from "express";
import multiplefile from "../models/multiplefile";
import MultipleFile from "../models/multiplefile";

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

{
    /* get all multiple beds */
}
export const getMultipleFilesService = async () => {
    const response = await multiplefile.find();
    return response;
};

{
    /* get multiple beds by id*/
}
export const getMultipleFilesByIdService = async (id: string) => {
    const response = await multiplefile.findById(id);
    return response;
};

{
    /* delete beds by id*/
}
export const deleteFileService = async (id: string) => {
    const deleteFile = await multiplefile.findByIdAndDelete(id);
    return deleteFile;
};
