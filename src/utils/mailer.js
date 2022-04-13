const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            //host: 'smtp.ethereal.email',
            host: 'smtp.mailtrap.io',
            service: 'gmail',

            port: 2525,
            
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;