import nodemailer from 'nodemailer';

const mailSender = async (email, subject, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            secure: false
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`
        });

        console.log("Info:", info);
        return info;
    } catch (error) {
        console.log("Error in mailSender:", error.message);
        return error.message;
    }
};

export {mailSender};