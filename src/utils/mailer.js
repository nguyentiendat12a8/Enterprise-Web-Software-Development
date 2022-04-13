const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'nguyentiendat.testnode@gmail.com',
                pass:'dat123456',
            },
        });

        await transporter.sendMail({
            from: 'nguyentiendat.testnode@gmail.com',
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