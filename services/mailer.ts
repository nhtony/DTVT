const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fet.sgu.h@gmail.com',
        pass: 'fet123321'
    }
});

export const sendEmail = async (subject: string, toEmail: any, content: string) => {
    const mailOptions = {
        from: 'dtvt.sgu@gmail.com',
        to: toEmail,
        subject: `[FET-SGU] ${subject}`,
        text: content
    };
    return await transporter.sendMail(mailOptions);
}