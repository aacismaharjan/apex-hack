const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

const getFromEmail = () => {
    return process.env.NODE_ENV === 'production'
    ? process.env.SENDGRID_EMAIL
    : process.env.EMAIL_FROM;
}

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Apex ${getFromEmail()}`;
    }

    newTransport() {
        if(process.env.NODE_ENV === "production") {
            // Sendgrid
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                type: "login",
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug -template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html,
            text: htmlToText.convert(html),
        }

        // 3) Creates a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send(`welcome`, `Welcome to the Apex's Family!`);
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your Password reset token (valid for 10min)'
        )
    }
}