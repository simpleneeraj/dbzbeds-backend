import { Request, Response } from "express";
import { loginService, registerAdminService } from "../services/auth-services";

export const handleLoginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginService(email, password);
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ success: true, message: "Login successful" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleAdminRegisterController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerAdminService(name, email, password);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
