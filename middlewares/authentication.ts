import { Request, Response, NextFunction } from "express";
import { decodeJWT, verifyJWT } from "../services/auth-services";

export const isAuthenticated = async (
    req: Request & { user: any },
    res: Response,
    next: NextFunction
) => {
    const token = req?.cookies?.access_token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = decodeJWT(token) as any;
        const verified = verifyJWT(token);
        if (decoded && verified) {
            req.user = decoded?.user;
            next();
        } else {
            res.clearCookie("access_token");
            res.status(401).json({ message: "Unauthorized" });
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
