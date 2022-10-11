import jwt from "jsonwebtoken";
import users from "../models/users";
import bcrypt from "bcrypt";
import { sendMagicLinkService } from "./email-services";
import magicLinks from "../models/magicLinks";
import uniqid from "uniqid";

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
            id: user._id,
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

//Register User Service
export const registerUserService = async (
    name: string,
    email: string,
    password: string,
    isRegistered: boolean
) => {
    if (!name || !email || !password) throw new Error("Please fill all fields");

    const user = await users.findOne({ email });
    if (user?.isRegistered) {
        throw new Error("User already exists");
    }
    //update user
    const hashedPassword = await bcrypt.hash(password, 10);
    if (user && !user?.isRegistered) {
        const updatedUser = await users.findOneAndUpdate(
            { email },
            {
                name,
                password: hashedPassword,
                isRegistered,
            },
            { new: true }
        );
        return updatedUser;
    }

    const newUser = new users({
        name,
        email,
        password: hashedPassword,
        role: "user",
        isRegistered,
    });

    await newUser.save();
    return newUser;
};

// export const createMagicLinkService = async (email: string) => {
//     const user = await users.findOne({ email });
//     if (!user) throw new Error("User not found");

//     const payload = {
//         user: {
//             id: user._id,
//             name: user.name,
//             role: user.role,
//         },
//     };

//     const jwt = await signJWT(payload);
//     const link = `${process.env.CLIENT_URL}/auth/verify?token=${jwt}`;

//     const newMagicLink = new magicLinks({
//         token: uniqid(),
//         link,
//     });

//     await newMagicLink.save();
//     const sendMagicLink = await sendMagicLinkService(user.email, link);
//     return sendMagicLink;
// };

// export const resendMagicLinkService = async (token: string, user: any) => {
//     const magicLink = await magicLinks.findOne({ token });
//     if (!magicLink) throw new Error("User not found");
//     if (!user) throw new Error("User not found");

//     if (magicLink.resendCount >= 3)
//         throw new Error(
//             "You have reached the maximum number of attempts. Please try again later"
//         );

//     if (magicLink.updatedAt) {
//         const now = new Date();
//         const updatedAtTime = new Date(magicLink.updatedAt);
//         const diff = now.getTime() - updatedAtTime.getTime();
//         const minutes = Math.floor(diff / 1000 / 60);
//         if (minutes < 1)
//             throw new Error("Please wait 60 seconds before trying again");
//     }

//     await magicLinks.findOneAndUpdate(
//         { token },
//         { $inc: { resendCount: 1 } },
//         { new: true }
//     );

//     const sendMagicLink = await sendMagicLinkService(
//         user?.email,
//         magicLink?.redirectTo
//     );

//     return sendMagicLink;
// };
