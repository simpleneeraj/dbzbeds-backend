import { model, Schema, Document } from "mongoose";

interface IMagicLink extends Document {
    redirectTo: string;
    token: string;
    resendCount: number;
    updatedAt: string;
    createdAt: string;
}

const magicLinkSchema = new Schema<IMagicLink>(
    {
        redirectTo: {
            type: String,
            required: true,
        },
        resendCount: {
            type: Number,
            required: true,
            default: 0,
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<IMagicLink>("magicLinks", magicLinkSchema);
