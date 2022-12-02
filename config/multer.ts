// import path from "path";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
// import * as fs from "fs";

// export const uploadPath = path.join(__dirname, "../", "uploads");

// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

const storage = multer.memoryStorage();
const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
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
