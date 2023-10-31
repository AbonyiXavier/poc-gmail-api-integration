require('dotenv');

const fs = require('fs');
const path = require('path');
const templates = require('./templates/email')


const filePath = path.join(__dirname, 'attachments', 'debugging-tactics.jpeg');

const auth = {
    type: 'OAuth2',
    user: '<YOUR_GMAIL_ID>',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};


const { subject, body } = templates.emailTemplates.welcome;

const email = '<RECIPIENT_MAIL_ID>'

const messageBody = body({ email })

const mailOptions = {    
    to: email,
    from: '<YOUR_GMAIL_ID>',
    subject: subject,
    html: messageBody,
    attachments: [
        {
            filename: 'debugging-tactics.jpeg',
            content: fs.createReadStream(filePath),
        }
    ],
};

module.exports = {
    auth,
    mailOptions
}