import users from "../models/users";

export const getUserService = (userId: string) => {
    return users.findById(userId).select("-password");
};
