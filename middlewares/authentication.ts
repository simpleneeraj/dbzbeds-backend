import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/users";
import { decodeJWT, verifyJWT } from "../services/auth-services";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    console.log({ token });
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const verify = verifyJWT(token);

        if (!verify) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = decodeJWT(token) as any;

        if (decoded?.user?.role !== "admin") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};