import { model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string | undefined;
    isRegistered: boolean;
}
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
    avatar: {
        type: String,
        required: false,
    },
    isRegistered: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export default model<IUser>("users", userSchema);
