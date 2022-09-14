import path from "path";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

export const uploadPath = path.join(__dirname, "../", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // use ./public for herokuWeb and /tmp for Vercel
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter: fileFilter,
});

export default upload;
