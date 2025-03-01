import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from 'dotenv';

dotenv.config();

const MAILGUN_API_URL = process.env.MAILGUN_API_URL || "";
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || "";
const MAILGUN_SENDER = process.env.MAILGUN_SENDER || "";
const MAILGUN_TEST_RECEIVER = process.env.MAILGUN_TEST_RECEIVER || "";

export async function sendVerificationEmail(receiver: string, otp: string): Promise<boolean> {
    try {
        let success = false;

        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: "api",
            key: MAILGUN_API_KEY,
        });
        const data = await mg.messages.create(MAILGUN_API_URL, {
            from: MAILGUN_SENDER,
            to: receiver,
            subject: "Testing from mailgun",
            text: `OTP: ${otp}`,
        });

        success = true;
        return success;
    } catch (error) {
        return false;
    }
}
