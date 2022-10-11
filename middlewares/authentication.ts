import { Request, Response, NextFunction } from "express";
import { decodeJWT, verifyJWT } from "../services/auth-services";

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = await decodeJWT(token);
        const verified = await verifyJWT(token);
        if (decoded && verified) {
            next();
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

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
