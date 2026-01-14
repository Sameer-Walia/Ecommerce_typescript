import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

interface MailOptions
{
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_UNAME as string,
        pass: process.env.SMTP_PASS as string
    },
});


export const sendMail = async (mailOptions: MailOptions) =>
{
    try
    {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent :", info.response);
        return true
    }
    catch (error: any)
    {
        console.log("Email error :", error.message);
        return false
    }
};


