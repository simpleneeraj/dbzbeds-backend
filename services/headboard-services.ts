import headboards, { IHeadboard } from "../models/headboards";

//create headboard service

export const createHeadboardService = async (headboard: IHeadboard) => {
    const newHeadboard = new headboards(headboard);
    return await newHeadboard.save();
};

//get headboard by id service
export const getHeadboardByIdService = async (id: string) => {
    return await headboards.findById(id);
};
export const getHeadboardByIdServiceWithVariants = async (id: string) => {
    return await headboards.findById(id).populate("variants");
};

//get all headboards service
export const getAllHeadboardsService = async () => {
    return await headboards.find();
};

export const getHeadboardCountService = async (filter: any) => {
    return await headboards.countDocuments(filter);
};

export const getHeadboardWithVariantService = async (
    page: number | undefined,
    limit: number | undefined
) => {
    return (await headboards
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
};

//update headboard service
export const updateHeadboardService = async (
    id: string,
    headboard: IHeadboard
) => {
    return await headboards.findByIdAndUpdate(id, headboard);
};

//delete headboard service
export const deleteHeadboardService = async (id: string) => {
    return await headboards.findByIdAndDelete(id);
};
