const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'datntgch18760@fpt.edu.vn', // TODO: your gmail account
    //         pass: 'Nguyendat102' // TODO: your gmail password
    //     }
    // });
    
    // // Step 2
    // let mailOptions = {
    //     from: 'datntgch18760@fpt.edu.vn', // TODO: email sender
    //     to: 'nguyentiendat12a8@gmail.com', // TODO: email receiver
    //     subject: 'Nodemailer - Test',
    //     text: 'Wooohooo it works!!'
    // };
    
    // // Step 3
    // transporter.sendMail(mailOptions, (err, data) => {
    //     if (err) {
    //         return console.log('Error occurs');
    //     }
    //     return console.log('Email sent!!!');
    // });
    try {
        const transporter = nodemailer.createTransport({
            //host: 'smtp.gmail.com',
            host: "smtp.gmail.com",
            service: 'gmail',
            port: 587,
            secure: false,
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