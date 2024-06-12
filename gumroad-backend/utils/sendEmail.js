const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'tristin.ebert79@ethereal.email',
        pass: 'nSEK7MAddVrjhQxuH5'
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: 'tristin.ebert79@ethereal.email', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html // html body
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
