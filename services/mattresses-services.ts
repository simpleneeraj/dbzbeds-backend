import mattresses, { IMattress } from "../models/mattresses";

//create mattress service
export const createMattressService = async (mattress: IMattress) => {
    const newMattress = new mattresses(mattress);
    return await newMattress.save();
};

//get mattress by id service
export const getMattressByIdService = async (id: string) => {
    return await mattresses.findById(id);
};

//get all mattresses service
export const getAllMattressesService = async () => {
    return await mattresses.find();
};

//update mattress service
export const updateMattressService = async (
    id: string,
    mattress: IMattress
) => {
    return await mattresses.findByIdAndUpdate(id, mattress);
};

//delete mattress service
export const deleteMattressService = async (id: string) => {
    return await mattresses.findByIdAndDelete(id);
};
