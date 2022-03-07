const express = require('express');
const { signup, signin, sendEmailResetPass, confirmLink, listAccount } = require('../controllers/account.controller');
const {uploadAvatar, upload} = require('../utils/uploadFile');
const { createIdeas } = require('../controllers/ideas.controller')

const verifySignUp = require('../middlerwares/verifySignUp.middleware');
const { verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');

const router = express.Router();


router.post('/signup',[verifySignUp.checkDuplicateEmail], signup)
router.post('/signin', signin)
router.get('/listAccount',[verifyToken, isAdmin], listAccount)
router.post('/sendEmailResetPassword',verifyToken, sendEmailResetPass)
router.post('/confirmLink/:accountID/:token', confirmLink)



module.exports = router
