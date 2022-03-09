const express = require('express');
const { signup, signin, sendEmailResetPass,
     confirmLink, listAccount, updatePassword,
    editAccount, updateAccount } = require('../controllers/account.controller');
const verifySignUp = require('../middlerwares/verifySignUp.middleware');
const { verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');

const router = express.Router();


router.post('/signup',[verifySignUp.checkDuplicateEmail], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken], updatePassword)
router.get('/edit-account', [verifyToken],editAccount)
router.patch('/update-account', [verifyToken], updateAccount)
router.get('/list-account',[verifyToken, isAdmin], listAccount)
router.post('/send-email-reset-password',verifyToken, sendEmailResetPass)
router.post('/confirmLink/:accountID/:token', confirmLink)



module.exports = router
