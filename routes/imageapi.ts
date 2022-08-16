import fs from 'fs';

import express from 'express';

import uploads from "../config/cloudinary";

import upload from "../config/multer";

const router = express()



router.use(upload.array('image'));

router.post(async (req: any, res: any) => {
    const uploader = async (path: any) => await uploads(path, 'Images');
    const urls = [];
    const files = req.files;

    for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath.url);
        fs.unlinkSync(path);
    }

    res.status(200).json(urls);
});

module.exports = router