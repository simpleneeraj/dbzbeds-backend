import { Request, Response } from "express";
import { getUserService } from "../services/user-services";

export const getMyselfController = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        const getUser = await getUserService(user.id);
        res.status(200).json({ user: getUser });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
