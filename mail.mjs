import nodemailer from 'nodemailer'

import { configDotenv } from 'dotenv'

configDotenv()

export async function mail(subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_ADDRESS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    })

    await new Promise((resolve, reject) => transporter.verify((err, success) => err ? reject(err) : resolve(success)))

    return await transporter.sendMail({
        from: `"Edward Yeung - Policy Watch" <${process.env.EMAIL_ADDRESS}>`,
        to: process.env.EMAIL_ADDRESS,
        subject,
        text,
        html: `<pre>${text}</pre>`
    })
}
