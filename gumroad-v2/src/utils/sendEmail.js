const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: 'Sahil @ Gumroad <sahil@slavingia.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html // html body
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
