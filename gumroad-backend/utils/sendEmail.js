const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: '76a01b002@smtp-brevo.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: 'anshuljain3141@gmail.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html // html body
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
