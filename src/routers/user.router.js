const express = require('express');
const { signup, signin, sendEmailResetPass,
     confirmLink, listAccount, updatePassword,
    editAccount, updateAccount, deleteUserAccount, trashUserAccount, restoreUserAccount, forceDeleteUserAccount, listRole, viewDetailAccount } = require('../controllers/account.controller');
const verifySignUp = require('../middlerwares/verifySignUp.middleware');
const { verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');

const router = express.Router();

router.get('/list-role', [verifyToken, isAdmin], listRole  )
router.post('/signup',[verifyToken, isAdmin,verifySignUp.checkDuplicateEmail], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken], updatePassword)
router.get('/edit-account', [verifyToken],editAccount)
router.patch('/update-account', [verifyToken], updateAccount)

router.get('/list-account',[verifyToken, isAdmin], listAccount)
router.get('/view-detail-account/:accountID', [verifyToken], viewDetailAccount)
router.patch('/delete-user-account/:accountID', [verifyToken, isAdmin], deleteUserAccount)
router.get('/trash-user-account', [verifyToken, isAdmin], trashUserAccount)
router.post('/restore-user-account/:accountID', [verifyToken, isAdmin], restoreUserAccount)
router.delete('/force-delete-user-account/:accountID', [verifyToken, isAdmin], forceDeleteUserAccount)

router.post('/send-email-reset-password',sendEmailResetPass)
router.post('/confirmLink/:accountID/:token', confirmLink)



module.exports = router
