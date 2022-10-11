import nodemailer from "nodemailer";
import { google } from "googleapis";
import { magicLinkTemplate } from "../templates/magic-link";

export const sendMagicLinkService = async (
    email: string,
    redirectTo: string
) => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    return new Promise(async (resolve, reject) => {
        const accessToken = oAuth2Client.getAccessToken((err: any, token) => {
            if (err) {
                reject(err);
            } else {
                return token;
            }
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "singheklavyaofficial@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
            tls: {
                rejectUnauthorized: true,
            },
        } as any);

        const message = {
            from: "dbzbeds@noreply <dbzbeds@gmail.com>",
            to: email,
            subject: "Dbzbeds - Verify Your Account",
            html: magicLinkTemplate({ redirectTo }),
        };

        transporter.sendMail(message, function (err, info) {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};
