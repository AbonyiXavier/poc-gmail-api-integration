const axios = require('axios');
const { createConfig } = require('./utils');
const nodemailer = require('nodemailer');
const CONSTANTS = require('./constants');
const { google } = require('googleapis');
const util = require('util');


require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// send email with attachment via node mailer
const sendMail = async (req, res) => {
    try{
        const url = `https://www.googleapis.com/upload/gmail/v1/users/${req.params.email}/messages/send`;

        const accessToken = await oAuth2Client.getAccessToken();
        let token = accessToken.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                ...CONSTANTS.auth,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        const sendMailPromise = util.promisify(transport.sendMail).bind(transport);

        const mailOptionsWithStream = {
            ...CONSTANTS.mailOptions,
        };

        const sentMessageInfo = await sendMailPromise(mailOptionsWithStream);

        const response = await axios.post(url, {
            raw: Buffer.from(sentMessageInfo.messageId).toString('base64'),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/mixed',
            },
            params: {
                uploadType: 'resumable', //resumable, media, multipart
            },
        });

       return res.send({
            message: 'Email sent successfully',
            data: sentMessageInfo
        });
    }
    catch(error){
        console.log('sendMail failed', error);
        console.log('sendMail failed error', error.response.data.error);
        return res.send(error);
    }
}

const sendMailWithoutFileAttachment = async (req, res) => {
    try{

        const accessToken = await oAuth2Client.getAccessToken();
        let token = accessToken.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                ...CONSTANTS.auth,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            ...CONSTANTS.mailOptions,
        };

        const result = await transport.sendMail(mailOptions);

       return res.send({
            message: 'Email sent successfully',
            data: result
        });
    }
    catch(error){
        console.log('sendMailWithoutFileAttachment failed', error.response.data);
        return res.send(error);
    }
}

// fetch information about the a gmail user
const getUser = async (req, res) => {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);

        return res.json(response.data);
    }
    catch(error){
        console.log('get users', error.response.data.error.errors);
        return res.send(error);        
    }
}

// fetches mail list for a user
const getMails = async (req, res) => {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);

       return  res.json({
            message: 'List of mails fetched successfully',
            data: response.data
        });
    }
    catch(error){
        console.log("getMails", error.response.data);
        return res.send(error.data);
    }
}

// get all the draft of a user
const getDrafts = async (req, res)  => {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);

        return res.json({
            message: 'Drafts fetched successfully',
            data: response.data
        });
    }
    catch(error){
        console.log("getDrafts", error.response.data);
       return res.send(error);
    }
}

// Get an email from message ID
const readMail = async (req, res) => {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);

       return res.json({
            message: 'Email from message ID fetched successfully',
            data: response.data
        });
    }
    catch(error){
        console.log("readMail", error.response.data);
        return res.send(error);
    }
}

module.exports = {
    sendMail,
    getUser,
    getMails,
    getDrafts,
    readMail,
};