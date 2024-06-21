const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSCODE
    }
});


module.exports = {
    transporter: transporter
}