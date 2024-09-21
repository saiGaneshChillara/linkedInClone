import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipent = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipent,
            subject: "Welcome to LinkedIn Clone",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        });

        console.log("Email sent successfully: ", response);
    } catch (err) {
        throw err;
    }
};