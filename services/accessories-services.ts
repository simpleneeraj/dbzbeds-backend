//find headboard by id

import bedsVariants, { BedVarient } from "../models/bedsVariants";

export const findHeadboardByIdService = async (
    bedId: string,
    headboardId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const headboard = bed.accessories.headboard.find(
        (headboard) => headboard._id == headboardId
    );

    if (!headboard) {
        return null;
    }

    return headboard;
};

//find feet by id

export const findFeetByIdService = async (bedId: string, feetId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const feet = bed.accessories.feet.find((feet) => feet._id == feetId);

    if (!feet) {
        return null;
    }

    return feet;
};

//find storage by id

export const findStorageByIdService = async (
    bedId: string,
    storageId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const storage = bed.accessories.storage.find(
        (storage) => storage._id == storageId
    );

    if (!storage) {
        return null;
    }

    return storage;
};

//find mattress by id

export const findMattressByIdService = async (
    bedId: string,
    mattressId: string
) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const mattress = bed.accessories.mattress.find(
        (mattress) => mattress._id == mattressId
    );

    if (!mattress) {
        return null;
    }

    return mattress;
};

//find color by id

export const findColorByIdService = async (bedId: string, colorId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    const color = bed.accessories.color.find((color) => color._id == colorId);

    if (!color) {
        return null;
    }

    return color;
};

//find bed by id
export const findBedByIdService = async (bedId: string) => {
    const bed = await bedsVariants.findById(bedId);

    if (!bed) {
        throw new Error("Bed not found");
    }

    return bed;
};

//find accessories locally
export const findAccessoriesLocallyService = (
    bed: BedVarient,
    headboardId: string,
    feetId: string,
    mattressId: string,
    colorId: string,
    storageId: string
) => {
    const headboard = bed.accessories.headboard.find(
        (headboard) => headboard._id == headboardId
    );

    const feet = bed.accessories.feet.find((feet) => feet._id == feetId);

    const mattress = bed.accessories.mattress.find(
        (mattress) => mattress._id == mattressId
    );

    const color = bed.accessories.color.find((color) => color._id == colorId);

    const storage = bed.accessories.storage.find(
        (storage) => storage._id == storageId
    );

    const accessories = {
        headboard,
        feet,
        mattress,
        color,
        storage,
    };

    return accessories;
};
