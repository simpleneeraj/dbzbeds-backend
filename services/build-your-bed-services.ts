import accessoriesIcons from "../models/accessoriesIcons";
import buildYourBed from "../models/buildYourBed";
import buildYourBedColorVariants from "../models/buildYourBedColorVariants";
import buildYourBedVariants from "../models/buildYourBedVariants";

interface BuildYourBedPayload {
  name: string;
  description: string;
  categories?: string[];
  variants?: string[];
  slug: string;
  images: string[];
  isDraft: boolean;
}

export const createBuildYourBed = async (payload: BuildYourBedPayload) => {
  const bed = new buildYourBed(payload);
  await bed.save();
  return bed;
};

export const createBuildYourBedVariants = async (id: string, payload: any) => {
  const bedFind = await buildYourBed
    .findOne({ _id: id })
    .populate("variants", "size")
    .lean();

  if (!bedFind) {
    throw Error("Bed Not Found, Please Check Bed Id");
  }

  //CHECKING FOR DUPLICATE BED SIZES
  const bedVariants = (bedFind && bedFind.variants) || [];

  const findDuplicateBedSize = bedVariants.find(
    (variant: any) => variant.size === payload?.size
  );

  if (findDuplicateBedSize) {
    throw Error("Bed Size Already Exists");
  }

  const BedVarient = await buildYourBedVariants.create(
    payload,
    async (err: any, data: any) => {
      if (err) {
        throw Error(err);
      }
      await buildYourBed.findByIdAndUpdate(id, {
        $push: {
          variants: data._id,
        },
      });
    }
  );
  return BedVarient;
};

export const createBuildYourBedVariantsWithColor = async (
  id: string,
  payload: any
) => {
  const bedFind = await buildYourBedVariants.findById(id).lean();
  if (!bedFind) {
    throw Error("Bed Variant Not Found, Please Check Bed Variant Id");
  }
  const BedColorVarient = await buildYourBedColorVariants.create(
    payload,
    async (err: any, data: any) => {
      if (err) {
        throw Error(err);
      }
      await buildYourBedVariants.findByIdAndUpdate(id, {
        $push: {
          colors: data._id,
        },
      });
    }
  );
  return BedColorVarient;
};

export const getBuildYourBed = async (id: string) => {
  const bed = await buildYourBed
    .findOne({ _id: id as any })
    .populate("variants")
    .lean();
  return bed;
};

export const getBuildYourBeds = async () => {
  const beds = await buildYourBed.find().lean();
  return beds;
};

export const getBuildYourBedVariants = async (
  id: string,
  populate?: string
) => {
  const bed = await buildYourBedVariants
    .findOne({ _id: id as any })
    .populate(populate || "")
    .lean();
  return bed;
};

export const getBuildYourBedVariantsWithColor = async (id: string) => {
  const bed = await buildYourBedColorVariants
    .findOne({ _id: id as any })
    .populate("storage.name feet.name headboard.name mattress.name")
    .lean();
  return bed;
};

export const getAllBuildYourBedVariantsWithColor = async (id: string) => {
  const bed = await buildYourBedVariants
    .findOne({ _id: id as any })
    .populate("colors")
    .lean();
  return bed;
};

export const updateBuildYourBed = async (
  id: string,
  payload: BuildYourBedPayload
) => {
  const bed = await buildYourBed.findByIdAndUpdate(id, payload, { new: true });
  return bed;
};

export const deleteBuildYourBed = async (id: string) => {
  const bed = await buildYourBed.findByIdAndDelete(id);
  return bed;
};

export const updateBuildYourBedVariants = async (id: string, payload: any) => {
  const bedFind = await buildYourBedVariants.findById(id).lean();
  if (!bedFind) {
    throw Error("Bed Variant Not Found, Please Check Bed Variant Id");
  }
  const BedVarient = await buildYourBedVariants.findByIdAndUpdate(id, payload);
  return BedVarient;
};

export const updateBuildYourBedVariantsWithColor = async (
  id: string,
  payload: any
) => {
  const bedFind = await buildYourBedColorVariants.findById(id).lean();
  if (!bedFind) {
    throw Error("Bed Variant Not Found, Please Check Bed Variant Id");
  }
  const BedColorVarient = await buildYourBedColorVariants.findByIdAndUpdate(
    id,
    payload
  );
  return BedColorVarient;
};

export const deleteBuildYourBedVariants = async (id: string) => {
  const bedFind = await buildYourBedVariants
    .findById(id)
    .populate("colors", "color")
    .lean();
  if (!bedFind) {
    throw Error("Bed Variant Not Found, Please Check Bed Variant Id");
  }
  const BedVarient = await buildYourBedVariants.findByIdAndDelete(id);
  return BedVarient;
};

export const deleteBuildYourBedVariantsWithColor = async (id: string) => {
  const bedFind = await buildYourBedColorVariants.findById(id).lean();
  if (!bedFind) {
    throw Error("Bed Variant Not Found, Please Check Bed Variant Id");
  }
  const BedColorVarient = await buildYourBedColorVariants.findByIdAndDelete(id);
  return BedColorVarient;
};

export const getBuildYourBedBySize = async (size: string) => {
  const getCurrentSizeBed = (await buildYourBed
    .findOne({ $arrayElemAt: ["variants", 0] })
    .populate({
      path: "variants",
      populate: {
        path: "colors",
        populate: {
          path: "headboard.name storage.name feet.name mattress.name",
          select: "label value image",
        },
      },
      match: { size, isDraft: { $ne: true } },
    })
    .lean()) as any;

  const getAllbedSizes = (await buildYourBed
    .findOne({})
    .populate({
      path: "variants",
      select: "size -_id price",
      match: { isDraft: { $ne: true } },
    })
    .lean()) as any;
  console.log({ getAllbedSizes });

  await getCurrentSizeBed?.variants?.map(async (item: any) => {
    await item?.colors?.map(async (color: any) => {
      await accessoriesIcons
        .findOne(
          {
            value: color.color,
          },
          async (err: any, data: any) => {
            color.color = await data;
            console.log({ err, data });
          }
        )
        .clone();
    });
  });

  getCurrentSizeBed.availabeSizes = await Promise.all(
    getAllbedSizes?.variants?.map(async (item: any) => {
      const icon = (await accessoriesIcons
        .findOne({
          value: item.size,
        })
        .lean()) as any;

      if (icon) {
        icon.price = item?.price?.salePrice;
      }
      return icon;
    })
  );

  // getCurrentSizeBed.variants = await [getCurrentSizeBed.variants[0]];

  return getCurrentSizeBed;
};
