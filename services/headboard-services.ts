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

//get all headboards service
export const getAllHeadboardsService = async () => {
    return await headboards.find();
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
