import nodemailer from 'nodemailer'
import keys from './oauth.json' with { type: 'json' }
import credentials from './credentials.json' with { type: 'json' }

export async function mail(subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: keys.emailAddress,
            clientId: credentials.installed.client_id,
            clientSecret: credentials.installed.client_secret,
            refreshToken: keys.refresh_token,
        },
    })

    await new Promise((resolve, reject) => transporter.verify((err, success) => err ? reject(err) : resolve(success)))

    return await transporter.sendMail({
        from: `"Edward Yeung - Policy Watch" <${keys.emailAddress}>`,
        to: keys.emailAddress,
        subject,
        text,
        html: `<pre>${text}</pre>`
    })
}
