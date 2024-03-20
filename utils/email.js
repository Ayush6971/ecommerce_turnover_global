const nodemailer = require('nodemailer');

const sendEmail = async (params) => {
    try {
        const { subject, to, html } = params;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions)

        return { message: 'Email sent successfully' }
    } catch (error) {
        console.log("🚀 ~ sendEmail ~ error:", error)
        throw new Error(error.message)
    }
}



module.exports = {
    sendEmail,
};