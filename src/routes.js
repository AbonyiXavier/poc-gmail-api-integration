const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/mail/send/:email', controllers.sendMail);
router.get('/mail/user/:email', controllers.getUser);
router.get('/mail/list/:email', controllers.getMails);
router.get('/mail/drafts/:email', controllers.getDrafts);
router.get('/mail/read/:email/:messageId', controllers.readMail);

module.exports = router;