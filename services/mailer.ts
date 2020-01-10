const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fet.sgu.h@gmail.com',
        pass: 'fet123321'
    }
});

export const sendEmail = async (toEmail:string,content:string) => {
    const mailOptions = {
        from: 'dtvt.sgu@gmail.com',
        to: toEmail,
        subject: '[FET-SGU] Verification code',
        text: content
    };
    return await transporter.sendMail(mailOptions);
}