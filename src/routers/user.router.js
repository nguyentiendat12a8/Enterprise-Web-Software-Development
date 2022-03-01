const express = require('express');
const { signup, signin, sendEmailResetPass, confirmLink } = require('../controllers/account.controller');
const uploadAvatar = require('../middlerwares/uploadFile.middleware');
const verifySignUp = require('../middlerwares/verifySignUp.middleware');

const router = express.Router();


router.post('/signup',[verifySignUp.checkDuplicateEmail,verifySignUp.checkRolesExisted , uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)
//router.get('/allAccount', isAdmin)
router.post('/sendEmailResetPassword', sendEmailResetPass)
router.post('/confirmLink/:accountID/:token', confirmLink)

module.exports = router
