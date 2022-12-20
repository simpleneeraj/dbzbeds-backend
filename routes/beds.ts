import { Request, Response, Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import upload from "../config/multer";
import { deleteImages, resizeImageAndUpload } from "../services/image-service";
import { isAdmin } from "../middlewares/authentication";
import accessoriesIcons from "../models/accessoriesIcons";
import beds from "../models/beds";
import bedsVariants from "../models/bedsVariants";
import path from "path";
import fs from "fs";

const router = Router();

router.post("/update-size", async (req, res) => {
  const { current_size, updated_size } = req.body as any;
  try {
    const updateSizeName = await bedsVariants.updateMany(
      { size: current_size },
      { $set: { size: updated_size } }
    );

    res.json({
      updateSizeName,
      message: "Size Updated Successfully",
      current_size,
      updated_size,
    });
  } catch (error) {
    res.status(500).send;
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query as any;
  try {
    const searchBeds = await beds
      .find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { categories: { $regex: q, $options: "i" } },
        ],
        slug: { $ne: "build-your-own-bed" },
        "variants.0": { $exists: true },
      })
      .populate({
        path: "variants",
        select: "image",
        perDocumentLimit: 1,
      })
      .select("name slug categories _id")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json(searchBeds);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/check-slug/:slug", async (req, res) => {
  const { slug } = req.params as any;
  try {
    const checkSlug = await beds.findOne({ slug });

    if (checkSlug) {
      res.json({
        success: false,
        message: "Slug already exists, Dont Use It.",
      });
    } else {
      res.json({
        success: true,
        message: "You Can Use This Slug",
      });
    }
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

//GET BED VARIANT BY ID
router.get("/get-bed-variant/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "ID is required",
      });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID provided." });
    }

    const getBedVariant = await bedsVariants.findById(id);

    if (!getBedVariant) {
      return res.status(400).json({ message: "No Bed Variant Found" });
    }

    res.status(200).json(getBedVariant);
  } catch (error) {
    res.status(500).send(error);
  }
});
// GET INITIAL DATA
router.get("/", async (req, res) => {
  let { page = 1, limit = 8 } = req.query;

  page = Number(page);
  limit = limit > 50 ? 50 : Number(limit);

  try {
    const getAllBeds = await beds
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    //Get Total Pages

    const totalBedsCount = await beds.countDocuments({});
    const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

    res.json({
      data: getAllBeds,
      totalPages: pages,
      nextPage: page < pages ? page + 1 : null,
    });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

// GET ALL BEDS WITH BASE IMAGE
router.get("/get-all-beds-with-base-image", async (req, res) => {
  const { page = 1, limit = 20, category } = req.query;

  const searchPayload: any = {
    "variants.0": { $exists: true },
    isDraft: { $ne: true },
    slug: { $ne: "build-your-own-bed" },
  };

  if (category) {
    searchPayload.categories = { $elemMatch: { $eq: category } };
  }

  try {
    const bedsWithBaseImage = (await beds
      .find(searchPayload)
      .populate({
        path: "variants",
        select: "_id accessories.color size price image",
        perDocumentLimit: 1,
      })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .lean()) as any;

    bedsWithBaseImage.map((bed: any) => {
      if (bed && bed?.variants[0]?.image) {
        bed.image = bed?.variants[0]?.image;
        bed.price = bed?.variants[0]?.price;
      }
    });
    //Get Total Pages

    const totalBedsCount = await beds.countDocuments(searchPayload);
    const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

    res.json({
      data: bedsWithBaseImage,
      totalPages: pages,
      nextPage: Number(page) < pages ? Number(page) + 1 : null,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get-all-beds-with-base-image-admin", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const bedsWithBaseImage = (await beds
      .find({})
      .populate({
        path: "variants",
        select: "_id accessories.color size price image",
        perDocumentLimit: 1,
      })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .lean()) as any;

    bedsWithBaseImage.map((bed: any) => {
      if (bed && bed?.variants[0]?.image) {
        bed.image = bed?.variants[0]?.image;
        bed.price = bed?.variants[0]?.price;
      }
    });

    //Get Total Pages

    const totalBedsCount = await beds.countDocuments({
      "variants.0": { $exists: true },
    });
    const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

    res.json({
      data: bedsWithBaseImage,
      totalPages: pages,
      nextPage: Number(page) < pages ? Number(page) + 1 : null,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get-bed-by-size/:size", async (req, res) => {
  const { size } = req.params as any;
  const { page = 1, limit = 20, category } = req.query;

  console.log("called");
  try {
    const findBeds = (await beds
      .find({
        //check if size is available in variants AFTER POPULATING
        "variants.isDraft": { $ne: true },
        categories: { $elemMatch: { $eq: category } },
      })
      .populate({
        path: "variants",
        populate: {
          path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
          select: "label value image",
        },
        match: { size, isDraft: { $ne: true } },
      })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .lean()) as any;

    findBeds.map((bed: any) => {
      if (bed && bed?.variants[0]?.image) {
        bed.image = bed?.variants[0]?.image;
        bed.price = bed?.variants[0]?.price;
      }
    });

    //Get Total Pages
    const totalBedsCount = await beds.countDocuments({});
    const pages = Math.ceil(Number(totalBedsCount) / Number(limit));

    res.json({
      data: findBeds,
      totalPages: pages,
      nextPage: Number(page) < pages ? Number(page) + 1 : null,
    });
  } catch (error: any) {
    res.status(500).send({ error: error?.message });
  }
});

// GET BED BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params as any;
  const { size } = req.query as any;
  try {
    if (isValidObjectId(id)) {
      console.log("⇄", id);
      if (size) {
        const getCurrentSizeBed = (await beds
          .findOne({ _id: id })
          .populate({
            path: "variants",
            populate: {
              path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
              select: "label value image",
            },
            match: { size, isDraft: { $ne: true } },
          })
          .lean()) as any;

        const getAllbedSizes = (await beds
          .findOne({ _id: id }, { variants: 1, _id: 0 })
          .populate({
            path: "variants",
            select: "size -_id price",
            match: { isDraft: { $ne: true } },
          })
          .lean()) as any;

        getCurrentSizeBed.availabeSizes = await Promise.all(
          getAllbedSizes?.variants?.map(async (item: any) => {
            const icon = (await accessoriesIcons
              .findOne({
                value: item.size,
              })
              .lean()) as any;

            console.log({ item: item });
            if (icon) {
              icon.price = item?.price?.salePrice;
            }
            return icon;
          })
        );

        res.send(getCurrentSizeBed);
      } else {
        const getAllBeds = await beds.findOne({ _id: id }).populate("variants");
        res.json(getAllBeds);
      }
    } else {
      // WHEN ID IS A SLUG THEN BEHAVIOUR SHOULD BE
      if (size) {
        const getCurrentSizeBed = (await beds
          .findOne({ slug: id })
          .populate({
            path: "variants",
            populate: {
              path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
              select: "label value image",
            },
            match: { size, isDraft: { $ne: true } },
          })
          .lean()) as any;

        const getAllbedSizes = (await beds
          .findOne({ slug: id }, { variants: 1, _id: 0 })
          .populate({
            path: "variants",
            select: "size -_id price",
            match: { isDraft: { $ne: true } },
          })
          .lean()) as any;

        getCurrentSizeBed.availabeSizes = await Promise.all(
          getAllbedSizes?.variants?.map(async (item: any) => {
            const icon = (await accessoriesIcons
              .findOne({
                value: item.size,
              })
              .lean()) as any;

            console.log({ item: item });
            if (icon) {
              icon.price = item?.price?.salePrice;
            }
            return icon;
          })
        );

        res.send(getCurrentSizeBed);
      } else {
        const getCurrentSizeBed = (await beds
          .findOne({ slug: id, $arrayElemAt: ["variants", 0] })
          .populate({
            path: "variants.0",
            populate: {
              path: "accessories.color.name accessories.headboard.name accessories.storage.name accessories.feet.name accessories.mattress.name",
              select: "label value image",
            },
            match: { isDraft: { $ne: true } },
          })
          .lean()) as any;

        const getAllbedSizes = (await beds
          .findOne({ slug: id }, { variants: 1, _id: 0 })
          .populate({
            path: "variants",
            select: "size -_id price",
            match: { isDraft: { $ne: true } },
          })
          .lean()) as any;

        getCurrentSizeBed.availabeSizes = await Promise.all(
          getAllbedSizes?.variants?.map(async (item: any) => {
            const icon = (await accessoriesIcons
              .findOne({
                value: item.size,
              })
              .lean()) as any;

            console.log({ item: item });
            if (icon) {
              icon.price = item?.price?.salePrice;
            }
            return icon;
          })
        );

        getCurrentSizeBed.variants = [getCurrentSizeBed.variants[0]];
        res.json(getCurrentSizeBed);
      }
    }
  } catch (error: any) {
    res.status(500).send(error);
  }
});

//UPLOAD NEW BED

router.post("/create", isAdmin, async (req: Request, res: Response) => {
  const { name, description, categories, slug, images } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Product name cannot be empty" });
  }
  if (!slug) {
    return res.status(400).json({ message: "Product slug cannot be empty" });
  }

  const findSlug = await beds.findOne({ slug }).lean();

  if (findSlug) {
    return res
      .status(400)
      .json({ message: "Slug already exists, Enter a unique Slug" });
  }

  try {
    const createBed = await beds.create({
      name,
      description,
      categories: Array.isArray(categories) ? categories : undefined,
      slug,
      images,
    });
    res.json({
      message: "Bed Created Successfully",
      data: createBed,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//ADD/CREATE BED VARIANTS
router.post("/add-bed/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  if (!req.body?.size) {
    return res.status(400).json({ message: "Bed Size cannot be empty." });
  }

  const bedFind = await beds
    .findOne({ _id: id })
    .populate("variants", "size")
    .lean();

  if (!bedFind) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  //CHECKING FOR DUPLICATE BED SIZES (START)
  const bedVariants = (bedFind && bedFind.variants) || [];

  const findDuplicateBedSize = bedVariants.find(
    (variant: any) => variant.size == req.body.size
  );

  if (findDuplicateBedSize) {
    return res.status(400).json({ message: "Size Already Exists" });
  }
  //CHECKING FOR DUPLICATE BED SIZES (END)

  bedsVariants.create(req.body, async (err: any, data: any) => {
    if (err) {
      return res.status(500).send(err);
    }
    await beds.findByIdAndUpdate(id, {
      $push: {
        variants: data._id,
      },
    });
    res.status(200).json({
      message: "Bed Added Successfully",
      data,
    });
  });
});

//UPDATE BED VARIANTS
router.patch("/update-bed-variant/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { size, image, price, accessories, isDraft } = req.body;

  const newImages = [
    image,
    ...accessories?.color?.map((item: any) => item.image),
  ];

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  const findBedVarient = bedsVariants.findById(id);

  if (!findBedVarient) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  const updatedBed = await bedsVariants.findByIdAndUpdate(
    { _id: id },
    {
      size,
      image,
      price,
      accessories,
      isDraft,
    }
  );

  if (!updatedBed) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  const oldImages = [
    updatedBed.image,
    ...updatedBed?.accessories?.color?.map((item: any) => item.image),
  ];

  const deletedImages = oldImages.filter(
    (image: any) => !newImages.includes(image)
  );

  if (deletedImages.length > 0) {
    await deleteImages(deletedImages, "../uploads/beds");
  }

  res.status(200).json({
    message: "Bed Variant Updated Succesfully",
    data: updatedBed,
  });
});

//Upload image
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Image is required",
      });
    }
    const imageUploadUrl = await resizeImageAndUpload(req.file, "red");
    res.send(imageUploadUrl);
  } catch (error: any) {
    res.status(500).send(error?.message);
  }
});

// UPDATE BED BY ID
router.patch("/update-bed/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }
  const newImages = req.body.images;

  try {
    const updatedData = await beds.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      categories: Array.isArray(req.body.categories)
        ? req.body.categories
        : undefined,
      isDraft: req.body.isDraft,
      images: req.body.images,
      slug: req.body.slug,
    });

    const oldImages = updatedData?.images || [];

    const deletedImages = oldImages.filter(
      (image: any) => !newImages.includes(image)
    );

    if (deletedImages.length > 0) {
      await deleteImages(deletedImages, "../uploads/beds");
    }

    res.json({ message: "Bed Updated Succesfully", data: updatedData });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

// DELETE BED BY ID
router.delete("/delete-bed/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBed = await beds.findByIdAndDelete(id);
    res.json({
      message: "Bed Deleted Succesfully",
      data: deletedBed,
    });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

// DELETE VARIANT BY ID
router.delete("/delete-bed-variant/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBed = await bedsVariants.findByIdAndDelete(id);
    res.json({
      message: "Bed Variant Deleted Succesfully",
      data: deletedBed,
    });
  } catch (error: any) {
    res.status(500).send(error);
  }
});

export default router;

/**
 * FOR IMAGE API
 */

//  const apiRoute = ({
//     onError(error, req, res) {
//       res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//     },
//     onNoMatch(req, res) {
//       res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//     },
//   });

//   router.use(upload.array('image'));

//   router.post(async (req, res) => {
//     const uploader = async (path) => await uploads(path, 'Images');
//     const urls = [];
//     const files = req.files;

//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath.url);
//       fs.unlinkSync(path);
//     }

//     res.status(200).json(urls);
//   });

//   export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };
