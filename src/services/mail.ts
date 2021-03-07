import * as nodemailer from 'nodemailer';

class MailService {
    public async sendMail(mailSubject: string, mailBody: string, mailTo: string): Promise<void> {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.NODE_MAILER_EMAIL,
                    pass: process.env.NODE_MAILER_PASSWORD,
                },
            });

            // send mail with defined transport object
            await transporter.sendMail({
                from: process.env.NODE_MAILER_EMAIL,
                to: mailTo,
                subject: mailSubject,
                html: mailBody,
            });
        } catch (err) {
            console.log("Error occured while sending mail : ", err);
        }

    }
}

export { MailService }