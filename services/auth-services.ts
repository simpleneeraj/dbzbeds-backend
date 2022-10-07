import jwt from "jsonwebtoken";
import users from "../models/users";
import bcrypt from "bcrypt";

//SIGN JWT
export const signJWT = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as any, {
        expiresIn: "24h",
    });
};

//VERIFY JWT
export const verifyJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as any);
};

//DECODE JWT
export const decodeJWT = (token: string) => {
    return jwt.decode(token);
};

//Login Service
export const loginService = async (email: string, password: string) => {
    const user = await users.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload = {
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
        },
    };

    const token = signJWT(payload);
    return token;
};

//Register Admin Service
export const registerAdminService = async (
    name: string,
    email: string,
    password: string
) => {
    const user = await users.findOne({ email });
    if (user) throw new Error("User already exists");
    if (!name || !email || !password) throw new Error("Please fill all fields");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });

    await newUser.save();
    return newUser;
};
